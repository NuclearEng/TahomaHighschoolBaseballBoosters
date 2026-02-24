import path from 'path';
import fs from 'fs';

const DOWNLOADED_FILES_DIR = path.resolve(process.cwd(), '..', 'downloaded_files');

export function getDownloadedFilesDir(): string {
  return DOWNLOADED_FILES_DIR;
}

export function resolveFile(relativePath: string): string {
  return path.join(DOWNLOADED_FILES_DIR, relativePath);
}

export function fileExists(relativePath: string): boolean {
  return fs.existsSync(resolveFile(relativePath));
}

export function getFileMtime(absolutePath: string): number {
  try {
    return fs.statSync(absolutePath).mtimeMs;
  } catch {
    return 0;
  }
}

export async function findFiles(pattern: string, baseDir?: string): Promise<string[]> {
  const searchDir = baseDir || DOWNLOADED_FILES_DIR;
  const results: string[] = [];

  // Walk directory recursively to find matching files
  function walkDir(dir: string, filePattern: RegExp) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath, filePattern);
        } else if (filePattern.test(entry.name)) {
          results.push(fullPath);
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  // Convert glob-like pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');

  walkDir(searchDir, new RegExp(regexPattern));
  return results.sort();
}

// Logical name to file path mapping
export const FILE_MAP = {
  currentBudget: 'Treasurer/THS Baseball Boosters Budget July 2025-June 2026.xlsx',
  coachsFund: "Treasurer/Coach's Fund 25-26 Season.xlsx",
  squareTransactions2025: 'Treasurer/Square Transactions/2025/Square 2025.xlsx',
  bylaws: 'BOD Information/Bylaws 09_2025 Tahoma Baseball Boosters.docx',
  uniformInventory: 'Uniforms/EDITING 2026 Uniform Return & Inventory List.xlsx',
  rosters: '2025 Rosters.docx',
  financialReport: '2026 Financial and Operations Report/2026 Financial and Operations Report Draft.docx',
  bodPositions: 'BOD Information/BOD Positions_Descriptions.xlsx',
} as const;

export function resolveLogical(name: keyof typeof FILE_MAP): string {
  return resolveFile(FILE_MAP[name]);
}

export async function getHistoricalBudgetFiles(): Promise<string[]> {
  const [standardFiles, oldFormatFiles] = await Promise.all([
    findFiles('THS Baseball Boosters Budget July 202*.xlsx',
      path.join(DOWNLOADED_FILES_DIR, 'Treasurer')),
    findFiles('OLD FORMAT*THS Baseball Boosters Budget.xlsx',
      path.join(DOWNLOADED_FILES_DIR, 'Treasurer')),
  ]);
  return [...new Set([...standardFiles, ...oldFormatFiles])].sort();
}

/** Extract a M-D-YYYY date string from a filename for deduplication. */
function extractDateKey(filePath: string): string | null {
  const match = path.basename(filePath).match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

export async function getBoardAgendaFiles(): Promise<string[]> {
  // Agendas may live in either folder depending on when they were synced
  const [newFolder, oldFolder] = await Promise.all([
    findFiles('*.docx', path.join(DOWNLOADED_FILES_DIR, '2025-26 Board Meeting Agenda')),
    findFiles('*.docx', path.join(DOWNLOADED_FILES_DIR, '2026 Board Meeting Agenda')),
  ]);
  // Deduplicate by date — prefer new folder files over old
  const seenDates = new Set<string>();
  const results: string[] = [];
  for (const f of [...newFolder, ...oldFolder]) {
    const dateKey = extractDateKey(f);
    const key = dateKey || path.basename(f);
    if (!seenDates.has(key)) {
      seenDates.add(key);
      results.push(f);
    }
  }
  return results.sort();
}

export async function getMeetingMinutesFiles(): Promise<string[]> {
  // Board meeting records live in multiple places:
  // 1. "2025-26 Board Meeting Agenda" — current season agendas/minutes
  // 2. "2026 Board Meeting Agenda" — legacy folder
  // 3. "Secretary " — historical minutes archive (2022-2025)
  const [newBoardFiles, oldBoardFiles, secretaryFiles] = await Promise.all([
    findFiles('*.docx', path.join(DOWNLOADED_FILES_DIR, '2025-26 Board Meeting Agenda')),
    findFiles('*.docx', path.join(DOWNLOADED_FILES_DIR, '2026 Board Meeting Agenda')),
    findFiles('*.docx', path.join(DOWNLOADED_FILES_DIR, 'Secretary ')),
  ]);
  // Deduplicate by date — prefer new folder, then old folder, then secretary
  const seenDates = new Set<string>();
  const results: string[] = [];
  for (const f of [...newBoardFiles, ...oldBoardFiles, ...secretaryFiles]) {
    const dateKey = extractDateKey(f);
    const key = dateKey || path.basename(f);
    if (!seenDates.has(key)) {
      seenDates.add(key);
      results.push(f);
    }
  }
  return results.sort();
}

export async function getVolunteerFiles(): Promise<string[]> {
  return findFiles('2026*Team Needs.xlsx',
    path.join(DOWNLOADED_FILES_DIR, 'Volunteers'));
}

export async function getIRSDocuments(): Promise<string[]> {
  return findFiles('*.pdf',
    path.join(DOWNLOADED_FILES_DIR, 'Treasurer/IRS Documents'));
}

export async function getWASOSDocuments(): Promise<string[]> {
  return findFiles('*.pdf',
    path.join(DOWNLOADED_FILES_DIR, 'Treasurer/WA Secretary of State'));
}

export async function getInsuranceDocuments(): Promise<string[]> {
  return findFiles('*.pdf',
    path.join(DOWNLOADED_FILES_DIR, 'Treasurer/Insurance Policy'));
}

export async function getBankRecFiles(): Promise<string[]> {
  return findFiles('*.xlsx',
    path.join(DOWNLOADED_FILES_DIR, 'Treasurer/Bank Recs'));
}

export function getLastSyncTime(): Date {
  // Use the most recent mtime from key files as proxy for sync time
  const keyFiles = Object.values(FILE_MAP);
  let latestMtime = 0;
  for (const relPath of keyFiles) {
    const fullPath = resolveFile(relPath);
    const mtime = getFileMtime(fullPath);
    if (mtime > latestMtime) latestMtime = mtime;
  }
  return new Date(latestMtime);
}

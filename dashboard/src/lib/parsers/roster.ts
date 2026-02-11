import { parseDocxToHtml, parseDocxToText } from './word';
import { Player, RosterData } from '../types/operational';
import { cachedParse } from '../data/cache';
import { resolveLogical } from '../data/file-resolver';

// Roster docx structure (2025 Rosters.docx):
// Tab-separated: Name, Number, Grade
// Team headers in bold: "Varsity", "JV Gold", "JV Blue"
// Each line: "PlayerName\t\t\tNumber\t\t\tGrade"

function parseRosterText(text: string): RosterData {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const varsity: Player[] = [];
  const jvBlue: Player[] = [];
  const jvGold: Player[] = [];

  let currentTeam: 'Varsity' | 'JV Blue' | 'JV Gold' = 'Varsity';

  for (const line of lines) {
    // Check for team header
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('varsity') && !lowerLine.includes('jv')) {
      currentTeam = 'Varsity';
      const afterHeader = line.replace(/.*varsity\s*/i, '').trim();
      if (afterHeader) {
        const player = parsePlayerLine(afterHeader, currentTeam);
        if (player) varsity.push(player);
      }
      continue;
    }
    if (lowerLine.includes('jv blue')) {
      currentTeam = 'JV Blue';
      const afterHeader = line.replace(/.*jv blue\s*/i, '').trim();
      if (afterHeader) {
        const player = parsePlayerLine(afterHeader, currentTeam);
        if (player) jvBlue.push(player);
      }
      continue;
    }
    if (lowerLine.includes('jv gold')) {
      currentTeam = 'JV Gold';
      const afterHeader = line.replace(/.*jv gold\s*/i, '').trim();
      if (afterHeader) {
        const player = parsePlayerLine(afterHeader, currentTeam);
        if (player) jvGold.push(player);
      }
      continue;
    }
    if (lowerLine.includes('jv') && !lowerLine.includes('jv blue') && !lowerLine.includes('jv gold')) {
      // Generic JV header — default to JV Blue
      currentTeam = 'JV Blue';
      const afterHeader = line.replace(/.*jv\s*/i, '').trim();
      if (afterHeader) {
        const player = parsePlayerLine(afterHeader, currentTeam);
        if (player) jvBlue.push(player);
      }
      continue;
    }
    // Skip C-Team / Freshman headers (no C-Team in program)
    if (lowerLine.includes('c-team') || lowerLine.includes('c team') || lowerLine.includes('freshman')) {
      continue;
    }

    // Skip header lines
    if (lowerLine === 'name' || lowerLine.includes('name\t') || lowerLine.startsWith('name ')) continue;

    const player = parsePlayerLine(line, currentTeam);
    if (player) {
      if (currentTeam === 'Varsity') varsity.push(player);
      else if (currentTeam === 'JV Blue') jvBlue.push(player);
      else if (currentTeam === 'JV Gold') jvGold.push(player);
    }
  }

  return { varsity, jvBlue, jvGold };
}

function parsePlayerLine(line: string, team: Player['team']): Player | null {
  // Split by tabs
  const parts = line.split('\t').map(p => p.trim()).filter(Boolean);
  if (parts.length < 1) return null;

  // Name is first, number and grade follow
  const name = parts[0];
  if (!name || name.length < 2) return null;

  // Skip lines that look like headers
  if (name.toLowerCase() === 'name' || name.toLowerCase() === 'number') return null;

  const number = parts.length > 1 ? parts[1] : undefined;
  const grade = parts.length > 2 ? parts[2] : undefined;

  return { name, number, grade, team };
}

export async function getRosters(): Promise<RosterData> {
  const filePath = resolveLogical('rosters');
  return cachedParse(filePath, async (fp) => {
    const text = await parseDocxToText(fp);
    return parseRosterText(text);
  });
}

export async function getRosterHtml(): Promise<string> {
  const filePath = resolveLogical('rosters');
  return cachedParse(filePath + ':html', async (fp) => {
    return parseDocxToHtml(fp);
  });
}

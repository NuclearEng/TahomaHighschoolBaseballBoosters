import * as XLSX from 'xlsx';
import fs from 'fs';

export function readWorkbook(filePath: string): XLSX.WorkBook {
  const buffer = fs.readFileSync(filePath);
  return XLSX.read(buffer, { type: 'buffer', cellDates: true });
}

export function getSheetData(
  workbook: XLSX.WorkBook,
  sheetName?: string
): unknown[][] {
  const name = sheetName || workbook.SheetNames[0];
  const sheet = workbook.Sheets[name];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown[][];
}

export function getSheetAsObjects<T = Record<string, unknown>>(
  workbook: XLSX.WorkBook,
  sheetName?: string
): T[] {
  const name = sheetName || workbook.SheetNames[0];
  const sheet = workbook.Sheets[name];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet) as T[];
}

export function parseNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[$,\s]/g, '').replace(/\(([^)]+)\)/, '-$1');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export function parseDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  if (typeof value === 'string' && value.trim()) {
    // Try to parse various date formats
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
    return value.trim();
  }
  if (typeof value === 'number') {
    // Excel serial date
    const d = new Date((value - 25569) * 86400 * 1000);
    return d.toISOString().split('T')[0];
  }
  return '';
}

export function findHeaderRow(data: unknown[][], searchTerms: string[]): number {
  for (let i = 0; i < Math.min(data.length, 20); i++) {
    const row = data[i];
    if (!row) continue;
    const rowStr = row.map(c => String(c).toLowerCase()).join(' ');
    const matches = searchTerms.filter(term => rowStr.includes(term.toLowerCase()));
    if (matches.length >= 2) return i;
  }
  return 0;
}

export function getCellValue(data: unknown[][], row: number, col: number): unknown {
  if (row < 0 || row >= data.length) return '';
  if (col < 0 || col >= (data[row] as unknown[]).length) return '';
  return data[row][col];
}

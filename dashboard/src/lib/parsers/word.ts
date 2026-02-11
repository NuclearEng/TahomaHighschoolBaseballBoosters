import mammoth from 'mammoth';
import fs from 'fs';

export async function parseDocxToHtml(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='List Paragraph'] => li:fresh",
      ],
    }
  );
  return result.value;
}

export async function parseDocxToText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export function extractDateFromFilename(filename: string): string | null {
  // Try patterns like "1-14-2026", "10-28-2025", "12-10-2025"
  const dateMatch = filename.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (dateMatch) {
    const [, month, day, year] = dateMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Try "MM.DD.YYYY" or "MM_DD_YYYY" (4-digit year)
  const altMatch = filename.match(/(\d{1,2})[._](\d{1,2})[._](\d{4})/);
  if (altMatch) {
    const [, month, day, year] = altMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Try "MM_DD_YY" (2-digit year, e.g. 01_11_25, 8_13_24)
  const shortYearMatch = filename.match(/(\d{1,2})[._](\d{1,2})[._](\d{2})(?!\d)/);
  if (shortYearMatch) {
    const [, month, day, shortYear] = shortYearMatch;
    const year = `20${shortYear}`;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Try year-only patterns
  const yearMonth = filename.match(/(\d{4})/);
  if (yearMonth) return yearMonth[1];

  return null;
}

import { readWorkbook, getSheetData, parseNumber, parseDate } from './excel';
import { CoachsFundData, CoachsFundEntry } from '../types/financial';
import { cachedParse } from '../data/cache';
import { resolveLogical } from '../data/file-resolver';

// Structure: Sheet1
// Row 0: "2025 - 2026 COACH'S DISCRETIONARY FUND"
// Row 1: empty
// Row 2: headers ["DATE", "AMOUNT", "DESCRIPTION"]
// Row 3+: data rows (date as serial, amount, description)
// Last populated row: totals with "Remaining amount"

function parseCoachsFundFile(filePath: string): CoachsFundData {
  const wb = readWorkbook(filePath);
  const data = getSheetData(wb);

  const entries: CoachsFundEntry[] = [];
  let startingBalance = 0;
  let runningBalance = 0;

  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (!row) continue;

    const amount = parseNumber(row[1]);
    const description = String(row[2] || '').trim();

    if (!description && amount === 0) continue;

    const dateVal = row[0];
    let dateStr = '';
    if (typeof dateVal === 'number' && dateVal > 1000) {
      const d = new Date((dateVal - 25569) * 86400 * 1000);
      dateStr = d.toISOString().split('T')[0];
    } else if (dateVal instanceof Date) {
      dateStr = dateVal.toISOString().split('T')[0];
    } else if (dateVal) {
      dateStr = parseDate(dateVal);
    }

    if (description.toLowerCase().includes('beginning amount') || description.toLowerCase().includes('starting')) {
      startingBalance = amount;
      runningBalance = amount;
    } else if (description.toLowerCase().includes('remaining')) {
      // This is the final balance row
      continue;
    } else if (amount !== 0) {
      if (description.toLowerCase().includes('beginning')) {
        startingBalance = amount;
        runningBalance = amount;
      } else {
        runningBalance += amount;
      }
    }

    entries.push({
      date: dateStr,
      description: description || (amount > 0 ? 'Deposit' : 'Expense'),
      amount,
      balance: runningBalance,
    });
  }

  // If we didn't find a starting balance, use the first entry
  if (startingBalance === 0 && entries.length > 0) {
    startingBalance = entries[0].amount;
  }

  return {
    startingBalance,
    entries,
    currentBalance: runningBalance,
  };
}

export async function getCoachsFund(): Promise<CoachsFundData> {
  const filePath = resolveLogical('coachsFund');
  return cachedParse(filePath, async (fp) => parseCoachsFundFile(fp));
}

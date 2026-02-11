import { readWorkbook, getSheetData, parseNumber, parseDate } from './excel';
import { Transaction, TransactionSummary } from '../types/financial';
import { cachedParse } from '../data/cache';
import { resolveLogical } from '../data/file-resolver';

// Square 2025 structure:
// Sheets named by month (Mar2025, etc.)
// Row 0: headers ["Date", "Item", "Payment Type", "Gross Sales", "Fees", "Net Total", "Customer Name", "Deposit Date"]
// Row 1+: data rows. Dates are Excel serial numbers.
// Last row with data is a totals row.

function excelSerialToDate(serial: number): string {
  if (!serial || serial < 1000) return '';
  const d = new Date((serial - 25569) * 86400 * 1000);
  return d.toISOString().split('T')[0];
}

function parseTransactionsFile(filePath: string): Transaction[] {
  const wb = readWorkbook(filePath);
  const transactions: Transaction[] = [];

  for (const sheetName of wb.SheetNames) {
    const data = getSheetData(wb, sheetName);
    if (data.length < 2) continue;

    // Skip header row (row 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[0]) continue;

      const grossSales = parseNumber(row[3]);
      const fees = parseNumber(row[4]);
      const net = parseNumber(row[5]);

      // Skip totals row (no date) and empty rows
      if (grossSales === 0 && fees === 0 && net === 0) continue;

      const dateVal = row[0];
      let dateStr: string;
      if (typeof dateVal === 'number') {
        dateStr = excelSerialToDate(dateVal);
      } else if (dateVal instanceof Date) {
        dateStr = dateVal.toISOString().split('T')[0];
      } else {
        dateStr = parseDate(dateVal);
      }

      if (!dateStr) continue;

      transactions.push({
        date: dateStr,
        description: String(row[1] || '').trim(),
        category: String(row[2] || '').trim(),
        amount: grossSales,
        fees: Math.abs(fees),
        net,
        paymentMethod: String(row[2] || '').trim(),
      });
    }
  }

  return transactions.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getTransactions(): Promise<Transaction[]> {
  const filePath = resolveLogical('squareTransactions2025');
  return cachedParse(filePath, async (fp) => parseTransactionsFile(fp));
}

export async function getTransactionSummary(): Promise<TransactionSummary> {
  const transactions = await getTransactions();

  const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0);
  const totalFees = transactions.reduce((s, t) => s + t.fees, 0);
  const totalNet = transactions.reduce((s, t) => s + t.net, 0);

  // Group by month
  const monthMap = new Map<string, { revenue: number; fees: number; net: number; count: number }>();
  for (const t of transactions) {
    const month = t.date.substring(0, 7); // YYYY-MM
    const existing = monthMap.get(month) || { revenue: 0, fees: 0, net: 0, count: 0 };
    existing.revenue += t.amount;
    existing.fees += t.fees;
    existing.net += t.net;
    existing.count++;
    monthMap.set(month, existing);
  }

  // Group by category
  const catMap = new Map<string, { total: number; count: number }>();
  for (const t of transactions) {
    const cat = t.description || 'Other';
    const existing = catMap.get(cat) || { total: 0, count: 0 };
    existing.total += t.amount;
    existing.count++;
    catMap.set(cat, existing);
  }

  return {
    totalRevenue,
    totalFees,
    totalNet,
    transactionCount: transactions.length,
    byMonth: Array.from(monthMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    byCategory: Array.from(catMap.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.total - a.total),
  };
}

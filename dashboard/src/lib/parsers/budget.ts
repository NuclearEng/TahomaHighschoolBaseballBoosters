import { readWorkbook, getSheetData, parseNumber } from './excel';
import { BudgetData, BudgetCategory, BudgetLineItem, HistoricalBudget, MonthlyBudgetData, HistoricalRevenueBySource } from '../types/financial';
import { cachedParse, cachedMultiParse } from '../data/cache';
import { resolveLogical, getHistoricalBudgetFiles, resolveFile } from '../data/file-resolver';

const MONTHS = ['July', 'August', 'September', 'October', 'November', 'December',
  'January', 'February', 'March', 'April', 'May', 'June'];

// Column indices based on actual spreadsheet structure:
// A(0)=empty, B(1)=label, C-N(2-13)=months Jul-Jun, O(14)=empty, P(15)=Budget, Q(16)=empty, R(17)=Actual, S(18)=empty, T(19)=Remaining
const COL_LABEL = 1;
const COL_MONTH_START = 2; // Column C = July
const COL_BUDGET = 15;     // Column P
const COL_ACTUAL = 17;     // Column R
const COL_REMAINING = 19;  // Column T

function parseBudgetFile(filePath: string): BudgetData {
  const wb = readWorkbook(filePath);
  const data = getSheetData(wb);

  // Extract fiscal year from first few rows
  let fiscalYear = 'Unknown';
  for (let i = 0; i < 5; i++) {
    const rowStr = data[i]?.map(String).join(' ') || '';
    // Match "July 2025 - June 2026" or "July 1, 2025 through ... June 30, 2026"
    const fyMatch = rowStr.match(/July\s+\d*,?\s*(\d{4}).*?June\s+\d*,?\s*(\d{4})/i);
    if (fyMatch) {
      fiscalYear = `FY ${fyMatch[1]}-${fyMatch[2]}`;
      break;
    }
    const altMatch = rowStr.match(/20\d{2}\s*[-–]\s*20\d{2}/);
    if (altMatch) {
      fiscalYear = `FY ${altMatch[0]}`;
      break;
    }
  }

  // Find revenue section (row with label starting "Revenue" or first income item)
  let revenueStartRow = -1;
  let revenueTotalRow = -1;
  let expenseStartRow = -1;
  let expenseTotalRow = -1;

  for (let i = 0; i < data.length; i++) {
    const label = String(data[i]?.[COL_LABEL] || '').trim();

    // Revenue items are between rows ~7-15, Expenses ~16-50 based on actual data
    if (label === 'Concessions' && revenueStartRow === -1) revenueStartRow = i;

    // Revenue total row: unlabeled row with a budget value > $10k after at least 3 revenue items
    if (revenueStartRow > 0 && revenueTotalRow === -1 && !label) {
      const budgetVal = parseNumber(data[i]?.[COL_BUDGET]);
      if (budgetVal > 10000 && i > revenueStartRow + 3) {
        revenueTotalRow = i;
      }
    }

    if (!label) continue;

    if (label === 'Annual Report WA SOS' || (revenueTotalRow > 0 && expenseStartRow === -1 && label.length > 2 && i > revenueTotalRow)) {
      if (expenseStartRow === -1) expenseStartRow = i;
    }
  }

  // Find expense total (unlabeled row with significant budget value after expense items)
  if (expenseStartRow > 0) {
    for (let i = expenseStartRow + 5; i < Math.min(data.length, 80); i++) {
      const label = String(data[i]?.[COL_LABEL] || '').trim();
      const budgetVal = parseNumber(data[i]?.[COL_BUDGET]);
      if (budgetVal > 5000 && !label) {
        expenseTotalRow = i;
        break;
      }
    }
  }

  function extractLineItems(startRow: number, endRow: number): BudgetLineItem[] {
    const items: BudgetLineItem[] = [];
    for (let i = startRow; i < endRow; i++) {
      const label = String(data[i]?.[COL_LABEL] || '').trim();
      if (!label) continue;
      // Skip section header rows
      if (label === 'Revenue' || label === 'Expenses') continue;

      const budgeted = parseNumber(data[i]?.[COL_BUDGET]);
      const actual = parseNumber(data[i]?.[COL_ACTUAL]);
      const remaining = parseNumber(data[i]?.[COL_REMAINING]);

      items.push({
        category: label.includes('Expense') ? 'Expenses' : 'Revenue',
        subcategory: label,
        budgeted,
        actual,
        remaining,
        percentUsed: budgeted > 0 ? (actual / budgeted) * 100 : 0,
      });
    }
    return items;
  }

  const incomeItems = extractLineItems(revenueStartRow || 8, revenueTotalRow || 15);
  const expenseItems = extractLineItems(expenseStartRow || 17, expenseTotalRow || 50);

  const totalIncomeBudgeted = parseNumber(data[revenueTotalRow || 15]?.[COL_BUDGET]);
  const totalIncomeActual = parseNumber(data[revenueTotalRow || 15]?.[COL_ACTUAL]);
  const totalExpenseBudgeted = parseNumber(data[expenseTotalRow || 50]?.[COL_BUDGET]);
  const totalExpenseActual = parseNumber(data[expenseTotalRow || 50]?.[COL_ACTUAL]);

  const incomeCategory: BudgetCategory = {
    name: 'Revenue',
    items: incomeItems,
    totalBudgeted: totalIncomeBudgeted || incomeItems.reduce((s, i) => s + i.budgeted, 0),
    totalActual: totalIncomeActual || incomeItems.reduce((s, i) => s + i.actual, 0),
    totalRemaining: incomeItems.reduce((s, i) => s + i.remaining, 0),
  };

  const expenseCategory: BudgetCategory = {
    name: 'Expenses',
    items: expenseItems,
    totalBudgeted: totalExpenseBudgeted || expenseItems.reduce((s, i) => s + i.budgeted, 0),
    totalActual: totalExpenseActual || expenseItems.reduce((s, i) => s + i.actual, 0),
    totalRemaining: expenseItems.reduce((s, i) => s + i.remaining, 0),
  };

  // Extract checking balance from row ~51
  let checkingEndRow = -1;
  for (let i = (expenseTotalRow || 50); i < Math.min(data.length, 70); i++) {
    const label = String(data[i]?.[COL_LABEL] || '').trim();
    if (label.includes('Checking Balance - Ending')) {
      checkingEndRow = i;
      break;
    }
  }

  return {
    fiscalYear,
    startDate: fiscalYear.includes('-') ? `${fiscalYear.split('-')[0].replace('FY ', '')}07-01` : '',
    endDate: fiscalYear.includes('-') ? `${fiscalYear.split('-')[1]}06-30` : '',
    income: [incomeCategory],
    expenses: [expenseCategory],
    totalIncome: { budgeted: incomeCategory.totalBudgeted, actual: incomeCategory.totalActual },
    totalExpenses: { budgeted: expenseCategory.totalBudgeted, actual: expenseCategory.totalActual },
    netIncome: {
      budgeted: incomeCategory.totalBudgeted - expenseCategory.totalBudgeted,
      actual: incomeCategory.totalActual - expenseCategory.totalActual,
    },
  };
}

export async function getCurrentBudget(): Promise<BudgetData> {
  const filePath = resolveLogical('currentBudget');
  return cachedParse(filePath, async (fp) => parseBudgetFile(fp));
}

export async function getMonthlyData(): Promise<MonthlyBudgetData[]> {
  const filePath = resolveLogical('currentBudget');
  return cachedParse(filePath + ':monthly', async () => {
    const wb = readWorkbook(filePath);
    const data = getSheetData(wb);

    // Find the revenue total row and expense total row to get monthly figures
    // Row 15 is revenue totals, Row 50 is expense totals (approx), Row 5 is checking beginning
    const monthly: MonthlyBudgetData[] = [];

    // Find revenue total row (row with sum of income)
    let revTotalRow = -1;
    let expTotalRow = -1;
    for (let i = 5; i < 60; i++) {
      const label = String(data[i]?.[COL_LABEL] || '').trim();
      if (!label) {
        const val = parseNumber(data[i]?.[COL_BUDGET]);
        if (val > 20000 && revTotalRow === -1) revTotalRow = i;
        else if (val > 20000 && revTotalRow > 0 && expTotalRow === -1) expTotalRow = i;
      }
    }

    for (let m = 0; m < 12; m++) {
      const col = COL_MONTH_START + m;
      // Sum all revenue items for this month
      let income = 0;
      let expenses = 0;

      // Revenue items are between rows revenueStart and revTotalRow
      if (revTotalRow > 0) {
        for (let r = 7; r < revTotalRow; r++) {
          income += parseNumber(data[r]?.[col]);
        }
      }

      // Expense items
      if (expTotalRow > 0) {
        for (let r = revTotalRow + 2; r < expTotalRow; r++) {
          expenses += parseNumber(data[r]?.[col]);
        }
      }

      monthly.push({
        month: MONTHS[m],
        budgetedIncome: 0,
        actualIncome: income,
        budgetedExpenses: 0,
        actualExpenses: expenses,
      });
    }

    return monthly;
  });
}

export async function getHistoricalBudgets(): Promise<HistoricalBudget[]> {
  const files = await getHistoricalBudgetFiles();

  return cachedMultiParse(files, async (fps) => {
    const results: HistoricalBudget[] = [];
    const seenFY = new Set<string>();
    for (const fp of fps) {
      try {
        const budget = parseBudgetFile(fp);
        if (budget.fiscalYear === 'Unknown') continue;
        if (seenFY.has(budget.fiscalYear)) continue;
        seenFY.add(budget.fiscalYear);
        results.push({
          fiscalYear: budget.fiscalYear,
          totalIncome: budget.totalIncome.actual || budget.totalIncome.budgeted,
          totalExpenses: budget.totalExpenses.actual || budget.totalExpenses.budgeted,
          netIncome: (budget.totalIncome.actual || budget.totalIncome.budgeted) -
                     (budget.totalExpenses.actual || budget.totalExpenses.budgeted),
        });
      } catch {
        // Skip files that can't be parsed
      }
    }
    return results.sort((a, b) => a.fiscalYear.localeCompare(b.fiscalYear));
  }, 'historical-budgets');
}

export async function getCheckingSavingsBalances(): Promise<{ checking: number; savings: number }> {
  const filePath = resolveLogical('currentBudget');
  return cachedParse(filePath + ':balances', async () => {
    const wb = readWorkbook(filePath);
    const data = getSheetData(wb);

    let checking = 0;
    let savings = 0;

    for (let i = 0; i < Math.min(data.length, 70); i++) {
      const label = String(data[i]?.[COL_LABEL] || '').trim();
      if (label.includes('Checking Balance - Ending')) {
        // Get the most recent non-zero value from monthly columns
        for (let c = 13; c >= COL_MONTH_START; c--) {
          const val = parseNumber(data[i]?.[c]);
          if (val > 0) { checking = val; break; }
        }
      }
      if (label.includes('Savings Balance - Ending')) {
        for (let c = 13; c >= COL_MONTH_START; c--) {
          const val = parseNumber(data[i]?.[c]);
          if (val > 0) { savings = val; break; }
        }
      }
    }

    return { checking, savings };
  });
}

export async function getHistoricalRevenueBySource(): Promise<HistoricalRevenueBySource[]> {
  const files = await getHistoricalBudgetFiles();

  return cachedMultiParse(files, async (fps) => {
    const results: HistoricalRevenueBySource[] = [];
    const seenFY = new Set<string>();
    for (const fp of fps) {
      try {
        const budget = parseBudgetFile(fp);
        if (budget.fiscalYear === 'Unknown') continue;
        if (seenFY.has(budget.fiscalYear)) continue;
        seenFY.add(budget.fiscalYear);

        const revenueItems = budget.income.flatMap(cat => cat.items);
        results.push({
          fiscalYear: budget.fiscalYear,
          sources: revenueItems.map(item => ({
            name: item.subcategory,
            budgeted: item.budgeted,
            actual: item.actual,
          })),
        });
      } catch {
        // Skip files that can't be parsed
      }
    }
    return results.sort((a, b) => a.fiscalYear.localeCompare(b.fiscalYear));
  }, 'historical-revenue-by-source');
}

export interface BudgetLineItem {
  category: string;
  subcategory: string;
  budgeted: number;
  actual: number;
  remaining: number;
  percentUsed: number;
}

export interface BudgetCategory {
  name: string;
  items: BudgetLineItem[];
  totalBudgeted: number;
  totalActual: number;
  totalRemaining: number;
}

export interface BudgetData {
  fiscalYear: string;
  startDate: string;
  endDate: string;
  income: BudgetCategory[];
  expenses: BudgetCategory[];
  totalIncome: { budgeted: number; actual: number };
  totalExpenses: { budgeted: number; actual: number };
  netIncome: { budgeted: number; actual: number };
}

export interface MonthlyBudgetData {
  month: string;
  budgetedIncome: number;
  actualIncome: number;
  budgetedExpenses: number;
  actualExpenses: number;
}

export interface Transaction {
  date: string;
  description: string;
  category: string;
  amount: number;
  fees: number;
  net: number;
  paymentMethod?: string;
}

export interface TransactionSummary {
  totalRevenue: number;
  totalFees: number;
  totalNet: number;
  transactionCount: number;
  byMonth: { month: string; revenue: number; fees: number; net: number; count: number }[];
  byCategory: { category: string; total: number; count: number }[];
}

export interface CoachsFundEntry {
  date: string;
  description: string;
  amount: number;
  balance: number;
}

export interface CoachsFundData {
  startingBalance: number;
  entries: CoachsFundEntry[];
  currentBalance: number;
}

export interface FundBalance {
  checking: number;
  savings: number;
  total: number;
}

export interface HistoricalBudget {
  fiscalYear: string;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
}

export interface HistoricalRevenueBySource {
  fiscalYear: string;
  sources: { name: string; budgeted: number; actual: number }[];
}

export interface FundraisingEvent {
  name: string;
  fiscalYear: string;
  budgeted: number;
  actual: number;
  category: string;
}

export interface FundraisingInsight {
  type: 'trend' | 'recommendation' | 'anomaly' | 'forecast';
  category: 'top-performers' | 'growth-opportunities' | 'long-term-strategy';
  title: string;
  description: string;
  metric?: string;
  value?: number;
  change?: number;
  confidence?: number;
  priority: 'high' | 'medium' | 'low';
}

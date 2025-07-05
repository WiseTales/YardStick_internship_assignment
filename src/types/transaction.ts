
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  month: string; // Format: "2024-01"
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Gift',
  'Other'
];

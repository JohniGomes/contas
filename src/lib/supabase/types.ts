export type ExpenseCategory =
  | "agua"
  | "luz"
  | "internet"
  | "mercado"
  | "gas"
  | "aluguel"
  | "outros";

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  expense_date: string;
  created_at: string;
};

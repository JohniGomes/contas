export type ExpenseCategory =
  | "agua"
  | "luz"
  | "internet"
  | "mercado"
  | "gas"
  | "aluguel"
  | "outros";

export type Profile = {
  id: string;
  name: string;
  created_at: string;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  expense_date: string;
  paid_by: string;
  created_by: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      expenses: {
        Row: Expense;
        Insert: Partial<Expense> & {
          description: string;
          amount: number;
          paid_by: string;
        };
        Update: Partial<Expense>;
      };
    };
  };
};

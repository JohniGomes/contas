import type { ExpenseCategory } from "@/lib/supabase/types";

export const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "agua", label: "Água" },
  { value: "luz", label: "Luz" },
  { value: "internet", label: "Internet" },
  { value: "mercado", label: "Mercado" },
  { value: "gas", label: "Gás" },
  { value: "aluguel", label: "Aluguel" },
  { value: "outros", label: "Outros" },
];

export function categoryLabel(value: ExpenseCategory) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

import type { ExpenseCategory } from "@/lib/supabase/types";

export const CATEGORIES: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: "agua", label: "Água", emoji: "💧" },
  { value: "luz", label: "Luz", emoji: "💡" },
  { value: "internet", label: "Internet", emoji: "📶" },
  { value: "mercado", label: "Mercado", emoji: "🛒" },
  { value: "gas", label: "Gás", emoji: "🔥" },
  { value: "aluguel", label: "Aluguel", emoji: "🏠" },
  { value: "outros", label: "Outros", emoji: "📦" },
];

export function categoryLabel(value: ExpenseCategory) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function categoryEmoji(value: ExpenseCategory) {
  return CATEGORIES.find((c) => c.value === value)?.emoji ?? "📦";
}

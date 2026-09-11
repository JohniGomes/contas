"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ExpenseCategory } from "@/lib/supabase/types";

export async function createExpense(formData: FormData) {
  const supabase = await createClient();

  const description = String(formData.get("description") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const category = String(formData.get("category") ?? "outros") as ExpenseCategory;
  const expenseDate = String(formData.get("expense_date") ?? "");
  const paidBy = String(formData.get("paid_by") ?? "");
  const createdBy = String(formData.get("created_by") ?? paidBy);

  if (!description || !amount || amount <= 0 || !expenseDate || !paidBy) {
    throw new Error("Preencha todos os campos corretamente");
  }

  const { error } = await supabase.from("expenses").insert({
    description,
    amount,
    category,
    expense_date: expenseDate,
    paid_by: paidBy,
    created_by: createdBy || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/lancamentos");
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/lancamentos");
}

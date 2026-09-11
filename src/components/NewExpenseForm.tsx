"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createExpense } from "@/app/(app)/actions";
import { CATEGORIES } from "@/lib/categories";
import type { Profile } from "@/lib/supabase/types";

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export default function NewExpenseForm({
  profiles,
  currentUserId,
}: {
  profiles: Profile[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createExpense(formData);
        router.push("/lancamentos");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Algo deu errado");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Descrição</label>
        <input
          name="description"
          required
          placeholder="Ex: Conta de luz de setembro"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Valor (R$)</label>
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          placeholder="0,00"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Categoria</label>
        <select
          name="category"
          defaultValue="outros"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Data</label>
        <input
          name="expense_date"
          type="date"
          defaultValue={todayISO()}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Quem pagou</label>
        <select
          name="paid_by"
          defaultValue={currentUserId}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-sky-600 py-2.5 text-base font-medium text-white transition hover:bg-sky-700 disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Salvar lançamento"}
      </button>
    </form>
  );
}

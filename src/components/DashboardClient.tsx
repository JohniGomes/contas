"use client";

import { useMemo, useState } from "react";
import { categoryLabel } from "@/lib/categories";
import type { Expense } from "@/lib/supabase/types";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7); // AAAA-MM
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} de ${year}`;
}

export default function DashboardClient({ expenses }: { expenses: Expense[] }) {
  const months = useMemo(() => {
    const keys = new Set(expenses.map((e) => monthKey(e.expense_date)));
    return Array.from(keys).sort((a, b) => b.localeCompare(a));
  }, [expenses]);

  const currentMonthKey = monthKey(new Date().toISOString());
  const defaultMonth = months.includes(currentMonthKey) ? currentMonthKey : (months[0] ?? "all");

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const filteredExpenses = useMemo(() => {
    if (selectedMonth === "all") return expenses;
    return expenses.filter((e) => monthKey(e.expense_date) === selectedMonth);
  }, [expenses, selectedMonth]);

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const share = total / 3;

  const byCategory = filteredExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {months.length > 0 && (
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="all">Todos os meses</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {monthLabel(m)}
            </option>
          ))}
        </select>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Total lançado</p>
        <p className="mt-1 text-3xl font-semibold text-slate-900">{formatBRL(total)}</p>
      </section>

      <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
        <p className="text-sm text-sky-700">Cota de cada pessoa (÷ 3)</p>
        <p className="mt-1 text-2xl font-semibold text-sky-900">{formatBRL(share)}</p>
      </section>

      {Object.keys(byCategory).length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Por categoria
          </h2>
          <div className="space-y-1.5 rounded-2xl border border-slate-200 bg-white p-4">
            {Object.entries(byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, value]) => (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{categoryLabel(cat as never)}</span>
                  <span className="font-medium text-slate-900">{formatBRL(value)}</span>
                </div>
              ))}
          </div>
        </section>
      )}

      {expenses.length === 0 && (
        <p className="text-center text-sm text-slate-500">
          Nenhum lançamento ainda. Toque em &quot;Novo&quot; para começar.
        </p>
      )}

      {expenses.length > 0 && filteredExpenses.length === 0 && (
        <p className="text-center text-sm text-slate-500">
          Nenhum lançamento neste período.
        </p>
      )}
    </div>
  );
}

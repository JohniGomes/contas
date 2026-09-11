import { createClient } from "@/lib/supabase/server";
import { categoryLabel } from "@/lib/categories";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .order("expense_date", { ascending: false });

  const allExpenses = expenses ?? [];
  const total = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const share = total / 3;

  const now = new Date();
  const thisMonthExpenses = allExpenses.filter((e) => {
    const d = new Date(e.expense_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const byCategory = thisMonthExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
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
            Este mês por categoria
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

      {allExpenses.length === 0 && (
        <p className="text-center text-sm text-slate-500">
          Nenhum lançamento ainda. Toque em &quot;Novo&quot; para começar.
        </p>
      )}
    </div>
  );
}

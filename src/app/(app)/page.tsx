import { createClient } from "@/lib/supabase/server";
import { calculateBalances, calculateSettlements } from "@/lib/split";
import { categoryEmoji, categoryLabel } from "@/lib/categories";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: expenses }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at"),
    supabase.from("expenses").select("*").order("expense_date", { ascending: false }),
  ]);

  const allProfiles = profiles ?? [];
  const allExpenses = expenses ?? [];

  const total = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const balances = calculateBalances(allProfiles, allExpenses);
  const settlements = calculateSettlements(balances);

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
      <section>
        <p className="text-sm text-slate-500">Total lançado</p>
        <p className="text-3xl font-semibold text-slate-900">{formatBRL(total)}</p>
        {allProfiles.length > 0 && (
          <p className="text-sm text-slate-500">
            Divisão por {allProfiles.length}: {formatBRL(total / allProfiles.length)} cada
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Saldo por pessoa
        </h2>
        <div className="space-y-2">
          {balances.map((b) => (
            <div
              key={b.profile.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">{b.profile.name}</p>
                <p className="text-xs text-slate-500">
                  Pagou {formatBRL(b.paid)} · cota {formatBRL(b.share)}
                </p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  b.balance > 0.005
                    ? "text-emerald-600"
                    : b.balance < -0.005
                      ? "text-red-600"
                      : "text-slate-400"
                }`}
              >
                {b.balance > 0.005 ? "+" : ""}
                {formatBRL(b.balance)}
              </span>
            </div>
          ))}
          {allProfiles.length === 0 && (
            <p className="text-sm text-slate-500">Nenhum morador cadastrado ainda.</p>
          )}
        </div>
      </section>

      {settlements.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Para acertar as contas
          </h2>
          <div className="space-y-2">
            {settlements.map((s, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm"
              >
                <span className="font-medium">{s.from.name}</span> deve pagar{" "}
                <span className="font-semibold">{formatBRL(s.amount)}</span> para{" "}
                <span className="font-medium">{s.to.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {Object.keys(byCategory).length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Este mês por categoria
          </h2>
          <div className="space-y-1.5">
            {Object.entries(byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, value]) => (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <span>
                    {categoryEmoji(cat as never)} {categoryLabel(cat as never)}
                  </span>
                  <span className="font-medium text-slate-700">{formatBRL(value)}</span>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

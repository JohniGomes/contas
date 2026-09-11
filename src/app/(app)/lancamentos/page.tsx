import { createClient } from "@/lib/supabase/server";
import { categoryEmoji, categoryLabel } from "@/lib/categories";
import DeleteExpenseButton from "@/components/DeleteExpenseButton";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");
}

export default async function LancamentosPage() {
  const supabase = await createClient();

  const [{ data: expenses }, { data: profiles }, { data: auth }] = await Promise.all([
    supabase.from("expenses").select("*").order("expense_date", { ascending: false }),
    supabase.from("profiles").select("*"),
    supabase.auth.getUser(),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.name]));
  const currentUserId = auth?.user?.id;

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold text-slate-900">Lançamentos</h1>

      {(expenses ?? []).length === 0 && (
        <p className="text-sm text-slate-500">Nenhum lançamento ainda. Toque em “Novo” para começar.</p>
      )}

      <div className="space-y-2">
        {(expenses ?? []).map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <span className="text-xl">{categoryEmoji(e.category)}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-900">{e.description}</p>
              <p className="text-xs text-slate-500">
                {categoryLabel(e.category)} · {formatDate(e.expense_date)} · pago por{" "}
                {profileMap.get(e.paid_by) ?? "?"}
              </p>
            </div>
            <span className="whitespace-nowrap font-semibold text-slate-900">
              {formatBRL(e.amount)}
            </span>
            {e.created_by === currentUserId && <DeleteExpenseButton id={e.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}

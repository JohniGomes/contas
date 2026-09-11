import { createClient } from "@/lib/supabase/server";
import NewExpenseForm from "@/components/NewExpenseForm";

export default async function NovoLancamentoPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at");

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900">Novo lançamento</h1>
      <NewExpenseForm profiles={profiles ?? []} />
    </div>
  );
}

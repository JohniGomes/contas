import NewExpenseForm from "@/components/NewExpenseForm";

export default function NovoLancamentoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900">Novo lançamento</h1>
      <NewExpenseForm />
    </div>
  );
}

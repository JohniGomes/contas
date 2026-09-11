"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteExpense } from "@/app/(app)/actions";

export default function DeleteExpenseButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!confirm("Excluir este lançamento?")) return;
    startTransition(async () => {
      await deleteExpense(id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-slate-300 hover:text-red-500 disabled:opacity-50"
      aria-label="Excluir"
    >
      ✕
    </button>
  );
}

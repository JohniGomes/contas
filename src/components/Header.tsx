"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header({ name }: { name: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
      <span className="text-base font-semibold">🏠 Contas de Casa</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Olá, {name}</span>
        <button
          onClick={handleSignOut}
          className="text-sm font-medium text-slate-400 hover:text-slate-700"
        >
          Sair
        </button>
      </div>
    </header>
  );
}

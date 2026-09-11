"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { clearStoredProfileId, getStoredProfileId, setStoredProfileId } from "@/lib/current-profile";
import type { Profile } from "@/lib/supabase/types";

export default function AppShell({
  profiles,
  children,
}: {
  profiles: Profile[];
  children: React.ReactNode;
}) {
  const [profileId, setProfileId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setProfileId(getStoredProfileId());
  }, []);

  function handlePick(id: string) {
    setStoredProfileId(id);
    setProfileId(id);
  }

  const currentProfile = profiles.find((p) => p.id === profileId);

  if (profileId === undefined) {
    return null;
  }

  if (!currentProfile) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-xl font-semibold text-slate-900">Contas de Casa</h1>
          <p className="mt-1 mb-6 text-sm text-slate-500">Quem é você?</p>
          <div className="space-y-2">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePick(p.id)}
                className="w-full rounded-lg border border-slate-300 bg-white py-3 text-base font-medium text-slate-900 transition hover:border-sky-500 hover:text-sky-600"
              >
                {p.name}
              </button>
            ))}
            {profiles.length === 0 && (
              <p className="text-sm text-slate-500">
                Nenhum morador cadastrado ainda. Cadastre os moradores na tabela
                &quot;profiles&quot; do Supabase.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Header
        name={currentProfile.name}
        onSwitch={() => {
          clearStoredProfileId();
          setProfileId(null);
        }}
      />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-5">{children}</main>
      <BottomNav />
    </div>
  );
}

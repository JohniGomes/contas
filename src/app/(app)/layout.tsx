import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at");

  return <AppShell profiles={profiles ?? []}>{children}</AppShell>;
}

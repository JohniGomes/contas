import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Header name={profile?.name ?? "morador"} />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-5">{children}</main>
      <BottomNav />
    </div>
  );
}

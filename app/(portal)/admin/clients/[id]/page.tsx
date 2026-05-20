import { redirect } from "next/navigation";
import { getCurrentUserAndClient } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClientDetail } from "@/components/admin/ClientDetail";
import type { UserRole } from "@/types/database";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function AdminClientDetailPage({ params }: Props) {
  const ctx = await getCurrentUserAndClient();
  if (!ctx) redirect("/login");
  if (ctx.user.role !== "super_admin") redirect("/dashboard");

  const admin = createAdminClient();

  const [{ data: client }, { data: users }, { data: unassignedVas }] =
    await Promise.all([
      admin
        .from("clients")
        .select("id, name, slug, created_at")
        .eq("id", params.id)
        .single(),
      admin
        .from("users")
        .select("id, email, full_name, role, created_at")
        .eq("client_id", params.id)
        .order("created_at", { ascending: true }),
      admin
        .from("users")
        .select("id, email, full_name")
        .is("client_id", null)
        .eq("role", "va")
        .order("email", { ascending: true }),
    ]);

  if (!client) redirect("/admin/clients");

  return (
    <ClientDetail
      client={client as { id: string; name: string; slug: string; created_at: string }}
      users={
        (users ?? []) as {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
        }[]
      }
      unassignedVas={
        (unassignedVas ?? []) as {
          id: string;
          email: string;
          full_name: string | null;
        }[]
      }
    />
  );
}

import { redirect } from "next/navigation";
import { getCurrentUserAndClient } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { SopNewForm } from "@/components/sops/SopNewForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SopNewPage() {
  const ctx = await getCurrentUserAndClient();
  if (!ctx) redirect("/login");

  const { user } = ctx;
  if (!user.client_id) redirect("/dashboard");

  const canEdit = user.role === "client_admin" || user.role === "super_admin";
  if (!canEdit) redirect("/sops");

  const admin = createAdminClient();
  const { data: sopRows } = await admin
    .from("sops")
    .select("category")
    .eq("client_id", user.client_id);

  const categories = Array.from(
    new Set((sopRows ?? []).map((s: { category: string }) => s.category).filter(Boolean))
  );

  return (
    <div className="max-w-3xl">
      <Link
        href="/sops"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to SOPs
      </Link>
      <SopNewForm clientId={user.client_id} userId={user.id} categories={categories} />
    </div>
  );
}

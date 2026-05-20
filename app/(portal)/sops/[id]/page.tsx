import { redirect, notFound } from "next/navigation";
import { getCurrentUserAndClient } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { SopDetail } from "@/components/sops/SopDetail";
import type { Sop } from "@/app/(portal)/sops/page";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SopDetailPage({ params }: { params: { id: string } }) {
  const ctx = await getCurrentUserAndClient();
  if (!ctx) redirect("/login");

  const { user } = ctx;
  if (!user.client_id) redirect("/dashboard");

  const admin = createAdminClient();
  const [{ data: sop }, { data: allSops }] = await Promise.all([
    admin.from("sops").select("*").eq("id", params.id).eq("client_id", user.client_id).single(),
    admin.from("sops").select("category").eq("client_id", user.client_id),
  ]);

  if (!sop) notFound();

  const categories = Array.from(new Set((allSops ?? []).map((s: { category: string }) => s.category).filter(Boolean)));
  const canEdit = user.role === "client_admin" || user.role === "super_admin";

  return (
    <div className="max-w-3xl">
      <Link
        href="/sops"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to SOPs
      </Link>
      <SopDetail sop={sop as Sop} canEdit={canEdit} clientId={user.client_id} categories={categories} />
    </div>
  );
}

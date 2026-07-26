import { redirect } from "next/navigation";
import { getCurrentUserAndClient } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { CrmBoard } from "@/components/crm/CrmBoard";
import { Button } from "@/components/ui/button";
import { Building2, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import type { DbCrmCompany, DbCrmContact } from "@/types/database";

export const dynamic = "force-dynamic";
export const metadata = { title: "CRM — RapidTal" };

export default async function CrmPage() {
  const ctx = await getCurrentUserAndClient();
  if (!ctx) redirect("/login");

  const { user, client } = ctx;
  if (!user.client_id) redirect("/dashboard");

  const admin = createAdminClient();
  const [{ data: contacts }, { data: companies }] = await Promise.all([
    admin
      .from("crm_contacts")
      .select("id, client_id, first_name, last_name, email, phone, company, job_title, status, source, tags, notes, created_by, crm_company_id, verification_status, verified_by, verified_at, created_at, updated_at")
      .eq("client_id", user.client_id)
      .order("created_at", { ascending: false })
      .limit(500),
    admin
      .from("crm_companies")
      .select("*")
      .eq("client_id", user.client_id)
      .order("promoted_at", { ascending: false })
      .limit(200),
  ]);
  const crmCompanies = (companies ?? []) as DbCrmCompany[];
  const crmContacts = (contacts ?? []) as DbCrmContact[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">CRM</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Approved companies and real contacts for {client?.name ?? "your client"}
          </p>
        </div>
        <Link href="/crm/add-contact">
          <Button className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </Link>
      </div>
      <section className="mb-8">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Companies</h2>
            <p className="mt-1 text-sm text-zinc-500">Only companies explicitly promoted from reviewed job leads appear here.</p>
          </div>
          <span className="text-xs text-zinc-500">{crmCompanies.length} companies</span>
        </div>
        {crmCompanies.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">
            No approved lead companies have been promoted yet.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {crmCompanies.map((company) => {
              const contactCount = crmContacts.filter((contact) => contact.crm_company_id === company.id).length;
              return (
                <article key={company.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-zinc-100">{company.name}</h3>
                      <p className="mt-1 text-xs text-zinc-500">{company.domain}</p>
                    </div>
                    <Building2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400">
                    {company.industry && <span>{company.industry}</span>}
                    {company.location && <span>{company.location}</span>}
                    <span>{contactCount} verified contact{contactCount === 1 ? "" : "s"}</span>
                  </div>
                  {company.source_score_total !== null && (
                    <p className="mt-3 text-sm text-cyan-300">
                      Source score {company.source_score_total}/100 · {company.source_score_band}
                    </p>
                  )}
                  {company.source_score_summary && <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{company.source_score_summary}</p>}
                  <a href={company.website_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-blue-400">
                    Official website <ExternalLink className="h-3 w-3" />
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <h2 className="mb-3 text-lg font-semibold">Contacts</h2>
      <CrmBoard
        contacts={crmContacts}
        clientId={user.client_id}
        userId={user.id}
      />
    </div>
  );
}

export type CrmContact = DbCrmContact;

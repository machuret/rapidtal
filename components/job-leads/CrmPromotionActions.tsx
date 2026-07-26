"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  clientId: string;
  jobAdId: string;
  companyId: string;
  crmCompanyId: string | null;
}

export function CrmPromotionActions({ clientId, jobAdId, companyId, crmCompanyId }: Props) {
  const router = useRouter();
  const [promoting, setPromoting] = useState(false);
  const [adding, setAdding] = useState(false);

  async function promote() {
    setPromoting(true);
    try {
      const response = await fetch("/api/job-leads/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, jobAdId, companyId }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) return toast.error(body.error ?? "Promotion failed.");
      toast.success("Company promoted to CRM. No person was created.");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPromoting(false);
    }
  }

  async function addContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!crmCompanyId) return;
    setAdding(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/job-leads/verified-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          crmCompanyId,
          firstName: form.get("firstName"),
          lastName: form.get("lastName") || null,
          email: form.get("email") || null,
          phone: form.get("phone") || null,
          jobTitle: form.get("jobTitle") || null,
          verificationMethod: form.get("verificationMethod"),
          sourceUrl: form.get("sourceUrl"),
          evidenceNote: form.get("evidenceNote"),
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) return toast.error(body.error ?? "Contact could not be added.");
      toast.success("Verified person added to CRM.");
      event.currentTarget.reset();
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  if (!crmCompanyId) {
    return (
      <div className="mt-4 border-t border-emerald-500/20 pt-4">
        <p className="mb-2 text-xs text-zinc-400">
          This is the explicit CRM gate. Promotion creates a company only—never a fabricated person.
        </p>
        <Button type="button" size="sm" disabled={promoting} onClick={promote} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500">
          {promoting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Building2 className="h-3.5 w-3.5" />}
          Promote company to CRM
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-emerald-500/20 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> Company is in CRM
        </p>
        <Link
          href="/crm"
          className="inline-flex h-8 items-center rounded-md border border-zinc-700 px-3 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
        >
          Open CRM
        </Link>
      </div>
      <details className="mt-3 rounded-lg border border-zinc-700 bg-zinc-950/50">
        <summary className="cursor-pointer px-3 py-2 text-sm text-zinc-300">
          Add a discovered and verified person
        </summary>
        <form onSubmit={addContact} className="grid gap-3 border-t border-zinc-700 p-3 md:grid-cols-2">
          <div><Label htmlFor={`first-${jobAdId}`}>First name</Label><Input id={`first-${jobAdId}`} name="firstName" required maxLength={100} className="mt-1 bg-zinc-900" /></div>
          <div><Label htmlFor={`last-${jobAdId}`}>Last name</Label><Input id={`last-${jobAdId}`} name="lastName" maxLength={100} className="mt-1 bg-zinc-900" /></div>
          <div><Label htmlFor={`email-${jobAdId}`}>Email</Label><Input id={`email-${jobAdId}`} name="email" type="email" maxLength={255} className="mt-1 bg-zinc-900" /></div>
          <div><Label htmlFor={`phone-${jobAdId}`}>Phone</Label><Input id={`phone-${jobAdId}`} name="phone" maxLength={50} className="mt-1 bg-zinc-900" /></div>
          <div><Label htmlFor={`title-${jobAdId}`}>Job title</Label><Input id={`title-${jobAdId}`} name="jobTitle" maxLength={200} className="mt-1 bg-zinc-900" /></div>
          <div>
            <Label htmlFor={`method-${jobAdId}`}>How verified</Label>
            <select id={`method-${jobAdId}`} name="verificationMethod" required className="mt-1 h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm">
              <option value="company_website">Company website</option>
              <option value="linkedin">LinkedIn</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="manual_research">Manual research</option>
            </select>
          </div>
          <div className="md:col-span-2"><Label htmlFor={`source-${jobAdId}`}>Verification source URL</Label><Input id={`source-${jobAdId}`} name="sourceUrl" type="url" required placeholder="https://…" className="mt-1 bg-zinc-900" /></div>
          <div className="md:col-span-2">
            <Label htmlFor={`evidence-${jobAdId}`}>Evidence note</Label>
            <textarea id={`evidence-${jobAdId}`} name="evidenceNote" required maxLength={2000} rows={2} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" placeholder="What on the source verifies this person's identity and role?" />
          </div>
          <p className="text-xs text-zinc-500 md:col-span-2">Email or phone is required. Editing verified identity fields later removes the verified badge until rechecked.</p>
          <Button type="submit" size="sm" disabled={adding} className="w-fit gap-1.5 md:col-span-2">
            {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />} Add verified contact
          </Button>
        </form>
      </details>
    </div>
  );
}

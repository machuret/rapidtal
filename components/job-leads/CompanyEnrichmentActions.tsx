"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, Loader2, RefreshCw, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { LeadCompanyStatus } from "@/types/database";

interface CompanyEnrichmentActionsProps {
  clientId: string;
  jobAdId: string;
  companyId: string | null;
  companyStatus: LeadCompanyStatus | null;
  hasOfficialWebsite: boolean;
}

type PendingAction = "enrich" | "approve" | "reject" | "reopen" | null;

export function CompanyEnrichmentActions({
  clientId,
  jobAdId,
  companyId,
  companyStatus,
  hasOfficialWebsite,
}: CompanyEnrichmentActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<PendingAction>(null);

  async function enrich() {
    setPending("enrich");
    try {
      const res = await fetch("/api/job-leads/company-enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, jobAdId, force: companyId !== null }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "The employer company could not be enriched.");
        return;
      }
      toast.success(body.reused ? "Existing company linked." : "Company enriched for review.");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPending(null);
    }
  }

  async function review(status: "needs_review" | "approved" | "rejected") {
    if (!companyId) return;
    const action = status === "approved" ? "approve" : status === "rejected" ? "reject" : "reopen";
    setPending(action);
    try {
      const res = await fetch("/api/job-leads/company-review", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, companyId, status }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "The company review could not be updated.");
        return;
      }
      toast.success(
        status === "approved"
          ? "Company approved for lead scoring."
          : status === "rejected"
            ? "Company rejected."
            : "Company returned to review.",
      );
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant={companyId ? "outline" : "default"}
        disabled={pending !== null || !hasOfficialWebsite}
        onClick={enrich}
        className="gap-1.5"
        title={hasOfficialWebsite ? undefined : "No verified official company website was extracted."}
      >
        {pending === "enrich"
          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
          : companyId
            ? <RefreshCw className="h-3.5 w-3.5" />
            : <Building2 className="h-3.5 w-3.5" />}
        {companyId ? "Refresh company" : "Enrich company"}
      </Button>

      {companyId && companyStatus !== "approved" && (
        <Button
          type="button"
          size="sm"
          disabled={pending !== null}
          onClick={() => review("approved")}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-500"
        >
          {pending === "approve"
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Check className="h-3.5 w-3.5" />}
          Approve company
        </Button>
      )}
      {companyId && companyStatus !== "rejected" && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending !== null}
          onClick={() => review("rejected")}
          className="gap-1.5 border-red-500/30 text-red-300 hover:bg-red-500/10"
        >
          {pending === "reject"
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <X className="h-3.5 w-3.5" />}
          Reject company
        </Button>
      )}
      {companyId && (companyStatus === "approved" || companyStatus === "rejected") && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={pending !== null}
          onClick={() => review("needs_review")}
          className="gap-1.5 text-zinc-400"
        >
          {pending === "reopen"
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <RotateCcw className="h-3.5 w-3.5" />}
          Reopen company review
        </Button>
      )}
    </div>
  );
}

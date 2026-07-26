"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { JobDiscoverySource } from "@/types/database";

export function RetryCompanyEnrichmentButton({
  clientId,
  jobAdId,
}: {
  clientId: string;
  jobAdId: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function retry() {
    setPending(true);
    try {
      const response = await fetch("/api/job-leads/company-enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, jobAdId, force: true }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Company retry failed.");
      toast.success("Company enrichment completed.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Company retry failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button type="button" size="sm" variant="outline" disabled={pending} onClick={retry} className="gap-1.5">
      {pending
        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
        : <RotateCcw className="h-3.5 w-3.5" />}
      Retry company enrichment
    </Button>
  );
}

export function RetryDiscoveryButton({
  clientId,
  source,
  searchTerm,
  location,
  country,
  workType,
  dateRangeDays,
  maxResults,
}: {
  clientId: string;
  source: JobDiscoverySource;
  searchTerm: string;
  location: string;
  country: string;
  workType: string;
  dateRangeDays: number;
  maxResults: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function retry() {
    setPending(true);
    try {
      const response = await fetch("/api/job-leads/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          source,
          searchTerm,
          location,
          country,
          workType,
          dateRangeDays,
          maxResults,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Discovery retry failed.");
      toast.success(`${body.count ?? 0} discovery results processed.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Discovery retry failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button type="button" size="sm" variant="outline" disabled={pending} onClick={retry} className="gap-1.5">
      {pending
        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
        : <RotateCcw className="h-3.5 w-3.5" />}
      Retry discovery
    </Button>
  );
}

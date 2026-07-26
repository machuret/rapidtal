"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function RetryScrapeButton({ clientId, url }: { clientId: string; url: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function retry() {
    setLoading(true);
    try {
      const response = await fetch("/api/job-leads/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, url }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) return toast.error(body.error ?? "Retry failed.");
      toast.success(body.duplicate ? "Existing lead refreshed." : "Job extracted for review.");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button type="button" size="sm" variant="outline" disabled={loading} onClick={retry} className="gap-1.5">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
      Retry scrape
    </Button>
  );
}

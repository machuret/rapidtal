"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function JobDiscoveryActions({
  clientId,
  discoveryId,
  jobUrl,
}: {
  clientId: string;
  discoveryId: string;
  jobUrl: string;
}) {
  const router = useRouter();
  const [action, setAction] = useState<"import" | "dismiss" | null>(null);

  async function importJob() {
    setAction("import");
    try {
      const res = await fetch("/api/job-leads/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, url: jobUrl }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return toast.error(body.error ?? "The job could not be extracted.");
      toast.success("Job extracted and moved to the review queue.");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setAction(null);
    }
  }

  async function dismiss() {
    setAction("dismiss");
    try {
      const res = await fetch("/api/job-leads/discovery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, discoveryId, status: "dismissed" }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return toast.error(body.error ?? "The result could not be dismissed.");
      toast.success("Discovery dismissed.");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setAction(null);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Button size="sm" onClick={importJob} disabled={action !== null} className="gap-1.5">
        {action === "import"
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <Download className="w-3.5 h-3.5" />}
        Extract for review
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={dismiss}
        disabled={action !== null}
        className="gap-1.5 text-zinc-400"
      >
        {action === "dismiss"
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <X className="w-3.5 h-3.5" />}
        Dismiss
      </Button>
    </div>
  );
}

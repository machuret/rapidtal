"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface LeadScoreActionsProps {
  clientId: string;
  jobAdId: string;
  hasScore: boolean;
}

export function LeadScoreActions({ clientId, jobAdId, hasScore }: LeadScoreActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function score() {
    setPending(true);
    try {
      const res = await fetch("/api/job-leads/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, jobAdId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "The lead could not be scored.");
        return;
      }
      toast.success("Transparent lead score calculated.");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={hasScore ? "outline" : "default"}
      disabled={pending}
      onClick={score}
      className="gap-1.5"
    >
      {pending
        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
        : hasScore
          ? <RefreshCw className="h-3.5 w-3.5" />
          : <Calculator className="h-3.5 w-3.5" />}
      {hasScore ? "Recalculate score" : "Score lead"}
    </Button>
  );
}

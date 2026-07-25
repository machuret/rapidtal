"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { JobAdStatus } from "@/types/database";

interface JobLeadReviewActionsProps {
  clientId: string;
  jobAdId: string;
  status: JobAdStatus;
}
type ReviewStatus = "needs_review" | "approved" | "rejected";

export function JobLeadReviewActions({
  clientId,
  jobAdId,
  status,
}: JobLeadReviewActionsProps) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<ReviewStatus | null>(null);

  async function updateStatus(nextStatus: ReviewStatus) {
    setPendingStatus(nextStatus);
    try {
      const res = await fetch("/api/job-leads/review", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, jobAdId, status: nextStatus }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "The review status could not be updated.");
        return;
      }

      toast.success(
        nextStatus === "approved"
          ? "Job advertisement approved."
          : nextStatus === "rejected"
            ? "Job advertisement rejected."
            : "Job advertisement returned to review.",
      );
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPendingStatus(null);
    }
  }

  const loading = pendingStatus !== null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {status !== "approved" && (
        <Button
          type="button"
          size="sm"
          disabled={loading}
          onClick={() => updateStatus("approved")}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-500"
        >
          {pendingStatus === "approved"
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Check className="w-3.5 h-3.5" />}
          Approve
        </Button>
      )}
      {status !== "rejected" && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => updateStatus("rejected")}
          className="gap-1.5 border-red-500/30 text-red-300 hover:bg-red-500/10"
        >
          {pendingStatus === "rejected"
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <X className="w-3.5 h-3.5" />}
          Reject
        </Button>
      )}
      {(status === "approved" || status === "rejected") && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={loading}
          onClick={() => updateStatus("needs_review")}
          className="gap-1.5 text-zinc-400"
        >
          {pendingStatus === "needs_review"
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <RotateCcw className="w-3.5 h-3.5" />}
          Reopen review
        </Button>
      )}
    </div>
  );
}

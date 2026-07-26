"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { DbJobPipelineAlert } from "@/types/database";

export type PipelineMetric = {
  stage: string;
  attempts: number;
  successes: number;
  successRate: number | null;
  averageLatencyMs: number | null;
  costUsd: number;
};

type Props = {
  clientId: string;
  metrics: PipelineMetric[];
  labeledAccuracy: number | null;
  labeledSamples: number;
  unavailableSources: string[];
  alerts: Pick<
    DbJobPipelineAlert,
    "id" | "title" | "detail" | "severity" | "occurrence_count" | "last_seen_at"
  >[];
};

function percent(value: number | null): string {
  return value === null ? "No runs" : `${Math.round(value * 100)}%`;
}

export function JobPipelineObservability({
  clientId,
  metrics,
  labeledAccuracy,
  labeledSamples,
  unavailableSources,
  alerts,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function acknowledge(alertId: string) {
    setPending(alertId);
    try {
      const response = await fetch("/api/job-leads/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, alertId, action: "acknowledged" }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Alert update failed.");
      toast.success("Alert acknowledged.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Alert update failed.");
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-zinc-100">Pipeline health · last 24 hours</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Success, labeled field accuracy, latency, provider and AI cost.
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-zinc-100">
            {labeledAccuracy === null ? "Not measured" : percent(labeledAccuracy)}
          </div>
          <div className="text-xs text-zinc-500">{labeledSamples} labeled samples</div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.stage} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <div className="text-xs uppercase tracking-wide text-zinc-500">{metric.stage}</div>
            <div className="mt-1 text-xl font-semibold text-zinc-100">
              {percent(metric.successRate)}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              {metric.successes}/{metric.attempts} successful ·{" "}
              {metric.averageLatencyMs === null
                ? "no latency"
                : `${(metric.averageLatencyMs / 1000).toFixed(1)}s avg`}
              {" · "}${metric.costUsd.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
      {unavailableSources.length > 0 && (
        <div className="mt-4 flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
          <div>
            <div className="text-sm font-medium text-red-200">
              Observability data is incomplete
            </div>
            <div className="text-xs text-red-200/70">
              Could not load: {unavailableSources.join(", ")}. Empty values above must not
              be treated as healthy until monitoring recovers.
            </div>
          </div>
        </div>
      )}
      {alerts.length > 0 && (
        <div className="mt-4 space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start justify-between gap-3 rounded-lg border p-3 ${
                alert.severity === "critical"
                  ? "border-red-500/30 bg-red-500/10"
                  : "border-amber-500/30 bg-amber-500/10"
              }`}
            >
              <div className="flex min-w-0 gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <div>
                  <div className="text-sm font-medium text-zinc-100">{alert.title}</div>
                  <div className="text-xs text-zinc-400">
                    {alert.detail} · {alert.occurrence_count} occurrence
                    {alert.occurrence_count === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={pending === alert.id}
                onClick={() => acknowledge(alert.id)}
                className="shrink-0 gap-1.5"
              >
                {pending === alert.id
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Check className="h-3.5 w-3.5" />}
                Acknowledge
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JobLeadIngestProps {
  clientId: string;
}

export function JobLeadIngest({ clientId }: JobLeadIngestProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    setLoading(true);
    try {
      const res = await fetch("/api/job-leads/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl, clientId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "The job advertisement could not be ingested.");
        return;
      }

      toast.success(
        body.duplicate
          ? "Existing job advertisement refreshed."
          : "Job advertisement extracted for review.",
      );
      setUrl("");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 mb-8"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
          <BriefcaseBusiness className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h2 className="font-semibold text-zinc-100">Import one job advertisement</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Paste a public HTTPS vacancy page. The result stays in review until you approve it.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <Label htmlFor="job-ad-url" className="text-zinc-300">
            Job-ad URL
          </Label>
          <Input
            id="job-ad-url"
            type="url"
            required
            maxLength={2048}
            placeholder="https://company.example/careers/job-id"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={loading}
            className="mt-1.5 bg-zinc-800 border-zinc-700"
          />
        </div>
        <Button type="submit" disabled={loading || !url.trim()} className="gap-2">
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <BriefcaseBusiness className="w-4 h-4" />}
          {loading ? "Extracting…" : "Extract job"}
        </Button>
      </div>
    </form>
  );
}

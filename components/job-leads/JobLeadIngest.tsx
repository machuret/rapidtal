"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, BriefcaseBusiness, FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_JOB_IMPORT_URLS, normalizeJobUrl, parseJobImportText } from "@/lib/job-batch-import";

interface JobLeadIngestProps {
  clientId: string;
  existingUrls: string[];
}

export function JobLeadIngest({ clientId, existingUrls }: JobLeadIngestProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [batchText, setBatchText] = useState("");
  const [loading, setLoading] = useState(false);
  const existing = useMemo(
    () => new Set(existingUrls.flatMap((value) => normalizeJobUrl(value) ?? [])),
    [existingUrls],
  );
  const batch = useMemo(() => parseJobImportText(batchText), [batchText]);
  const existingBatchCount = batch.urls.filter((value) => existing.has(value)).length;

  async function ingest(targetUrl: string) {
    const res = await fetch("/api/job-leads/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, clientId }),
      });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok, body };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeJobUrl(url);
    if (!normalized) return toast.error("Enter a valid public HTTPS URL.");
    setLoading(true);
    try {
      const result = await ingest(normalized);
      if (!result.ok) return toast.error(result.body.error ?? "The job advertisement could not be ingested.");
      toast.success(
        result.body.duplicate
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

  async function submitBatch() {
    if (!batch.urls.length) return;
    setLoading(true);
    let imported = 0;
    let refreshed = 0;
    let failed = 0;
    try {
      for (let index = 0; index < batch.urls.length; index += 2) {
        const results = await Promise.all(batch.urls.slice(index, index + 2).map(ingest));
        for (const result of results) {
          if (!result.ok) failed += 1;
          else if (result.body.duplicate) refreshed += 1;
          else imported += 1;
        }
      }
      toast.success(`${imported} imported, ${refreshed} refreshed${failed ? `, ${failed} failed` : ""}.`);
      setBatchText("");
      router.refresh();
    } catch {
      toast.error("Batch import was interrupted. Completed items are safely retained.");
    } finally {
      setLoading(false);
    }
  }

  async function loadFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 250_000) return toast.error("CSV or text file must be smaller than 250 KB.");
    setBatchText(await file.text());
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 mb-8">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
          <BriefcaseBusiness className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h2 className="font-semibold text-zinc-100">Import job advertisements</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Paste a public HTTPS vacancy page. The result stays in review until you approve it.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 sm:items-end">
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
      </form>

      {normalizeJobUrl(url) && existing.has(normalizeJobUrl(url)!) && (
        <p className="mt-3 flex items-center gap-2 text-xs text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5" />
          Duplicate warning: this URL is already a job lead and will be refreshed.
        </p>
      )}

      <div className="my-5 border-t border-zinc-800" />
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label htmlFor="job-ad-batch" className="text-zinc-300">Batch URLs or CSV</Label>
          <p className="mt-1 text-xs text-zinc-500">
            One URL per line or a simple CSV. Up to {MAX_JOB_IMPORT_URLS} HTTPS URLs per batch.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800">
          <FileUp className="h-3.5 w-3.5" /> Choose CSV
          <input
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className="sr-only"
            disabled={loading}
            onChange={(event) => void loadFile(event.target.files?.[0])}
          />
        </label>
      </div>
      <textarea
        id="job-ad-batch"
        rows={4}
        value={batchText}
        disabled={loading}
        onChange={(event) => setBatchText(event.target.value)}
        placeholder={"https://example.com/jobs/1\nhttps://example.com/jobs/2"}
        className="mt-3 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
      />
      {batchText && (
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
          <span>{batch.urls.length} ready</span>
          {existingBatchCount > 0 && <span className="text-amber-300">{existingBatchCount} existing (will refresh)</span>}
          {batch.repeatedCount > 0 && <span>{batch.repeatedCount} repeated skipped</span>}
          {batch.invalidCount > 0 && <span className="text-red-300">{batch.invalidCount} invalid skipped</span>}
          {batch.overflowCount > 0 && <span className="text-red-300">{batch.overflowCount} over limit skipped</span>}
        </div>
      )}
      <Button
        type="button"
        variant="secondary"
        disabled={loading || batch.urls.length === 0}
        onClick={() => void submitBatch()}
        className="mt-3 gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
        {loading ? "Importing…" : `Import ${batch.urls.length || ""} job${batch.urls.length === 1 ? "" : "s"}`}
      </Button>
    </section>
  );
}

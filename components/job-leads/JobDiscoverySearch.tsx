"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SavedSearch {
  id: string;
  source: "seek" | "indeed" | "linkedin";
  search_term: string;
  location: string;
}

export function JobDiscoverySearch({
  clientId,
  savedSearches,
}: {
  clientId: string;
  savedSearches: SavedSearch[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("seek");
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("Sydney");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/job-leads/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          source,
          searchTerm,
          location,
          country: "AU",
          workType: "",
          dateRangeDays: 7,
          maxResults: 25,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "The job search could not be completed.");
        return;
      }
      toast.success(`${body.newCount} new of ${body.count} discovered jobs saved.`);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-2">
          <Search className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h2 className="font-semibold text-zinc-100">Discover job advertisements</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Search public job boards through Apify. Results enter a queue before extraction.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[150px_1fr_1fr_auto] sm:items-end">
        <div>
          <Label htmlFor="discovery-source">Source</Label>
          <select
            id="discovery-source"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            disabled={loading}
            className="mt-1.5 h-10 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm"
          >
            <option value="seek">SEEK</option>
            <option value="indeed">Indeed</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div>
          <Label htmlFor="discovery-term">Role or keyword</Label>
          <Input
            id="discovery-term"
            required
            minLength={2}
            maxLength={120}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Marketing manager"
            disabled={loading}
            className="mt-1.5 bg-zinc-800 border-zinc-700"
          />
        </div>
        <div>
          <Label htmlFor="discovery-location">Location</Label>
          <Input
            id="discovery-location"
            maxLength={120}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Sydney"
            disabled={loading}
            className="mt-1.5 bg-zinc-800 border-zinc-700"
          />
        </div>
        <Button type="submit" disabled={loading || searchTerm.trim().length < 2} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? "Searching…" : "Discover"}
        </Button>
      </div>
      {savedSearches.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-4">
          <span className="text-xs text-zinc-500">Saved searches:</span>
          {savedSearches.map((search) => (
            <button
              type="button"
              key={search.id}
              disabled={loading}
              onClick={() => {
                setSource(search.source);
                setSearchTerm(search.search_term);
                setLocation(search.location);
              }}
              className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 hover:border-violet-500/50 hover:text-violet-300"
            >
              {search.search_term}{search.location ? ` · ${search.location}` : ""}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}

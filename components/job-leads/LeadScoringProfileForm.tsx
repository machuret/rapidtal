"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DbLeadScoringProfile } from "@/types/database";

interface LeadScoringProfileFormProps {
  clientId: string;
  profile: DbLeadScoringProfile;
}

function lines(values: string[]): string {
  return values.join("\n");
}

function entries(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function LeadScoringProfileForm({ clientId, profile }: LeadScoringProfileFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [targetRoles, setTargetRoles] = useState(lines(profile.target_roles));
  const [targetGeographies, setTargetGeographies] = useState(lines(profile.target_geographies));
  const [preferredIndustries, setPreferredIndustries] = useState(lines(profile.preferred_industries));
  const [companyFitKeywords, setCompanyFitKeywords] = useState(lines(profile.company_fit_keywords));

  async function save() {
    setPending(true);
    try {
      const res = await fetch("/api/job-leads/scoring-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          targetRoles: entries(targetRoles),
          targetGeographies: entries(targetGeographies),
          preferredIndustries: entries(preferredIndustries),
          companyFitKeywords: entries(companyFitKeywords),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "The scoring profile could not be saved.");
        return;
      }
      toast.success("Scoring profile saved. Existing scores are marked for recalculation.");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <details className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
          <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
          Lead-scoring targets
        </span>
        <span className="text-xs text-zinc-500">profile version {profile.version}</span>
      </summary>
      <div className="grid gap-4 border-t border-zinc-800 p-4 md:grid-cols-2">
        <ProfileField
          id="target-roles"
          label="Target roles"
          help="One role or role family per line."
          value={targetRoles}
          onChange={setTargetRoles}
        />
        <ProfileField
          id="target-geographies"
          label="Target geographies"
          help="Cities, states, or countries to prioritise."
          value={targetGeographies}
          onChange={setTargetGeographies}
        />
        <ProfileField
          id="preferred-industries"
          label="Preferred industries"
          help="Optional exact industry targets."
          value={preferredIndustries}
          onChange={setPreferredIndustries}
        />
        <ProfileField
          id="company-fit-keywords"
          label="Company-fit keywords"
          help="Optional terms expected in sourced company facts."
          value={companyFitKeywords}
          onChange={setCompanyFitKeywords}
        />
        <div className="md:col-span-2 flex items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            Component weights are fixed by ruleset phase4-v1. Changing targets increments the profile version.
          </p>
          <Button type="button" size="sm" onClick={save} disabled={pending} className="shrink-0 gap-1.5">
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save targets
          </Button>
        </div>
      </div>
    </details>
  );
}

function ProfileField({
  id,
  label,
  help,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="resize-y"
      />
      <p className="text-xs text-zinc-500">{help}</p>
    </div>
  );
}

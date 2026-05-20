"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Play, Coffee, RotateCcw, LogOut, Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import { ManualTimeEntry } from "./ManualTimeEntry";

type Phase = "idle" | "working" | "break" | "done";

interface Segment {
  id: string | null;  // null until DB confirms the insert
  phase: "work" | "break";
  start: string;
  end: string | null;
  is_manual?: boolean;
  notes?: string | null;
  category?: string;
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

async function apiPost(body: object): Promise<{ entry?: { id: string } } | null> {
  try {
    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export function TimeTracker({ userId }: { userId: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [entries, setEntries] = useState<Segment[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSegmentStartRef = useRef<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  // ── Load from DB on mount ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/time-entries?date=${today}`);
        if (res.ok) {
          const json = await res.json() as { entries: Array<{ id: string; phase: "work"|"break"; started_at: string; ended_at: string|null; is_manual?: boolean; notes?: string | null; category?: string }> };
          const segs: Segment[] = (json.entries ?? []).map(e => ({
            id: e.id,
            phase: e.phase,
            start: e.started_at,
            end: e.ended_at,
            is_manual: e.is_manual ?? false,
            notes: e.notes,
            category: e.category,
          }));
          if (segs.length > 0) {
            setEntries(segs);
            const last = segs[segs.length - 1];
            if (last.end) {
              setPhase("done");
            } else {
              setPhase(last.phase === "work" ? "working" : "break");
            }
          }
        }
      } catch { /* offline — fallback to localStorage below */ }
      setLoaded(true);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  // ── Mirror to localStorage as fallback ────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(`tt_${userId}_${today}`, JSON.stringify({ phase, entries }));
  }, [phase, entries, userId, today, loaded]);

  // ── Keep ref in sync with latest open segment start time ─────────────────
  useEffect(() => {
    const last = entries[entries.length - 1];
    lastSegmentStartRef.current = (last && !last.end) ? last.start : null;
  }, [entries]);

  // ── Stable timer callback — no entries dependency, no interval recreation ──
  const timerCallback = useCallback(() => {
    if (lastSegmentStartRef.current) {
      setElapsed(Date.now() - new Date(lastSegmentStartRef.current).getTime());
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if ((phase === "working" || phase === "break") && lastSegmentStartRef.current) {
      timerRef.current = setInterval(timerCallback, 1000);
    } else {
      setElapsed(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, timerCallback]);

  function stamp() { return new Date().toISOString(); }

  async function refreshEntries() {
    try {
      const res = await fetch(`/api/time-entries?date=${today}`);
      if (res.ok) {
        const json = await res.json() as { entries: Array<{ id: string; phase: "work"|"break"; started_at: string; ended_at: string|null; is_manual?: boolean; notes?: string | null; category?: string }> };
        const segs: Segment[] = (json.entries ?? []).map(e => ({
          id: e.id,
          phase: e.phase,
          start: e.started_at,
          end: e.ended_at,
          is_manual: e.is_manual ?? false,
          notes: e.notes,
          category: e.category,
        }));
        setEntries(segs);
      }
    } catch { /* ignore */ }
  }

  const closeLastInDB = useCallback(async (end: string) => {
    const last = entries[entries.length - 1];
    if (!last || !last.id || last.end) return;
    await apiPost({ id: last.id, work_date: today, phase: last.phase, started_at: last.start, ended_at: end });
  }, [entries, today]);

  const startWork = useCallback(async () => {
    if (phase !== "idle") return;
    const start = stamp();
    const result = await apiPost({ work_date: today, phase: "work", started_at: start });
    const dbId = result?.entry?.id ?? null;
    setEntries([{ id: dbId, phase: "work", start, end: null }]);
    setPhase("working");
    toast.success("Work session started.");
  }, [phase, today]);

  const startBreak = useCallback(async () => {
    if (phase !== "working") return;
    const end = stamp();
    await closeLastInDB(end);
    setEntries(prev => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last && !last.end) last.end = end;
      return copy;
    });
    const start = stamp();
    const result = await apiPost({ work_date: today, phase: "break", started_at: start });
    const dbId = result?.entry?.id ?? null;
    setEntries(prev => [...prev, { id: dbId, phase: "break", start, end: null }]);
    setPhase("break");
    toast("Break started.");
  }, [phase, today, closeLastInDB]);

  const resumeWork = useCallback(async () => {
    if (phase !== "break") return;
    const end = stamp();
    await closeLastInDB(end);
    setEntries(prev => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last && !last.end) last.end = end;
      return copy;
    });
    const start = stamp();
    const result = await apiPost({ work_date: today, phase: "work", started_at: start });
    const dbId = result?.entry?.id ?? null;
    setEntries(prev => [...prev, { id: dbId, phase: "work", start, end: null }]);
    setPhase("working");
    toast.success("Back to work.");
  }, [phase, today, closeLastInDB]);

  const logOff = useCallback(async () => {
    if (phase === "idle" || phase === "done") return;
    const end = stamp();
    await closeLastInDB(end);
    setEntries(prev => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last && !last.end) last.end = end;
      return copy;
    });
    setPhase("done");
    toast.success("Day logged. Great work!");
  }, [phase, closeLastInDB]);

  // ── Totals (memoized to prevent recalculation on every render) ─────────────
  const totals = useMemo(() => {
    return entries.reduce(
      (acc, e) => {
        if (!e.end) return acc;
        const ms = new Date(e.end).getTime() - new Date(e.start).getTime();
        if (e.phase === "work") acc.work += ms;
        else acc.brk += ms;
        return acc;
      },
      { work: 0, brk: 0 }
    );
  }, [entries]);
  if ((phase === "working" || phase === "break") && elapsed > 0) {
    const last = entries[entries.length - 1];
    if (last && !last.end) {
      if (last.phase === "work") totals.work += elapsed;
      else totals.brk += elapsed;
    }
  }

  const phaseLabel: Record<Phase, string> = {
    idle: "Not started", working: "Working", break: "On break", done: "Day complete",
  };
  const phaseColor: Record<Phase, string> = {
    idle: "text-zinc-500", working: "text-green-400", break: "text-amber-400", done: "text-blue-400",
  };

  return (
    <>
    <div className="surface-card px-5 py-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400" />
          <p className="text-sm font-semibold">Today&apos;s Hours</p>
        </div>
        <span className={`text-xs font-medium ${phaseColor[phase]}`}>
          {phaseLabel[phase]}
          {(phase === "working" || phase === "break") && elapsed > 0 &&
            <span className="ml-1.5 font-mono">({fmt(elapsed)})</span>
          }
        </span>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-zinc-800 px-3 py-2.5 text-center">
          <p className="text-xl font-bold text-green-400 font-mono">{fmt(totals.work)}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Work time</p>
        </div>
        <div className="rounded-lg bg-zinc-800 px-3 py-2.5 text-center">
          <p className="text-xl font-bold text-amber-400 font-mono">{fmt(totals.brk)}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Break time</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button 
          onClick={() => setManualEntryOpen(true)} 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Entry
        </button>
        {phase === "idle" && (
          <button onClick={startWork} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 text-sm font-medium hover:bg-green-500/30 transition-colors">
            <Play className="w-3.5 h-3.5" /> Start Day
          </button>
        )}
        {phase === "working" && (<>
          <button onClick={startBreak} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors">
            <Coffee className="w-3.5 h-3.5" /> Take Break
          </button>
          <button onClick={logOff} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Log Off
          </button>
        </>)}
        {phase === "break" && (<>
          <button onClick={resumeWork} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 text-sm font-medium hover:bg-green-500/30 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Resume Work
          </button>
          <button onClick={logOff} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Log Off
          </button>
        </>)}
        {phase === "done" && (
          <p className="text-sm text-zinc-400">
            Total work: <span className="font-semibold text-green-400 font-mono">{fmt(totals.work)}</span>
            {totals.brk > 0 && <span className="ml-2">· Break: <span className="font-semibold text-amber-400 font-mono">{fmt(totals.brk)}</span></span>}
          </p>
        )}
      </div>

      {/* Segment log */}
      {entries.length > 0 && (
        <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2">
          <p className="label-section mb-1">Session log</p>
          {entries.map((e, i) => (
            <div key={e.id ?? i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={e.phase === "work" ? "text-green-400" : "text-amber-400"}>
                  {e.phase === "work" ? "▶ Work" : "☕ Break"}
                </span>
                {e.is_manual && (
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-medium">
                    Manual
                  </span>
                )}
                {e.category && e.category !== "General" && (
                  <span className="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300 text-xs">
                    {e.category}
                  </span>
                )}
              </div>
              <span className="text-zinc-500 font-mono">
                {new Date(e.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {" → "}
                {e.end ? new Date(e.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "now"}
              </span>
              <span className="text-zinc-400 font-mono w-14 text-right">
                {e.end ? fmt(new Date(e.end).getTime() - new Date(e.start).getTime()) : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>

    <ManualTimeEntry
      open={manualEntryOpen}
      onOpenChange={setManualEntryOpen}
      onSuccess={refreshEntries}
    />
    </>
  );
}

"use client";

import { isToday, parseISO } from "date-fns";
import type { Mood } from "@/types/daily-log";

const MOODS = [
  { value: "great" as Mood,       label: "Great",       dot: "bg-green-400" },
  { value: "good" as Mood,        label: "Good",        dot: "bg-blue-400" },
  { value: "neutral" as Mood,     label: "Neutral",     dot: "bg-yellow-400" },
  { value: "difficult" as Mood,   label: "Difficult",   dot: "bg-orange-400" },
  { value: "overwhelmed" as Mood, label: "Overwhelmed", dot: "bg-red-400" },
];

function moodDot(mood: Mood | null) {
  if (!mood) return "bg-zinc-700";
  return MOODS.find(m => m.value === mood)?.dot ?? "bg-zinc-700";
}

interface HistoryDay { date: string; mood: Mood | null; hasEntry: boolean; }

interface DailyLogHistoryProps {
  days: HistoryDay[];
  activeDate: string;
  onDateClick: (date: string) => void;
}

export function DailyLogHistory({ days, activeDate, onDateClick }: DailyLogHistoryProps) {
  return (
    <div className="surface-card px-5 py-4">
      <p className="label-section mb-3">Last 30 Days</p>
      <div className="flex gap-1 flex-wrap">
        {days.map(d => (
          <button
            key={d.date}
            onClick={() => onDateClick(d.date)}
            aria-label={`Load log for ${d.date}`}
            title={d.date}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
              d.date === activeDate ? "ring-1 ring-white ring-offset-1 ring-offset-zinc-900" : "hover:bg-zinc-800"
            } ${isToday(parseISO(d.date)) ? "border border-zinc-600" : ""}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${moodDot(d.mood)} ${!d.hasEntry ? "opacity-20" : ""}`} />
          </button>
        ))}
      </div>
      <div className="flex gap-4 mt-3 flex-wrap">
        {MOODS.map(m => (
          <span key={m.value} className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className={`w-2 h-2 rounded-full ${m.dot}`} />{m.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-zinc-700 opacity-20" />No entry
        </span>
      </div>
    </div>
  );
}

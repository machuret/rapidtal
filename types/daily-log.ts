export type Mood = "great" | "good" | "neutral" | "difficult" | "overwhelmed";

export interface DailyLog {
  id: string;
  log_date: string;
  tasks_done: string;
  positives: string;
  challenges: string;
  goals_achieved: string;
  goals_tomorrow: string;
  mood: Mood | null;
  admin_feedback: string | null;
  reviewed_at: string | null;
}

export interface DailyLogNote {
  id: string;
  body: string;
  created_at: string;
}

export interface AnalyticsEntry {
  log_date: string;
  mood: Mood | null;
  tasks_done: string;
  goals_achieved: string;
  challenges: string;
}

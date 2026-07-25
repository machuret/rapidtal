export type UserRole = "super_admin" | "client_admin" | "va";
export type DailyLogMood = "great" | "good" | "neutral" | "difficult" | "overwhelmed";
export type VaultSourceType = "pdf" | "docx" | "text" | "url";
export type VaultStatus = "pending" | "processing" | "ready" | "error";
export type KbRunStatus = "running" | "completed" | "failed";
export type TimeEntryPhase = "work" | "break";
export type JobAdStatus = "discovered" | "extracted" | "needs_review" | "approved" | "rejected" | "expired" | "error";
export type JobRemoteType = "onsite" | "hybrid" | "remote" | "unknown";
export type JobExtractionMethod = "json_ld" | "ai" | "json_ld+ai";
export type JobScrapeRunStatus = "running" | "completed" | "failed";
export type JobDiscoverySource = "seek" | "indeed" | "linkedin";
export type JobDiscoveryStatus = "new" | "imported" | "dismissed" | "error";

export interface DbClient {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  created_by: string | null;
}

export interface DbUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  client_id: string | null;
  created_at: string;
  phone: string | null;
  birthday: string | null;
  avatar_url: string | null;
  salary: number | null;
  payment_terms: string | null;
  payment_details: string | null;
  whatsapp: string | null;
  personal_email: string | null;
  address: string | null;
  timezone: string | null;
  skills: string[] | null;
}

export interface DbTimeEntry {
  id: string;
  user_id: string;
  client_id: string;
  work_date: string;
  phase: TimeEntryPhase;
  started_at: string;
  ended_at: string | null;
  is_manual: boolean;
  notes: string | null;
  category: string;
  created_at: string;
}

export interface DbCompanyDna {
  id: string;
  client_id: string;
  company_name: string | null;
  founders: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  values: string | null;
  services: string | null;
  target_demographic: string | null;
  client_type: string | null;
  extra: Record<string, unknown>;
  updated_at: string;
}

export type VaultCategory = 'process' | 'policy' | 'service' | 'contact' | 'reference' | 'general';

export interface DbVaultItem {
  id: string;
  client_id: string;
  source_type: VaultSourceType;
  title: string;
  source_url: string | null;
  storage_path: string | null;
  raw_content: string | null;
  status: VaultStatus;
  error_message: string | null;
  created_at: string;
  created_by: string | null;
  category: VaultCategory | null;
  tags: string[];
  ai_summary: string | null;
  updated_at: string | null;
  updated_by: string | null;
  content_hash: string | null;
}

export interface DbKbEntry {
  id: string;
  client_id: string;
  question: string;
  answer: string;
  source_vault_ids: string[];
  category: string | null;
  generated_at: string;
}

export interface DbKbGenerationRun {
  id: string;
  client_id: string;
  triggered_by: string | null;
  status: KbRunStatus;
  entries_generated: number | null;
  tokens_used: number | null;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

export type DbJobAd = {
  id: string;
  client_id: string;
  source_url: string;
  canonical_url: string;
  source_host: string;
  source_job_id: string | null;
  title: string;
  company_name: string | null;
  company_website: string | null;
  location: string | null;
  remote_type: JobRemoteType;
  employment_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: string | null;
  description: string;
  responsibilities: string[];
  skills: string[];
  posted_at: string | null;
  expires_at: string | null;
  apply_url: string | null;
  raw_content: string;
  raw_content_hash: string;
  extraction_hash: string | null;
  extraction_method: JobExtractionMethod;
  extraction_confidence: number;
  field_evidence: Record<string, string>;
  status: JobAdStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  reviewed_content_hash: string | null;
  reviewed_extraction_hash: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
};

export type DbJobAdReviewEvent = {
  id: string;
  client_id: string;
  job_ad_id: string;
  from_status: string;
  to_status: "needs_review" | "approved" | "rejected";
  notes: string | null;
  content_hash: string;
  extraction_hash: string | null;
  reviewed_by: string;
  created_at: string;
};

export type DbJobScrapeRun = {
  id: string;
  client_id: string;
  job_ad_id: string | null;
  requested_url: string;
  canonical_url: string | null;
  status: JobScrapeRunStatus;
  provider: string;
  extraction_method: JobExtractionMethod | null;
  http_status: number | null;
  tokens_used: number;
  duration_ms: number | null;
  error_code: string | null;
  error_message: string | null;
  created_by: string | null;
  started_at: string;
  completed_at: string | null;
};

export type DbJobSearch = {
  id: string;
  client_id: string;
  source: JobDiscoverySource;
  search_term: string;
  location: string;
  country: string;
  work_type: string;
  date_range_days: number;
  max_results: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  last_run_at: string | null;
};

export type DbJobDiscoveryRun = {
  id: string;
  client_id: string;
  search_id: string | null;
  source: JobDiscoverySource;
  search_term: string;
  location: string;
  status: JobScrapeRunStatus;
  provider: string;
  provider_run_id: string | null;
  result_count: number;
  new_count: number;
  cost_usd: number;
  duration_ms: number | null;
  error_code: string | null;
  error_message: string | null;
  created_by: string | null;
  started_at: string;
  completed_at: string | null;
};

export type DbJobDiscovery = {
  id: string;
  client_id: string;
  discovery_run_id: string | null;
  job_ad_id: string | null;
  source: JobDiscoverySource;
  source_job_id: string | null;
  job_url: string;
  canonical_url: string;
  title: string;
  company_name: string | null;
  company_website: string | null;
  location: string | null;
  country: string | null;
  salary_text: string | null;
  work_type: string | null;
  work_arrangement: string | null;
  summary: string | null;
  listed_at: string | null;
  expires_at: string | null;
  status: JobDiscoveryStatus;
  discovered_at: string;
  last_seen_at: string;
  updated_at: string;
};

type NoRelationships = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}[];

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: { id: string; name: string; slug: string; created_at: string; created_by: string | null };
        Insert: { id?: string; name: string; slug: string; created_at?: string; created_by?: string | null };
        Update: { id?: string; name?: string; slug?: string; created_at?: string; created_by?: string | null };
        Relationships: NoRelationships;
      };
      users: {
        Row: { id: string; email: string; full_name: string | null; role: string; client_id: string | null; created_at: string; phone: string | null; birthday: string | null; avatar_url: string | null; salary: number | null; payment_terms: string | null; payment_details: string | null; whatsapp: string | null; personal_email: string | null; address: string | null; timezone: string | null; skills: string[] | null };
        Insert: { id: string; email: string; full_name?: string | null; role: string; client_id?: string | null; created_at?: string; phone?: string | null; birthday?: string | null; avatar_url?: string | null; salary?: number | null; payment_terms?: string | null; payment_details?: string | null; whatsapp?: string | null; personal_email?: string | null; address?: string | null; timezone?: string | null; skills?: string[] | null };
        Update: { id?: string; email?: string; full_name?: string | null; role?: string; client_id?: string | null; created_at?: string; phone?: string | null; birthday?: string | null; avatar_url?: string | null; salary?: number | null; payment_terms?: string | null; payment_details?: string | null; whatsapp?: string | null; personal_email?: string | null; address?: string | null; timezone?: string | null; skills?: string[] | null };
        Relationships: [
          { foreignKeyName: "users_client_id_fkey"; columns: ["client_id"]; isOneToOne: false; referencedRelation: "clients"; referencedColumns: ["id"] }
        ];
      };
      company_dna: {
        Row: { id: string; client_id: string; company_name: string | null; founders: string | null; location: string | null; phone: string | null; email: string | null; website: string | null; values: string | null; services: string | null; target_demographic: string | null; client_type: string | null; extra: Record<string, unknown>; updated_at: string };
        Insert: { id?: string; client_id: string; company_name?: string | null; founders?: string | null; location?: string | null; phone?: string | null; email?: string | null; website?: string | null; values?: string | null; services?: string | null; target_demographic?: string | null; client_type?: string | null; extra?: Record<string, unknown>; updated_at?: string };
        Update: { id?: string; client_id?: string; company_name?: string | null; founders?: string | null; location?: string | null; phone?: string | null; email?: string | null; website?: string | null; values?: string | null; services?: string | null; target_demographic?: string | null; client_type?: string | null; extra?: Record<string, unknown>; updated_at?: string };
        Relationships: NoRelationships;
      };
      vault_items: {
        Row: { id: string; client_id: string; source_type: string; title: string; source_url: string | null; storage_path: string | null; raw_content: string | null; status: string; error_message: string | null; created_at: string; created_by: string | null; category: string | null; tags: string[]; ai_summary: string | null; updated_at: string | null; updated_by: string | null; content_hash: string | null };
        Insert: { id?: string; client_id: string; source_type: string; title: string; source_url?: string | null; storage_path?: string | null; raw_content?: string | null; status?: string; error_message?: string | null; created_at?: string; created_by?: string | null; category?: string | null; tags?: string[]; ai_summary?: string | null; updated_at?: string | null; updated_by?: string | null; content_hash?: string | null };
        Update: { id?: string; client_id?: string; source_type?: string; title?: string; source_url?: string | null; storage_path?: string | null; raw_content?: string | null; status?: string; error_message?: string | null; created_at?: string; created_by?: string | null; category?: string | null; tags?: string[]; ai_summary?: string | null; updated_at?: string | null; updated_by?: string | null; content_hash?: string | null };
        Relationships: NoRelationships;
      };
      kb_entries: {
        Row: { id: string; client_id: string; question: string; answer: string; source_vault_ids: string[]; category: string | null; generated_at: string };
        Insert: { id?: string; client_id: string; question: string; answer: string; source_vault_ids: string[]; category?: string | null; generated_at?: string };
        Update: { id?: string; client_id?: string; question?: string; answer?: string; source_vault_ids?: string[]; category?: string | null; generated_at?: string };
        Relationships: NoRelationships;
      };
      kb_generation_runs: {
        Row: { id: string; client_id: string; triggered_by: string | null; status: string; entries_generated: number | null; tokens_used: number | null; error_message: string | null; started_at: string; completed_at: string | null };
        Insert: { id?: string; client_id: string; triggered_by?: string | null; status?: string; entries_generated?: number | null; tokens_used?: number | null; error_message?: string | null; started_at?: string; completed_at?: string | null };
        Update: { id?: string; client_id?: string; triggered_by?: string | null; status?: string; entries_generated?: number | null; tokens_used?: number | null; error_message?: string | null; started_at?: string; completed_at?: string | null };
        Relationships: NoRelationships;
      };
      crm_contacts: {
        Row: { id: string; client_id: string; first_name: string; last_name: string | null; email: string | null; phone: string | null; company: string | null; job_title: string | null; status: string; source: string | null; tags: string[]; notes: string | null; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; client_id: string; first_name: string; last_name?: string | null; email?: string | null; phone?: string | null; company?: string | null; job_title?: string | null; status?: string; source?: string | null; tags?: string[]; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; client_id?: string; first_name?: string; last_name?: string | null; email?: string | null; phone?: string | null; company?: string | null; job_title?: string | null; status?: string; source?: string | null; tags?: string[]; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: NoRelationships;
      };
      crm_notes: {
        Row: { id: string; contact_id: string; client_id: string; body: string; created_by: string | null; created_at: string };
        Insert: { id?: string; contact_id: string; client_id: string; body: string; created_by?: string | null; created_at?: string };
        Update: { id?: string; contact_id?: string; client_id?: string; body?: string; created_by?: string | null; created_at?: string };
        Relationships: NoRelationships;
      };
      job_ads: {
        Row: DbJobAd;
        Insert: {
          id?: string;
          client_id: string;
          source_url: string;
          canonical_url: string;
          source_host: string;
          source_job_id?: string | null;
          title: string;
          company_name?: string | null;
          company_website?: string | null;
          location?: string | null;
          remote_type?: JobRemoteType;
          employment_type?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string | null;
          salary_period?: string | null;
          description: string;
          responsibilities?: string[];
          skills?: string[];
          posted_at?: string | null;
          expires_at?: string | null;
          apply_url?: string | null;
          raw_content: string;
          raw_content_hash: string;
          extraction_hash?: string | null;
          extraction_method: JobExtractionMethod;
          extraction_confidence?: number;
          field_evidence?: Record<string, string>;
          status?: JobAdStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          reviewed_content_hash?: string | null;
          reviewed_extraction_hash?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string;
        };
        Update: Partial<DbJobAd>;
        Relationships: NoRelationships;
      };
      job_ad_review_events: {
        Row: DbJobAdReviewEvent;
        Insert: {
          id?: string;
          client_id: string;
          job_ad_id: string;
          from_status: string;
          to_status: "needs_review" | "approved" | "rejected";
          notes?: string | null;
          content_hash: string;
          extraction_hash?: string | null;
          reviewed_by: string;
          created_at?: string;
        };
        Update: Partial<DbJobAdReviewEvent>;
        Relationships: NoRelationships;
      };
      job_scrape_runs: {
        Row: DbJobScrapeRun;
        Insert: {
          id?: string;
          client_id: string;
          job_ad_id?: string | null;
          requested_url: string;
          canonical_url?: string | null;
          status?: JobScrapeRunStatus;
          provider?: string;
          extraction_method?: JobExtractionMethod | null;
          http_status?: number | null;
          tokens_used?: number;
          duration_ms?: number | null;
          error_code?: string | null;
          error_message?: string | null;
          created_by?: string | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<DbJobScrapeRun>;
        Relationships: NoRelationships;
      };
      job_searches: {
        Row: DbJobSearch;
        Insert: {
          id?: string;
          client_id: string;
          source: JobDiscoverySource;
          search_term: string;
          location?: string;
          country?: string;
          work_type?: string;
          date_range_days?: number;
          max_results?: number;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          last_run_at?: string | null;
        };
        Update: Partial<DbJobSearch>;
        Relationships: NoRelationships;
      };
      job_discovery_runs: {
        Row: DbJobDiscoveryRun;
        Insert: {
          id?: string;
          client_id: string;
          search_id?: string | null;
          source: JobDiscoverySource;
          search_term: string;
          location?: string;
          status?: JobScrapeRunStatus;
          provider?: string;
          provider_run_id?: string | null;
          result_count?: number;
          new_count?: number;
          cost_usd?: number;
          duration_ms?: number | null;
          error_code?: string | null;
          error_message?: string | null;
          created_by?: string | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<DbJobDiscoveryRun>;
        Relationships: NoRelationships;
      };
      job_discoveries: {
        Row: DbJobDiscovery;
        Insert: {
          id?: string;
          client_id: string;
          discovery_run_id?: string | null;
          job_ad_id?: string | null;
          source: JobDiscoverySource;
          source_job_id?: string | null;
          job_url: string;
          canonical_url: string;
          title: string;
          company_name?: string | null;
          company_website?: string | null;
          location?: string | null;
          country?: string | null;
          salary_text?: string | null;
          work_type?: string | null;
          work_arrangement?: string | null;
          summary?: string | null;
          listed_at?: string | null;
          expires_at?: string | null;
          status?: JobDiscoveryStatus;
          discovered_at?: string;
          last_seen_at?: string;
          updated_at?: string;
        };
        Update: Partial<DbJobDiscovery>;
        Relationships: NoRelationships;
      };
      sops: {
        Row: { id: string; client_id: string; title: string; category: string; body: string; order_index: number; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; client_id: string; title: string; category?: string; body?: string; order_index?: number; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; client_id?: string; title?: string; category?: string; body?: string; order_index?: number; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: NoRelationships;
      };
      content_pieces: {
        Row: { id: string; client_id: string; content_type: string; title: string; brief: string | null; body: string | null; status: string; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; client_id: string; content_type: string; title: string; brief?: string | null; body?: string | null; status?: string; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; client_id?: string; content_type?: string; title?: string; brief?: string | null; body?: string | null; status?: string; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: NoRelationships;
      };
      daily_logs: {
        Row: { id: string; client_id: string; user_id: string; log_date: string; tasks_done: string; positives: string; challenges: string; goals_achieved: string; goals_tomorrow: string; mood: DailyLogMood | null; admin_feedback: string | null; reviewed_at: string | null; reviewed_by: string | null; updated_at: string };
        Insert: { id?: string; client_id: string; user_id: string; log_date: string; tasks_done?: string; positives?: string; challenges?: string; goals_achieved?: string; goals_tomorrow?: string; mood?: DailyLogMood | null; admin_feedback?: string | null; reviewed_at?: string | null; reviewed_by?: string | null; updated_at?: string };
        Update: { id?: string; client_id?: string; user_id?: string; log_date?: string; tasks_done?: string; positives?: string; challenges?: string; goals_achieved?: string; goals_tomorrow?: string; mood?: DailyLogMood | null; admin_feedback?: string | null; reviewed_at?: string | null; reviewed_by?: string | null; updated_at?: string };
        Relationships: [
          { foreignKeyName: "daily_log_notes_log_id_fkey"; columns: ["id"]; isOneToOne: false; referencedRelation: "daily_log_notes"; referencedColumns: ["log_id"] },
          { foreignKeyName: "daily_logs_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"] }
        ];
      };
      daily_log_notes: {
        Row: { id: string; log_id: string; client_id: string; user_id: string; body: string; created_at: string };
        Insert: { id?: string; log_id: string; client_id: string; user_id: string; body: string; created_at?: string };
        Update: { id?: string; log_id?: string; client_id?: string; user_id?: string; body?: string; created_at?: string };
        Relationships: NoRelationships;
      };
      time_entries: {
        Row: { id: string; user_id: string; client_id: string; work_date: string; phase: TimeEntryPhase; started_at: string; ended_at: string | null; is_manual: boolean; notes: string | null; category: string; created_at: string };
        Insert: { id?: string; user_id: string; client_id: string; work_date: string; phase: TimeEntryPhase; started_at: string; ended_at?: string | null; is_manual?: boolean; notes?: string | null; category?: string; created_at?: string };
        Update: { id?: string; user_id?: string; client_id?: string; work_date?: string; phase?: TimeEntryPhase; started_at?: string; ended_at?: string | null; is_manual?: boolean; notes?: string | null; category?: string; created_at?: string };
        Relationships: NoRelationships;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_contact_status_counts: {
        Args: { p_client_id: string };
        Returns: { status: string; count: number }[];
      };
      consume_api_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number };
        Returns: boolean;
      };
      review_job_ad: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_job_ad_id: string;
          p_status: "needs_review" | "approved" | "rejected";
          p_notes?: string | null;
        };
        Returns: DbJobAd[];
      };
      link_job_discovery: {
        Args: {
          p_client_id: string;
          p_canonical_url: string;
          p_job_ad_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

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
export type JobPipelineStage = "ingestion" | "discovery" | "company_enrichment";
export type JobPipelineAlertStatus = "open" | "acknowledged" | "resolved";
export type JobDiscoverySource = "seek" | "indeed" | "linkedin";
export type JobDiscoveryStatus = "new" | "imported" | "dismissed" | "error";
export type JobListingState = "active" | "changed" | "expired";
export type JobDiscoveryTriggerType = "manual" | "scheduled";
export type JobSourceAuthorizationBasis =
  | "written_permission"
  | "official_api"
  | "robots_permitted";
export type LeadCompanyStatus = "needs_review" | "approved" | "rejected" | "error";
export type CompanyEnrichmentRunStatus = "running" | "completed" | "failed" | "reused";
export type LeadScoreBand = "high" | "medium" | "low";
export type CrmCompanyStatus = "prospect" | "active" | "inactive" | "closed";
export type CrmContactVerificationStatus = "unverified" | "verified" | "rejected";
export type CrmVerificationMethod =
  | "company_website"
  | "linkedin"
  | "email"
  | "phone"
  | "manual_research";
export type LeadScoreComponentKey =
  | "target_role"
  | "target_geography"
  | "advertisement_recency"
  | "hiring_urgency"
  | "company_fit"
  | "outsourcing_suitability"
  | "data_completeness_confidence";

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

export type DbCrmContact = {
  id: string;
  client_id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  status: string;
  source: string | null;
  tags: string[];
  notes: string | null;
  created_by: string | null;
  crm_company_id: string | null;
  verification_status: CrmContactVerificationStatus;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbCrmCompany = {
  id: string;
  client_id: string;
  lead_company_id: string;
  source_job_ad_id: string | null;
  source_lead_score_id: string | null;
  source_enrichment_hash: string;
  name: string;
  domain: string;
  website_url: string;
  industry: string | null;
  location: string | null;
  services: string[];
  description: string | null;
  source_score_total: number | null;
  source_score_band: LeadScoreBand | null;
  source_score_summary: string | null;
  status: CrmCompanyStatus;
  promoted_by: string;
  promoted_at: string;
  created_at: string;
  updated_at: string;
};

export type DbCrmCompanyPromotionEvent = {
  id: string;
  client_id: string;
  lead_company_id: string;
  crm_company_id: string;
  job_ad_id: string;
  lead_score_id: string | null;
  enrichment_hash: string;
  promoted_by: string;
  promoted_at: string;
};

export type DbCrmContactVerification = {
  id: string;
  client_id: string;
  contact_id: string | null;
  crm_company_id: string;
  verification_method: CrmVerificationMethod;
  source_url: string;
  evidence_note: string;
  verified_name: string;
  verified_email: string | null;
  verified_phone: string | null;
  verified_job_title: string | null;
  verified_by: string;
  verified_at: string;
};

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
  company_id: string | null;
  lead_score_id: string | null;
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
  source_listing_state: JobListingState;
  source_changed_at: string | null;
  source_expired_at: string | null;
  recrawl_required: boolean;
  last_recrawled_at: string | null;
};

export type DbLeadCompany = {
  id: string;
  client_id: string;
  domain: string;
  website_url: string;
  name: string | null;
  industry: string | null;
  location: string | null;
  services: string[];
  description: string | null;
  source_backed_data: Record<string, unknown>;
  inferred_data: Record<string, unknown>;
  evidence: Record<string, unknown>;
  enrichment_hash: string;
  status: LeadCompanyStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  last_enriched_at: string;
};

export type DbCompanyEnrichmentRun = {
  id: string;
  client_id: string;
  company_id: string | null;
  job_ad_id: string;
  domain: string | null;
  status: CompanyEnrichmentRunStatus;
  provider: string;
  provider_run_id: string | null;
  search_provider_run_id: string | null;
  resolution_method: "job_ad" | "web_search" | null;
  resolution_confidence: number | null;
  resolution_evidence: Record<string, unknown>;
  model: string | null;
  prompt_version: string | null;
  input_hash: string | null;
  page_count: number;
  cost_usd: number;
  ai_estimated_cost_usd: number;
  tokens_used: number;
  duration_ms: number | null;
  error_code: string | null;
  error_message: string | null;
  created_by: string | null;
  started_at: string;
  completed_at: string | null;
};

export type DbLeadCompanyFact = {
  id: string;
  client_id: string;
  company_id: string;
  enrichment_run_id: string;
  field_name: "name" | "industry" | "location" | "services" | "description";
  value: unknown;
  fact_type: "source_backed" | "inferred";
  source_url: string | null;
  source_excerpt: string | null;
  rationale: string | null;
  confidence: number;
  created_at: string;
};

export type DbLeadCompanyReviewEvent = {
  id: string;
  client_id: string;
  company_id: string;
  from_status: string;
  to_status: "needs_review" | "approved" | "rejected";
  enrichment_hash: string;
  reviewed_by: string;
  created_at: string;
};

export type DbLeadScoringProfile = {
  id: string;
  client_id: string;
  target_roles: string[];
  target_geographies: string[];
  preferred_industries: string[];
  company_fit_keywords: string[];
  version: number;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type DbLeadScore = {
  id: string;
  client_id: string;
  job_ad_id: string;
  company_id: string;
  scoring_profile_id: string;
  ruleset_version: string;
  profile_version: number;
  input_hash: string;
  job_extraction_hash: string;
  company_enrichment_hash: string;
  total_score: number;
  score_band: LeadScoreBand;
  summary: string;
  created_by: string | null;
  created_at: string;
};

export type DbLeadScoreComponent = {
  id: string;
  client_id: string;
  lead_score_id: string;
  component: LeadScoreComponentKey;
  points: number;
  max_points: number;
  reason: string;
  inputs: Record<string, unknown>;
  created_at: string;
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
  provider_cost_usd: number;
  ai_estimated_cost_usd: number;
  duration_ms: number | null;
  error_code: string | null;
  error_message: string | null;
  created_by: string | null;
  started_at: string;
  completed_at: string | null;
};

export type DbJobExtractionQualityMeasurement = {
  id: string;
  client_id: string;
  job_ad_id: string | null;
  scrape_run_id: string | null;
  fixture_key: string;
  fixture_kind: "structured" | "dynamic" | "incomplete" | "expired" | "production_sample";
  expected_fields: Record<string, unknown>;
  actual_fields: Record<string, unknown>;
  matched_fields: number;
  measured_fields: number;
  field_accuracy: number;
  measured_by: string | null;
  measured_at: string;
};

export type DbJobPipelineAlert = {
  id: string;
  client_id: string;
  stage: JobPipelineStage;
  provider: string;
  alert_type: "provider_error" | "repeated_failure";
  severity: "warning" | "critical";
  fingerprint: string;
  title: string;
  detail: string;
  context: Record<string, unknown>;
  occurrence_count: number;
  first_seen_at: string;
  last_seen_at: string;
  status: JobPipelineAlertStatus;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
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
  schedule_enabled: boolean;
  schedule_interval_minutes: number;
  next_run_at: string | null;
  backoff_until: string | null;
  consecutive_failures: number;
  last_success_at: string | null;
  last_scheduled_run_at: string | null;
  schedule_approved_by: string | null;
  schedule_approved_at: string | null;
  compliance_policy_version: string | null;
  lease_owner: string | null;
  lease_token: string | null;
  lease_expires_at: string | null;
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
  trigger_type: JobDiscoveryTriggerType;
  lease_token: string | null;
  adapter_version: string | null;
  compliance_policy_version: string | null;
  changed_count: number;
  expired_count: number;
  complete_snapshot: boolean;
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
  listing_state: JobListingState;
  content_fingerprint: string | null;
  changed_at: string | null;
  expired_at: string | null;
};

export type DbJobSourceAccessPolicy = {
  source: JobDiscoverySource;
  adapter_version: string;
  policy_version: string;
  terms_url: string;
  allowed_hosts: string[];
  blocked_path_prefixes: string[];
  scheduled_access_enabled: boolean;
  authorization_basis: JobSourceAuthorizationBasis | null;
  authorization_reference: string | null;
  max_results_per_run: number;
  min_interval_minutes: number;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbJobDiscoverySearchSighting = {
  search_id: string;
  discovery_id: string;
  client_id: string;
  first_seen_at: string;
  last_seen_at: string;
  missed_run_count: number;
  is_expired: boolean;
  expired_at: string | null;
};

export type DbJobDiscoveryLifecycleEvent = {
  id: string;
  client_id: string;
  discovery_id: string;
  discovery_run_id: string | null;
  from_state: JobListingState;
  to_state: JobListingState;
  previous_fingerprint: string | null;
  new_fingerprint: string | null;
  reason:
    | "content_changed"
    | "explicit_expiry"
    | "missing_from_three_complete_runs"
    | "recrawl_acknowledged"
    | "listing_reappeared";
  detected_at: string;
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
        Row: DbCrmContact;
        Insert: { id?: string; client_id: string; first_name: string; last_name?: string | null; email?: string | null; phone?: string | null; company?: string | null; job_title?: string | null; status?: string; source?: string | null; tags?: string[]; notes?: string | null; created_by?: string | null; crm_company_id?: string | null; verification_status?: CrmContactVerificationStatus; verified_by?: string | null; verified_at?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<DbCrmContact>;
        Relationships: NoRelationships;
      };
      crm_companies: {
        Row: DbCrmCompany;
        Insert: Omit<DbCrmCompany, "id" | "created_at" | "updated_at" | "promoted_at"> & { id?: string; created_at?: string; updated_at?: string; promoted_at?: string };
        Update: Partial<DbCrmCompany>;
        Relationships: NoRelationships;
      };
      crm_company_promotion_events: {
        Row: DbCrmCompanyPromotionEvent;
        Insert: Omit<DbCrmCompanyPromotionEvent, "id" | "promoted_at"> & { id?: string; promoted_at?: string };
        Update: Partial<DbCrmCompanyPromotionEvent>;
        Relationships: NoRelationships;
      };
      crm_contact_verifications: {
        Row: DbCrmContactVerification;
        Insert: Omit<DbCrmContactVerification, "id" | "verified_at"> & { id?: string; verified_at?: string };
        Update: Partial<DbCrmContactVerification>;
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
          company_id?: string | null;
          lead_score_id?: string | null;
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
          source_listing_state?: JobListingState;
          source_changed_at?: string | null;
          source_expired_at?: string | null;
          recrawl_required?: boolean;
          last_recrawled_at?: string | null;
        };
        Update: Partial<DbJobAd>;
        Relationships: NoRelationships;
      };
      lead_companies: {
        Row: DbLeadCompany;
        Insert: {
          id?: string;
          client_id: string;
          domain: string;
          website_url: string;
          name?: string | null;
          industry?: string | null;
          location?: string | null;
          services?: string[];
          description?: string | null;
          source_backed_data?: Record<string, unknown>;
          inferred_data?: Record<string, unknown>;
          evidence?: Record<string, unknown>;
          enrichment_hash: string;
          status?: LeadCompanyStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          last_enriched_at?: string;
        };
        Update: Partial<DbLeadCompany>;
        Relationships: NoRelationships;
      };
      company_enrichment_runs: {
        Row: DbCompanyEnrichmentRun;
        Insert: {
          id?: string;
          client_id: string;
          company_id?: string | null;
          job_ad_id: string;
          domain?: string | null;
          status?: CompanyEnrichmentRunStatus;
          provider?: string;
          provider_run_id?: string | null;
          search_provider_run_id?: string | null;
          resolution_method?: "job_ad" | "web_search" | null;
          resolution_confidence?: number | null;
          resolution_evidence?: Record<string, unknown>;
          model?: string | null;
          prompt_version?: string | null;
          input_hash?: string | null;
          page_count?: number;
          cost_usd?: number;
          ai_estimated_cost_usd?: number;
          tokens_used?: number;
          duration_ms?: number | null;
          error_code?: string | null;
          error_message?: string | null;
          created_by?: string | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<DbCompanyEnrichmentRun>;
        Relationships: NoRelationships;
      };
      lead_company_facts: {
        Row: DbLeadCompanyFact;
        Insert: {
          id?: string;
          client_id: string;
          company_id: string;
          enrichment_run_id: string;
          field_name: DbLeadCompanyFact["field_name"];
          value: unknown;
          fact_type: DbLeadCompanyFact["fact_type"];
          source_url?: string | null;
          source_excerpt?: string | null;
          rationale?: string | null;
          confidence: number;
          created_at?: string;
        };
        Update: Partial<DbLeadCompanyFact>;
        Relationships: NoRelationships;
      };
      lead_company_review_events: {
        Row: DbLeadCompanyReviewEvent;
        Insert: {
          id?: string;
          client_id: string;
          company_id: string;
          from_status: string;
          to_status: "needs_review" | "approved" | "rejected";
          enrichment_hash: string;
          reviewed_by: string;
          created_at?: string;
        };
        Update: Partial<DbLeadCompanyReviewEvent>;
        Relationships: NoRelationships;
      };
      lead_scoring_profiles: {
        Row: DbLeadScoringProfile;
        Insert: {
          id?: string;
          client_id: string;
          target_roles?: string[];
          target_geographies?: string[];
          preferred_industries?: string[];
          company_fit_keywords?: string[];
          version?: number;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<DbLeadScoringProfile>;
        Relationships: NoRelationships;
      };
      lead_scores: {
        Row: DbLeadScore;
        Insert: {
          id?: string;
          client_id: string;
          job_ad_id: string;
          company_id: string;
          scoring_profile_id: string;
          ruleset_version: string;
          profile_version: number;
          input_hash: string;
          job_extraction_hash: string;
          company_enrichment_hash: string;
          total_score: number;
          score_band: LeadScoreBand;
          summary: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<DbLeadScore>;
        Relationships: NoRelationships;
      };
      lead_score_components: {
        Row: DbLeadScoreComponent;
        Insert: {
          id?: string;
          client_id: string;
          lead_score_id: string;
          component: LeadScoreComponentKey;
          points: number;
          max_points: number;
          reason: string;
          inputs?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<DbLeadScoreComponent>;
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
          provider_cost_usd?: number;
          ai_estimated_cost_usd?: number;
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
      job_extraction_quality_measurements: {
        Row: DbJobExtractionQualityMeasurement;
        Insert: {
          id?: string;
          client_id: string;
          job_ad_id?: string | null;
          scrape_run_id?: string | null;
          fixture_key: string;
          fixture_kind: DbJobExtractionQualityMeasurement["fixture_kind"];
          expected_fields: Record<string, unknown>;
          actual_fields: Record<string, unknown>;
          matched_fields: number;
          measured_fields: number;
          field_accuracy: number;
          measured_by?: string | null;
          measured_at?: string;
        };
        Update: Partial<DbJobExtractionQualityMeasurement>;
        Relationships: NoRelationships;
      };
      job_pipeline_alerts: {
        Row: DbJobPipelineAlert;
        Insert: {
          id?: string;
          client_id: string;
          stage: JobPipelineStage;
          provider: string;
          alert_type: DbJobPipelineAlert["alert_type"];
          severity: DbJobPipelineAlert["severity"];
          fingerprint: string;
          title: string;
          detail: string;
          context?: Record<string, unknown>;
          occurrence_count?: number;
          first_seen_at?: string;
          last_seen_at?: string;
          status?: JobPipelineAlertStatus;
          acknowledged_by?: string | null;
          acknowledged_at?: string | null;
          resolved_by?: string | null;
          resolved_at?: string | null;
        };
        Update: Partial<DbJobPipelineAlert>;
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
          schedule_enabled?: boolean;
          schedule_interval_minutes?: number;
          next_run_at?: string | null;
          backoff_until?: string | null;
          consecutive_failures?: number;
          last_success_at?: string | null;
          last_scheduled_run_at?: string | null;
          schedule_approved_by?: string | null;
          schedule_approved_at?: string | null;
          compliance_policy_version?: string | null;
          lease_owner?: string | null;
          lease_token?: string | null;
          lease_expires_at?: string | null;
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
          trigger_type?: JobDiscoveryTriggerType;
          lease_token?: string | null;
          adapter_version?: string | null;
          compliance_policy_version?: string | null;
          changed_count?: number;
          expired_count?: number;
          complete_snapshot?: boolean;
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
          listing_state?: JobListingState;
          content_fingerprint?: string | null;
          changed_at?: string | null;
          expired_at?: string | null;
        };
        Update: Partial<DbJobDiscovery>;
        Relationships: NoRelationships;
      };
      job_source_access_policies: {
        Row: DbJobSourceAccessPolicy;
        Insert: {
          source: JobDiscoverySource;
          adapter_version: string;
          policy_version: string;
          terms_url: string;
          allowed_hosts: string[];
          blocked_path_prefixes?: string[];
          scheduled_access_enabled?: boolean;
          authorization_basis?: JobSourceAuthorizationBasis | null;
          authorization_reference?: string | null;
          max_results_per_run?: number;
          min_interval_minutes?: number;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<DbJobSourceAccessPolicy>;
        Relationships: NoRelationships;
      };
      job_discovery_search_sightings: {
        Row: DbJobDiscoverySearchSighting;
        Insert: {
          search_id: string;
          discovery_id: string;
          client_id: string;
          first_seen_at?: string;
          last_seen_at?: string;
          missed_run_count?: number;
          is_expired?: boolean;
          expired_at?: string | null;
        };
        Update: Partial<DbJobDiscoverySearchSighting>;
        Relationships: NoRelationships;
      };
      job_discovery_lifecycle_events: {
        Row: DbJobDiscoveryLifecycleEvent;
        Insert: {
          id?: string;
          client_id: string;
          discovery_id: string;
          discovery_run_id?: string | null;
          from_state: JobListingState;
          to_state: JobListingState;
          previous_fingerprint?: string | null;
          new_fingerprint?: string | null;
          reason: DbJobDiscoveryLifecycleEvent["reason"];
          detected_at?: string;
        };
        Update: Partial<DbJobDiscoveryLifecycleEvent>;
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
      upsert_job_ad_extraction: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_payload: Record<string, unknown>;
        };
        Returns: DbJobAd[];
      };
      upsert_job_discoveries: {
        Args: {
          p_client_id: string;
          p_run_id: string;
          p_items: Record<string, unknown>[];
        };
        Returns: { result_count: number; new_count: number }[];
      };
      approve_job_source_access: {
        Args: {
          p_actor_id: string;
          p_source: JobDiscoverySource;
          p_enabled: boolean;
          p_authorization_basis: JobSourceAuthorizationBasis | null;
          p_authorization_reference: string | null;
          p_policy_version: string;
        };
        Returns: DbJobSourceAccessPolicy[];
      };
      configure_job_search_schedule: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_search_id: string;
          p_enabled: boolean;
          p_interval_minutes: number;
        };
        Returns: DbJobSearch[];
      };
      claim_due_job_searches: {
        Args: {
          p_worker_id: string;
          p_limit?: number;
        };
        Returns: {
          search_id: string;
          client_id: string;
          lease_token: string;
        }[];
      };
      begin_scheduled_job_discovery: {
        Args: {
          p_search_id: string;
          p_lease_token: string;
        };
        Returns: DbJobSearch[];
      };
      finish_job_search_schedule: {
        Args: {
          p_search_id: string;
          p_lease_token: string;
          p_succeeded: boolean;
          p_retry_after_seconds?: number | null;
        };
        Returns: undefined;
      };
      upsert_job_discoveries_v2: {
        Args: {
          p_client_id: string;
          p_run_id: string;
          p_items: Record<string, unknown>[];
          p_complete_snapshot: boolean;
        };
        Returns: {
          result_count: number;
          new_count: number;
          changed_count: number;
          expired_count: number;
        }[];
      };
      acknowledge_job_ad_recrawl: {
        Args: {
          p_client_id: string;
          p_job_ad_id: string;
        };
        Returns: undefined;
      };
      upsert_lead_company_enrichment: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_job_ad_id: string;
          p_run_id: string;
          p_payload: Record<string, unknown>;
        };
        Returns: DbLeadCompany[];
      };
      begin_company_enrichment_run: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_job_ad_id: string;
          p_input_hash: string;
          p_model: string;
          p_prompt_version: string;
        };
        Returns: DbCompanyEnrichmentRun[];
      };
      reuse_lead_company: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_job_ad_id: string;
          p_run_id: string;
          p_company_id: string;
        };
        Returns: DbLeadCompany[];
      };
      review_lead_company: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_company_id: string;
          p_status: "needs_review" | "approved" | "rejected";
        };
        Returns: DbLeadCompany[];
      };
      update_lead_scoring_profile: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_target_roles: string[];
          p_target_geographies: string[];
          p_preferred_industries: string[];
          p_company_fit_keywords: string[];
        };
        Returns: DbLeadScoringProfile[];
      };
      save_transparent_lead_score: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_job_ad_id: string;
          p_payload: Record<string, unknown>;
        };
        Returns: DbLeadScore[];
      };
      promote_lead_company_to_crm: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_job_ad_id: string;
          p_company_id: string;
        };
        Returns: DbCrmCompany[];
      };
      add_verified_crm_contact: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_crm_company_id: string;
          p_payload: Record<string, unknown>;
        };
        Returns: DbCrmContact[];
      };
      save_job_extraction_quality_measurement: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_payload: Record<string, unknown>;
        };
        Returns: DbJobExtractionQualityMeasurement[];
      };
      review_job_pipeline_alert: {
        Args: {
          p_actor_id: string;
          p_client_id: string;
          p_alert_id: string;
          p_action: "acknowledged" | "resolved";
        };
        Returns: DbJobPipelineAlert[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

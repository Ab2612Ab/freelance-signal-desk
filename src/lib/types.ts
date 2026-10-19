export const LEAD_STATUSES = ["new", "researched", "drafted", "contacted", "replied", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  researched: "Researched",
  drafted: "Drafted",
  contacted: "Contacted",
  replied: "Replied",
  won: "Won",
  lost: "Lost",
};

export const PLATFORMS = ["Upwork", "Agency", "Direct", "LinkedIn", "Referral", "Job board", "Other"] as const;

export interface Lead {
  id: string;
  prospect: string;
  title: string;
  platform: string;
  jobUrl: string;
  website: string;
  contactPage: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  category: string; // service id
  budget: string;
  sourceText: string;
  dateDiscovered: string; // YYYY-MM-DD
  status: LeadStatus;
  notes: string;
  followUpDate: string; // YYYY-MM-DD or ""
  archived: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LeadInput = Omit<Lead, "id" | "createdAt" | "updatedAt" | "archived">;

export const OUTREACH_MODES = [
  { id: "upwork", label: "Upwork proposal" },
  { id: "initial", label: "Initial client outreach" },
  { id: "agency", label: "Agency partnership" },
  { id: "followup", label: "Follow-up" },
  { id: "discovery", label: "Discovery questions" },
  { id: "intro", label: "Short project introduction" },
] as const;
export type OutreachMode = (typeof OUTREACH_MODES)[number]["id"];
export type Tone = "natural" | "professional" | "friendly" | "concise";
export type Length = "short" | "medium" | "long";

export interface Draft {
  id: string;
  leadId?: string | undefined;
  mode: OutreachMode;
  title: string;
  content: string;
  service: string;
  tone: Tone;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BriefInput {
  title: string;
  description: string;
  requirements: string;
  service: string;
  references: string;
  tech: string;
}

export interface BriefSection {
  key: string;
  title: string;
  kind: "fact" | "recommendation" | "assumption";
  items: string[];
}

export interface Brief {
  id: string;
  leadId?: string | undefined;
  input: BriefInput;
  sections: BriefSection[];
  prompt: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType =
  | "lead_created"
  | "lead_updated"
  | "status_changed"
  | "draft_created"
  | "brief_created"
  | "note_added"
  | "followup_scheduled"
  | "import";

export interface Activity {
  id: string;
  type: ActivityType;
  leadId?: string | undefined;
  message: string;
  at: string;
  isDemo?: boolean;
}

export interface Preferences {
  onboarded: boolean;
  name: string;
  headline: string;
  services: string[];
  customServices: string[];
  targets: string[];
  locations: string[];
  projectTypes: string[];
  minBudget: number;
  tone: Tone;
  portfolio: string[];
}

export interface AppState {
  leads: Lead[];
  drafts: Draft[];
  briefs: Brief[];
  activity: Activity[];
  prefs: Preferences;
}

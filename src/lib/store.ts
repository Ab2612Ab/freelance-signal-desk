import { useSyncExternalStore } from "react";
import type { Activity, ActivityType, AppState, Brief, Draft, Lead, LeadInput, Preferences } from "./types";
import { STATUS_LABEL } from "./types";
import { makeDemoActivity, makeDemoLeads } from "./demo-data";
import { today } from "./leads";

/** All data lives in this browser's localStorage under this key. Nothing is sent anywhere. */
export const STORAGE_KEY = "freelance-signal-desk:v1";

export const defaultPrefs: Preferences = {
  onboarded: false,
  name: "",
  headline: "Freelance full-stack web developer",
  services: ["react", "wordpress", "shopify", "api"],
  customServices: [],
  targets: ["Freelance jobs", "Agencies", "SMBs"],
  locations: ["Nigeria", "United States"],
  projectTypes: ["New build", "Redesign"],
  minBudget: 300,
  tone: "natural",
  portfolio: [],
};

const empty: AppState = { leads: [], drafts: [], briefs: [], activity: [], prefs: defaultPrefs };

type Snapshot = AppState & { hydrated: boolean };
let state: Snapshot = { ...empty, hydrated: false };
const serverSnapshot: Snapshot = { ...empty, hydrated: false };
const listeners = new Set<() => void>();

function set(next: Partial<AppState>) {
  state = { ...state, ...next };
  try {
    const { hydrated: _h, ...persist } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
  } catch {
    /* storage full or unavailable */
  }
  listeners.forEach((l) => l());
}

export function hydrateStore() {
  if (state.hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<AppState>) : {};
    state = { ...empty, ...parsed, prefs: { ...defaultPrefs, ...(parsed.prefs ?? {}) }, hydrated: true };
  } catch {
    state = { ...empty, hydrated: true };
  }
  listeners.forEach((l) => l());
}

export function useStore(): Snapshot {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
    () => serverSnapshot,
  );
}

export const getState = () => state;
const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()));
const now = () => new Date().toISOString();

function log(type: ActivityType, message: string, leadId?: string): Activity {
  return { id: uid(), type, message, leadId, at: now() };
}

export const actions = {
  addLead(input: LeadInput): Lead {
    const lead: Lead = { ...input, id: uid(), archived: false, createdAt: now(), updatedAt: now() };
    const acts = [log("lead_created", `Lead created: ${lead.title}`, lead.id)];
    if (lead.followUpDate) acts.push(log("followup_scheduled", `Follow-up scheduled for ${lead.followUpDate}: ${lead.title}`, lead.id));
    set({ leads: [lead, ...state.leads], activity: [...acts, ...state.activity] });
    return lead;
  },
  importLeads(inputs: LeadInput[]) {
    const leads = inputs.map((i) => ({ ...i, id: uid(), archived: false, createdAt: now(), updatedAt: now() }));
    set({ leads: [...leads, ...state.leads], activity: [log("import", `Imported ${leads.length} lead${leads.length === 1 ? "" : "s"} from CSV`), ...state.activity] });
  },
  updateLead(id: string, patch: Partial<Lead>) {
    const prev = state.leads.find((l) => l.id === id);
    if (!prev) return;
    const next = { ...prev, ...patch, updatedAt: now() };
    const acts: Activity[] = [];
    if (patch.status && patch.status !== prev.status) acts.push(log("status_changed", `Status changed to ${STATUS_LABEL[patch.status]}: ${next.title}`, id));
    if (patch.followUpDate !== undefined && patch.followUpDate !== prev.followUpDate && patch.followUpDate) acts.push(log("followup_scheduled", `Follow-up scheduled for ${patch.followUpDate}: ${next.title}`, id));
    if (patch.archived !== undefined && patch.archived !== prev.archived) acts.push(log("lead_updated", `${patch.archived ? "Archived" : "Restored"}: ${next.title}`, id));
    const otherKeys = Object.keys(patch).filter((k) => !["status", "followUpDate", "archived"].includes(k) && (patch as Record<string, unknown>)[k] !== (prev as unknown as Record<string, unknown>)[k]);
    if (otherKeys.length) acts.push(log("lead_updated", `Lead updated: ${next.title}`, id));
    set({ leads: state.leads.map((l) => (l.id === id ? next : l)), activity: [...acts, ...state.activity] });
  },
  deleteLeads(ids: string[]) {
    set({ leads: state.leads.filter((l) => !ids.includes(l.id)) });
  },
  addNote(message: string, leadId?: string) {
    set({ activity: [log("note_added", message, leadId), ...state.activity] });
  },
  deleteActivity(id: string) {
    set({ activity: state.activity.filter((a) => a.id !== id) });
  },
  saveDraft(d: Omit<Draft, "id" | "createdAt" | "updatedAt"> & { id?: string }): Draft {
    const existing = d.id ? state.drafts.find((x) => x.id === d.id) : undefined;
    if (existing) {
      const next = { ...existing, ...d, id: existing.id, updatedAt: now() } as Draft;
      set({ drafts: state.drafts.map((x) => (x.id === existing.id ? next : x)) });
      return next;
    }
    const draft: Draft = { ...d, id: uid(), createdAt: now(), updatedAt: now() } as Draft;
    set({ drafts: [draft, ...state.drafts], activity: [log("draft_created", `Draft created: ${draft.title}`, draft.leadId), ...state.activity] });
    return draft;
  },
  deleteDraft(id: string) { set({ drafts: state.drafts.filter((d) => d.id !== id) }); },
  saveBrief(b: Omit<Brief, "id" | "createdAt" | "updatedAt"> & { id?: string }): Brief {
    const existing = b.id ? state.briefs.find((x) => x.id === b.id) : undefined;
    if (existing) {
      const next = { ...existing, ...b, id: existing.id, updatedAt: now() } as Brief;
      set({ briefs: state.briefs.map((x) => (x.id === existing.id ? next : x)) });
      return next;
    }
    const brief: Brief = { ...b, id: uid(), createdAt: now(), updatedAt: now() } as Brief;
    set({ briefs: [brief, ...state.briefs], activity: [log("brief_created", `Demo brief saved: ${brief.input.title || "Untitled"}`, brief.leadId), ...state.activity] });
    return brief;
  },
  deleteBrief(id: string) { set({ briefs: state.briefs.filter((b) => b.id !== id) }); },
  setPrefs(patch: Partial<Preferences>) { set({ prefs: { ...state.prefs, ...patch } }); },
  loadDemo() {
    const ids = new Set(state.leads.map((l) => l.id));
    const demo = makeDemoLeads(today()).filter((l) => !ids.has(l.id));
    set({ leads: [...demo, ...state.leads], activity: [...makeDemoActivity().filter((a) => !state.activity.some((x) => x.id === a.id)), ...state.activity] });
  },
  clearDemo() {
    set({
      leads: state.leads.filter((l) => !l.isDemo),
      drafts: state.drafts.filter((d) => !d.isDemo),
      briefs: state.briefs.filter((b) => !b.isDemo),
      activity: state.activity.filter((a) => !a.isDemo),
    });
  },
  clearAll() { set({ ...empty, prefs: { ...state.prefs } }); },
  resetEverything() { set({ ...empty }); },
};

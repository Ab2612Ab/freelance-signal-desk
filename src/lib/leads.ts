import type { Lead, Preferences } from "./types";
import { detectLocation, detectServices } from "./services";

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export type DueState = "overdue" | "today" | "upcoming" | "none";
export function dueState(date: string, ref = today()): DueState {
  if (!date) return "none";
  if (date < ref) return "overdue";
  if (date === ref) return "today";
  return "upcoming";
}

/** Returns a USD amount only when the budget text is clearly in USD; otherwise null. */
export function parseUsdBudget(budget: string): number | null {
  if (!budget) return null;
  const isUsd = /\$|usd/i.test(budget);
  if (!isUsd) return null;
  const m = budget.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(k)?/i);
  if (!m) return null;
  return parseFloat(m[1]) * (m[2] ? 1000 : 1);
}

export interface FitBreakdown {
  score: number;
  reasons: { label: string; points: number; max: number }[];
}

/** Deterministic fit score (0-100) based only on the lead's own data and your saved preferences. */
export function fitScore(lead: Pick<Lead, "title" | "sourceText" | "category" | "location" | "budget" | "jobUrl" | "website" | "contactPage" | "email" | "phone" | "whatsapp">, prefs: Pick<Preferences, "services" | "locations" | "minBudget">): FitBreakdown {
  const text = `${lead.title} ${lead.sourceText}`;
  const detected = new Set([...detectServices(text), lead.category].filter(Boolean));
  const serviceHit = prefs.services.some((s) => detected.has(s));
  const loc = lead.location || detectLocation(text);
  const locHit = prefs.locations.includes("Worldwide") || (!!loc && prefs.locations.includes(loc));
  const usd = parseUsdBudget(lead.budget);
  const budgetPts = usd === null ? (lead.budget ? 10 : 0) : usd >= prefs.minBudget ? 25 : 5;
  const contactHit = !!(lead.jobUrl || lead.website || lead.contactPage || lead.email || lead.phone || lead.whatsapp);
  const detailPts = lead.sourceText.trim().length > 120 ? 10 : lead.sourceText.trim() ? 5 : 0;
  const reasons = [
    { label: "Matches your services", points: serviceHit ? 40 : 0, max: 40 },
    { label: "In your target locations", points: locHit ? 15 : 0, max: 15 },
    { label: usd === null ? "Budget (not in USD or missing)" : `Budget vs your $${prefs.minBudget} minimum`, points: budgetPts, max: 25 },
    { label: "Has a public link or contact path", points: contactHit ? 10 : 0, max: 10 },
    { label: "Description detail", points: detailPts, max: 10 },
  ];
  return { score: reasons.reduce((a, r) => a + r.points, 0), reasons };
}

export function extractFromDescription(text: string) {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const title = (lines[0] ?? "").replace(/^(title|job)\s*:\s*/i, "").slice(0, 100);
  const budgetMatch = text.match(/(?:budget\s*:?\s*)?((?:\$|₦|£|NGN\s?|USD\s?)\s?[\d,.]+k?(?:\s?(?:-|to)\s?(?:\$|₦|£)?\s?[\d,.]+k?)?(?:\s?\/\s?(?:hr|hour))?)/i);
  const services = detectServices(text);
  return {
    title,
    budget: budgetMatch ? budgetMatch[1].trim() : "",
    location: detectLocation(text),
    category: services[0] ?? "",
    platform: /upwork/i.test(text) ? "Upwork" : "",
    jobUrl: text.match(/https?:\/\/[^\s)]+/)?.[0] ?? "",
  };
}

export const isValidUrl = (v: string) => {
  if (!v) return true;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};
export const isValidEmail = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isValidDate = (v: string) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v);

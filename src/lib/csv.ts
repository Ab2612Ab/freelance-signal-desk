import { LEAD_STATUSES, type Lead, type LeadInput, type LeadStatus } from "./types";
import { isValidDate, isValidEmail, isValidUrl, today } from "./leads";

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== "")) rows.push(row);
  return rows;
}

const esc = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
export const toCsv = (rows: string[][]) => rows.map((r) => r.map((c) => esc(c ?? "")).join(",")).join("\n");

export const LEAD_CSV_FIELDS: (keyof LeadInput)[] = [
  "prospect", "title", "platform", "jobUrl", "website", "contactPage", "email", "phone", "whatsapp",
  "location", "category", "budget", "sourceText", "dateDiscovered", "status", "notes", "followUpDate",
];

export function leadsToCsv(leads: Lead[]) {
  return toCsv([LEAD_CSV_FIELDS as string[], ...leads.map((l) => LEAD_CSV_FIELDS.map((f) => String(l[f] ?? "")))]);
}

const norm = (h: string) => h.toLowerCase().replace(/[^a-z]/g, "");
const ALIASES: Record<string, keyof LeadInput> = {
  prospect: "prospect", client: "prospect", company: "prospect",
  title: "title", projecttitle: "title", job: "title",
  platform: "platform", source: "platform",
  joburl: "jobUrl", url: "jobUrl", link: "jobUrl",
  website: "website", companywebsite: "website",
  contactpage: "contactPage", email: "email", phone: "phone", whatsapp: "whatsapp",
  location: "location", country: "location", category: "category", service: "category",
  budget: "budget", sourcetext: "sourceText", description: "sourceText",
  datediscovered: "dateDiscovered", date: "dateDiscovered", status: "status",
  notes: "notes", followupdate: "followUpDate", followup: "followUpDate",
};

export interface CsvImportResult {
  valid: LeadInput[];
  errors: { row: number; message: string }[];
  unknownHeaders: string[];
}

export function csvToLeads(text: string): CsvImportResult {
  const rows = parseCsv(text.trim());
  if (rows.length < 2) return { valid: [], errors: [{ row: 1, message: "CSV needs a header row and at least one data row." }], unknownHeaders: [] };
  const head = rows[0] ?? [];
  const headers = head.map((h) => ALIASES[norm(h)]);
  const unknownHeaders = head.filter((_, i) => !headers[i]);
  if (!headers.includes("title")) return { valid: [], errors: [{ row: 1, message: 'A "title" column is required.' }], unknownHeaders };
  const valid: LeadInput[] = [];
  const errors: CsvImportResult["errors"] = [];
  rows.slice(1).forEach((r, idx) => {
    const rowNo = idx + 2;
    const o: Partial<Record<keyof LeadInput, string>> & Record<string, string | undefined> = {};
    headers.forEach((h, i) => { if (h) o[h] = (r[i] ?? "").trim(); });
    const problems: string[] = [];
    if (!o.title) problems.push("missing title");
    for (const f of ["jobUrl", "website", "contactPage"]) if (o[f] && !isValidUrl(o[f] ?? "")) problems.push(`invalid ${f}`);
    if (o.email && !isValidEmail(o.email)) problems.push("invalid email");
    for (const f of ["dateDiscovered", "followUpDate"]) if (o[f] && !isValidDate(o[f] ?? "")) problems.push(`${f} must be YYYY-MM-DD`);
    const status = (o.status || "new").toLowerCase() as LeadStatus;
    if (!LEAD_STATUSES.includes(status)) problems.push(`unknown status "${o.status}"`);
    if (problems.length) { errors.push({ row: rowNo, message: problems.join(", ") }); return; }
    valid.push({
      prospect: o.prospect ?? "", title: o.title ?? "", platform: o.platform ?? "", jobUrl: o.jobUrl ?? "",
      website: o.website ?? "", contactPage: o.contactPage ?? "", email: o.email ?? "", phone: o.phone ?? "",
      whatsapp: o.whatsapp ?? "", location: o.location ?? "", category: o.category ?? "", budget: o.budget ?? "",
      sourceText: o.sourceText ?? "", dateDiscovered: o.dateDiscovered || today(), status, notes: o.notes ?? "",
      followUpDate: o.followUpDate ?? "",
    });
  });
  return { valid, errors, unknownHeaders };
}

export function downloadFile(name: string, content: string, type = "text/csv") {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

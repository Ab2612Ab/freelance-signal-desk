import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ExternalLink, Plus, Search, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Freelance Signal Desk — Job Tracker" },
      { name: "description", content: "Track freelance jobs from saved to completed. Find the right projects. Follow up with confidence." },
      { property: "og:title", content: "Freelance Signal Desk — Job Tracker" },
      { property: "og:description", content: "Track freelance jobs from saved to completed, all in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const STATUSES = ["Saved", "Applied", "Interview", "Completed"] as const;
type Status = (typeof STATUSES)[number];
interface Job { id: string; title: string; client: string; platform: string; url: string; budget: string; notes: string; status: Status; createdAt: string }
const KEY = "freelance-signal-desk:jobs:v1";
const emptyForm = { title: "", client: "", platform: "", url: "", budget: "", notes: "" };
const statusCls: Record<Status, string> = {
  Saved: "bg-secondary text-secondary-foreground",
  Applied: "bg-primary-soft text-primary",
  Interview: "bg-warning-soft text-warning",
  Completed: "bg-success-soft text-success",
};
const validUrl = (v: string) => { if (!v) return true; try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; } };

function Index() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Status | "All">("All");

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setJobs(JSON.parse(raw)); } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) try { localStorage.setItem(KEY, JSON.stringify(jobs)); } catch { /* ignore */ } }, [jobs, loaded]);

  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, jobs.filter((j) => j.status === s).length])) as Record<Status, number>, [jobs]);
  const visible = useMemo(() => {
    const t = q.trim().toLowerCase();
    return jobs.filter((j) => (filter === "All" || j.status === filter) && (!t || `${j.title} ${j.client} ${j.platform} ${j.notes}`.toLowerCase().includes(t)));
  }, [jobs, q, filter]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.title.trim()) err["title"] = "Title is required";
    if (!validUrl(form.url.trim())) err["url"] = "Enter a full link starting with https://";
    setErrors(err);
    if (Object.keys(err).length) return;
    const job: Job = { ...form, title: form.title.trim(), url: form.url.trim(), id: crypto.randomUUID(), status: "Saved", createdAt: new Date().toISOString() };
    setJobs((p) => [job, ...p]);
    setForm(emptyForm);
  }
  const update = (id: string, status: Status) => setJobs((p) => p.map((j) => (j.id === id ? { ...j, status } : j)));
  const remove = (id: string) => { if (confirm("Delete this job?")) setJobs((p) => p.filter((j) => j.id !== id)); };
  const set = (k: keyof typeof emptyForm) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Briefcase className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground">Freelance Signal Desk</h1>
            <p className="text-xs text-muted-foreground">Find the right projects. Follow up with confidence.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-5" aria-label="Summary">
          <SummaryCard label="Total" value={jobs.length} active={filter === "All"} onClick={() => setFilter("All")} />
          {STATUSES.map((s) => <SummaryCard key={s} label={s} value={counts[s]} active={filter === s} onClick={() => setFilter(s)} />)}
        </section>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={submit} className="h-fit space-y-3 rounded-xl border bg-card p-5 shadow-card" noValidate>
            <h2 className="font-semibold text-foreground">Add a job</h2>
            <F label="Title *" id="title" error={errors["title"]}><Input id="title" value={form.title} onChange={set("title")} placeholder="Shopify store redesign" /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Client" id="client"><Input id="client" value={form.client} onChange={set("client")} /></F>
              <F label="Platform" id="platform"><Input id="platform" value={form.platform} onChange={set("platform")} placeholder="Upwork" /></F>
            </div>
            <F label="Job post URL" id="url" error={errors["url"]}><Input id="url" type="url" value={form.url} onChange={set("url")} placeholder="https://" /></F>
            <F label="Budget" id="budget"><Input id="budget" value={form.budget} onChange={set("budget")} placeholder="$800 fixed" /></F>
            <F label="Notes" id="notes"><Textarea id="notes" rows={3} value={form.notes} onChange={set("notes")} /></F>
            <Button type="submit" className="w-full"><Plus className="h-4 w-4" />Add job</Button>
            <p className="text-xs text-muted-foreground">Saved only in this browser.</p>
          </form>

          <section className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input aria-label="Search jobs" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, client, platform, notes" />
              </div>
              <select aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value as Status | "All")} className="h-9 rounded-md border bg-card px-3 text-sm text-foreground">
                <option value="All">All statuses</option>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {!loaded ? null : visible.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-card/60 p-10 text-center">
                <p className="font-semibold text-foreground">{jobs.length ? "No jobs match your search" : "No jobs yet"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{jobs.length ? "Try a different search or status." : "Add your first job with the form."}</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {visible.map((j) => (
                  <li key={j.id} className="rounded-xl border bg-card p-4 shadow-card">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-foreground">{j.title}</h3>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCls[j.status]}`}>{j.status}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{[j.client, j.platform, j.budget].filter(Boolean).join(" · ") || "No details"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select aria-label={`Status for ${j.title}`} value={j.status} onChange={(e) => update(j.id, e.target.value as Status)} className="h-8 rounded-md border bg-card px-2 text-sm text-foreground">
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        {j.url && <Button asChild size="sm" variant="outline"><a href={j.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />Open</a></Button>}
                        <Button size="icon" variant="ghost" aria-label={`Delete ${j.title}`} onClick={() => remove(j.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                    {j.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/80">{j.notes}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ label, value, active, onClick }: { label: string; value: number; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`rounded-xl border bg-card p-4 text-left shadow-card transition-colors ${active ? "border-primary ring-1 ring-primary" : "hover:border-primary/40"}`}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
    </button>
  );
}

function F({ label, id, error, children }: { label: string; id: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

import type { ReactNode, SelectHTMLAttributes } from "react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, type LeadStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/60 px-6 py-12 text-center">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary">{icon}</div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

const statusStyle: Record<LeadStatus, string> = {
  new: "bg-secondary text-secondary-foreground",
  researched: "bg-primary-soft text-primary",
  drafted: "bg-accent text-accent-foreground",
  contacted: "bg-warning-soft text-warning",
  replied: "bg-lime/40 text-lime-foreground",
  won: "bg-success-soft text-success",
  lost: "bg-destructive-soft text-destructive",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyle[status])}>{STATUS_LABEL[status]}</span>;
}

export function FitPill({ score }: { score: number }) {
  const cls = score >= 70 ? "bg-lime/50 text-lime-foreground" : score >= 45 ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground";
  return <span className={cn("inline-flex min-w-10 justify-center rounded-md px-2 py-0.5 text-xs font-bold tabular-nums", cls)} title="Fit score from your preferences">{score}</span>;
}

export function DemoTag() {
  return <span className="rounded bg-lime/40 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-lime-foreground">Demo</span>;
}

export function NativeSelect({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("field pr-8", className)} {...p}>{children}</select>;
}

export function Field({ label, htmlFor, error, hint, children, className }: { label: string; htmlFor?: string; error?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive" role="alert">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick}
      className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
        active ? "border-primary bg-primary-soft text-primary" : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
      {children}
    </button>
  );
}

export async function copyText(text: string, what = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${what} to clipboard`);
    return true;
  } catch {
    toast.error("Clipboard unavailable — select the text and copy manually");
    return false;
  }
}

export function CopyButton({ text, label = "Copy", size = "sm", variant = "outline" }: { text: string; label?: string; size?: "sm" | "default" | "icon"; variant?: "outline" | "ghost" | "default" }) {
  const [done, setDone] = useState(false);
  return (
    <Button type="button" size={size} variant={variant} disabled={!text} onClick={async () => { if (await copyText(text)) { setDone(true); setTimeout(() => setDone(false), 1500); } }} aria-label={label}>
      {done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {size !== "icon" && label}
    </Button>
  );
}

export function LocalDataNote({ className }: { className?: string }) {
  return <p className={cn("text-xs text-muted-foreground", className)}>Saved only in this browser (localStorage). Nothing is uploaded.</p>;
}

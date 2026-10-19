import type { Length, OutreachMode, Tone } from "../types";
import { SERVICES } from "../services";

export interface OutreachInput {
  mode: OutreachMode;
  title: string;
  description: string;
  prospect: string;
  service: string;
  tone: Tone;
  length: Length;
  portfolio: string;
  problem: string;
  nextStep: string;
  senderName: string;
  variation: number;
}

const pick = <T,>(arr: T[], v: number): T => arr[((v % arr.length) + arr.length) % arr.length] as T;

/** Pulls up to n requirement-like sentences straight from the supplied text (no invention). */
export function keyPoints(text: string, n = 3): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((s) => s.length > 12 && s.length < 220);
  const signal = /\b(need|needs|must|require|looking for|should|want|would like|expect|integrat|build|fix|migrat|improve)\b/i;
  const ranked = [...sentences.filter((s) => signal.test(s)), ...sentences.filter((s) => !signal.test(s))];
  return Array.from(new Set(ranked)).slice(0, n);
}

const lower1 = (s: string) => (s ? (s[0] ?? "").toLowerCase() + s.slice(1) : s);
const trimDot = (s: string) => s.replace(/[.\s]+$/, "");

export function generateOutreach(i: OutreachInput): string {
  const v = i.variation;
  const svc = SERVICES.find((s) => s.id === i.service);
  const pitch = svc?.pitch ?? "[describe the relevant service]";
  const who = i.prospect.trim() || "[client name]";
  const title = i.title.trim() || "[project title]";
  const points = keyPoints(i.description, i.length === "short" ? 1 : i.length === "medium" ? 2 : 3);
  const problem = i.problem.trim() ? trimDot(i.problem.trim()) : points[0] ? trimDot(points[0]) : "[the problem they described]";
  const portfolio = i.portfolio.trim() ? i.portfolio.trim() : "[relevant portfolio project + link]";
  const next = i.nextStep.trim() ? trimDot(i.nextStep.trim()) : pick(["a short call to confirm scope", "a few quick questions before I send a plan", "a short written plan with milestones"], v);
  const name = i.senderName.trim() || "[your name]";
  const greet = i.tone === "concise" ? `Hi ${who},` : pick(i.tone === "friendly" ? [`Hi ${who},`, `Hello ${who},`] : i.tone === "professional" ? [`Hello ${who},`, `Dear ${who},`] : [`Hi ${who},`, `Hello ${who},`], v);
  const close = pick(i.tone === "professional" ? ["Kind regards,", "Best regards,"] : i.tone === "friendly" ? ["Thanks,", "Cheers,"] : ["Thanks,", "Best,"], v);
  const long = i.length === "long";
  const short = i.length === "short" || i.tone === "concise";
  const pointLines = points.length && !short ? `\n\nFrom your post, the parts I'd focus on first:\n${points.map((p) => `- ${trimDot(p)}`).join("\n")}` : "";

  const out: string[] = [];
  switch (i.mode) {
    case "upwork": {
      out.push(greet);
      out.push(pick([
        `You mentioned ${lower1(problem)}. That's the part I'd start with on "${title}".`,
        `I read "${title}" and the key point for me is: ${lower1(problem)}.`,
        `"${title}" caught my attention because of this: ${lower1(problem)}.`,
      ], v) + pointLines);
      out.push(`This lines up with work I do regularly — ${pitch}. A relevant example: ${portfolio}.`);
      if (long) out.push(`How I'd approach it:\n1. Confirm scope and success criteria with you\n2. [first concrete step for this project]\n3. Build, review with you, then hand over with notes`);
      if (!short) out.push(`One question before starting: [question about something unclear in the post]`);
      out.push(`If it helps, I'm happy to start with ${next}.`);
      break;
    }
    case "initial": {
      out.push(greet);
      out.push(pick([
        `I came across ${who === "[client name]" ? "your business" : who} while looking at ${title === "[project title]" ? "[where you found them]" : `"${title}"`}, and noticed ${lower1(problem)}.`,
        `I'm reaching out about ${title === "[project title]" ? "[what you noticed]" : `"${title}"`} — specifically ${lower1(problem)}.`,
      ], v));
      out.push(`I'm a freelance developer focused on ${pitch}. ${short ? "" : `Similar work: ${portfolio}.`}`.trim());
      out.push(`Would ${next} be useful? No pressure either way.`);
      break;
    }
    case "agency": {
      out.push(greet);
      out.push(pick([
        `I'm a freelance full-stack developer looking to support a small number of agencies with overflow and white-label work.`,
        `I help agencies take on extra development work without adding permanent headcount.`,
      ], v));
      out.push(`My main area is ${pitch}${i.description.trim() ? `, which seems relevant to ${lower1(trimDot(keyPoints(i.description, 1)[0] ?? "the work you do"))}` : ""}. Example: ${portfolio}.`);
      if (!short) out.push(`I'm comfortable working inside your process — your PM tool, your code review, your client communication rules.`);
      out.push(`Open to ${next}?`);
      break;
    }
    case "followup": {
      out.push(greet);
      out.push(pick([
        `Following up on my earlier message about "${title}".`,
        `Just checking back in on "${title}".`,
        `A quick follow-up on "${title}" in case my last note got buried.`,
      ], v));
      if (!short) out.push(`Still happy to help with ${lower1(problem)}. ${portfolio === "[relevant portfolio project + link]" ? "" : `For reference: ${portfolio}.`}`.trim());
      out.push(`If the timing isn't right, no problem — just let me know and I'll close the loop. Otherwise, ${next}?`);
      break;
    }
    case "discovery": {
      out.push(greet);
      out.push(`Before I put together a plan for "${title}", a few questions:`);
      const qs = [
        "What does success look like for this project in the first month after launch?",
        "Who are the main users, and what's the one action you most want them to take?",
        "Is there an existing site, codebase or design file I should start from?",
        "Any required tools or platforms (hosting, payment provider, CRM, etc.)?",
        "What's your target timeline, and is there a fixed deadline?",
        "Who will review and approve the work on your side?",
        `For "${trimDot(problem)}" — how is this handled today?`,
      ];
      const count = short ? 3 : i.length === "medium" ? 5 : 7;
      out.push(qs.slice(0, count).map((q, n) => `${n + 1}. ${q}`).join("\n"));
      out.push(`Once I have these, I can suggest ${next}.`);
      break;
    }
    case "intro": {
      out.push(greet);
      out.push(`I'm ${name}, a freelance full-stack developer. For "${title}", I'd focus on ${lower1(problem)} — this is close to my work on ${pitch}.`);
      out.push(`Next step: ${next}.`);
      break;
    }
  }
  out.push(`${close}\n${name}`);
  return out.join("\n\n");
}

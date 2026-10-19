export type OutreachKind = "initial" | "followup" | "agency" | "proposal";

export interface OutreachInput {
  recipient?: string;
  service: string;
  detail?: string;
  kind: OutreachKind;
  signature?: string;
}

export function createOutreachDraft(input: OutreachInput): string {
  const recipient = input.recipient?.trim() || "there";
  const service = input.service.trim() || "web development";
  const detail = input.detail?.trim();
  const signature = input.signature?.trim() || "[Your name]\n[Portfolio link]";
  const opening: Record<OutreachKind, string> = {
    initial: "I wanted to introduce myself and see if I could be useful to your team.",
    followup: "I wanted to follow up on my earlier message and see if this is still relevant.",
    agency: "I’m reaching out to explore whether you ever need dependable freelance support for client work.",
    proposal: "I’d be glad to help with this project and discuss the outcome you’re aiming for.",
  };
  return [
    `Hi ${recipient},`,
    "",
    detail || `I came across your business and wanted to reach out with a relevant idea.`,
    "",
    `I help clients with ${service}. I aim for clear communication, practical solutions, and work tailored to each project's needs.`,
    "",
    opening[input.kind],
    "",
    "Would you be open to a short conversation?",
    "",
    "Best,",
    signature,
  ].join("\n");
}

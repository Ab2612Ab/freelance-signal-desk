import type { BriefInput, BriefSection } from "../types";
import { detectServices, serviceLabel } from "../services";
import { keyPoints } from "./outreach";

const has = (t: string, ...k: string[]) => k.some((x) => t.includes(x));

export function generateBrief(input: BriefInput): { sections: BriefSection[]; prompt: string } {
  const all = `${input.title}\n${input.description}\n${input.requirements}`.toLowerCase();
  const services = Array.from(new Set([input.service, ...detectServices(all)].filter(Boolean)));
  const reqs = input.requirements.split(/\n+/).map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim()).filter(Boolean);
  const stated = keyPoints(input.description, 3);

  const pages = ["Home"];
  if (has(all, "about", "team", "story")) pages.push("About");
  if (has(all, "service", "offer")) pages.push("Services");
  if (has(all, "shop", "store", "product", "e-commerce", "ecommerce", "woocommerce", "shopify")) pages.push("Shop / product listing", "Product detail", "Cart", "Checkout");
  if (has(all, "booking", "appointment", "reservation", "schedule")) pages.push("Booking / availability", "Booking confirmation");
  if (has(all, "pricing", "plans", "subscription")) pages.push("Pricing");
  if (has(all, "blog", "article", "news")) pages.push("Blog");
  if (has(all, "portfolio", "gallery", "case stud")) pages.push("Portfolio / gallery");
  if (has(all, "dashboard", "admin", "portal", "account", "login")) pages.push("Dashboard (UI only)");
  if (has(all, "faq")) pages.push("FAQ");
  pages.push("Contact");

  const features: string[] = [];
  if (has(all, "booking", "appointment")) features.push("Date/time slot picker with clear availability states (mock data)");
  if (has(all, "shop", "product", "cart", "e-commerce", "ecommerce")) features.push("Product grid with filters, cart drawer, checkout form (UI only)");
  if (has(all, "payment", "stripe", "paystack", "flutterwave")) features.push("Payment step placeholder — real provider to be connected later");
  if (has(all, "form", "contact", "quote", "lead")) features.push("Validated contact / quote form with success state");
  if (has(all, "search", "filter")) features.push("Search and filtering");
  if (has(all, "testimonial", "review")) features.push("Testimonials section (client to supply real quotes)");
  if (has(all, "whatsapp")) features.push("WhatsApp click-to-chat link (number supplied by client)");
  if (has(all, "map", "location", "directions")) features.push("Location / directions section");
  features.push("Clear primary call-to-action on every page", "Accessible navigation with mobile menu");

  const stack: string[] = [];
  if (input.tech.trim()) stack.push(`Client preference: ${input.tech.trim()}`);
  if (services.includes("shopify")) stack.push("Shopify theme (Liquid) for production; demo as a static React prototype");
  else if (services.includes("wordpress")) stack.push("WordPress / WooCommerce for production; demo as a static React prototype");
  else stack.push("React + TypeScript + Tailwind CSS for the demo");
  if (services.includes("api")) stack.push("Integration layer stubbed with mock data until API access is confirmed");

  const visual: string[] = [];
  if (input.references.trim()) visual.push(`Use the supplied references as direction: ${input.references.trim()}`);
  visual.push(
    has(all, "luxury", "premium", "high-end") ? "Refined, premium feel: restrained palette, generous whitespace" :
    has(all, "fun", "kids", "playful") ? "Playful, bright palette with rounded shapes" :
    "Clean, trustworthy look: neutral surfaces, one strong accent colour, readable type",
    "Real photography or client-supplied imagery preferred over stock illustrations",
  );

  const audience = has(all, "b2b", "agency", "business owners", "companies") ? ["Business decision-makers (inferred from description)"] :
    has(all, "customer", "client", "patient", "guest", "shopper") ? ["End customers of the business (inferred from description)"] : ["[Not stated — confirm the target audience with the client]"];

  const missing: string[] = [];
  if (!has(all, "$", "budget", "₦", "£")) missing.push("Budget not stated");
  if (!has(all, "deadline", "timeline", "week", "month", "asap")) missing.push("Timeline / deadline not stated");
  if (!has(all, "logo", "brand", "colour", "color")) missing.push("Brand assets (logo, colours, fonts) not mentioned");
  if (!has(all, "content", "copy", "text", "photos", "images")) missing.push("Who supplies copy and images is unclear");
  if (!has(all, "hosting", "domain")) missing.push("Hosting / domain ownership not mentioned");
  missing.push("Assumption: demo uses placeholder content and mock data only");

  const sections: BriefSection[] = [
    { key: "summary", title: "Project summary", kind: "fact", items: [input.title || "[Untitled project]", ...(stated.length ? stated : ["[No description supplied]"])] },
    { key: "requirements", title: "Stated requirements", kind: "fact", items: reqs.length ? reqs : ["[None listed separately]"] },
    { key: "problem", title: "Stated problem", kind: "fact", items: stated.length ? [stated[0] ?? "[Not stated]"] : ["[Not stated]"] },
    { key: "audience", title: "Audience", kind: (audience[0] ?? "").startsWith("[") ? "assumption" : "recommendation", items: audience },
    { key: "services", title: "Relevant services", kind: "recommendation", items: services.length ? services.map(serviceLabel) : ["[Choose a service]"] },
    { key: "pages", title: "Recommended pages", kind: "recommendation", items: Array.from(new Set(pages)) },
    { key: "features", title: "Recommended features", kind: "recommendation", items: features },
    { key: "visual", title: "Visual direction", kind: "recommendation", items: visual },
    { key: "stack", title: "Suggested stack", kind: "recommendation", items: stack },
    { key: "responsive", title: "Responsive requirements", kind: "recommendation", items: ["Mobile-first layouts from 360px", "Tablet two-column breakpoints", "Desktop max content width ~1200px", "Touch targets at least 44px"] },
    { key: "acceptance", title: "Acceptance checklist", kind: "recommendation", items: [...reqs.slice(0, 5).map((r) => `Covers: ${r}`), "All navigation links work", "Forms validate and show success/error states", "No console errors; passes basic accessibility checks", "Looks correct on mobile, tablet and desktop"] },
    { key: "missing", title: "Missing info & assumptions", kind: "assumption", items: missing },
  ];

  const sec = (k: string) => sections.find((s) => s.key === k)!.items;
  const prompt = `Build a clickable frontend demo for: ${input.title || "[project title]"}.

Context (from the client's brief):
${sec("summary").slice(1).map((s) => `- ${s}`).join("\n")}
${reqs.length ? `\nStated requirements:\n${reqs.map((r) => `- ${r}`).join("\n")}\n` : ""}
Audience: ${audience[0]}

Pages:
${sec("pages").map((p) => `- ${p}`).join("\n")}

Features:
${features.map((f) => `- ${f}`).join("\n")}

Visual direction:
${visual.map((v) => `- ${v}`).join("\n")}

Tech: ${stack.join("; ")}

Responsive: mobile-first, tested at mobile, tablet and desktop widths.

Constraints:
- Frontend only, use mock/placeholder data; no real payments, logins or emails.
- Do not invent testimonials, statistics or client names — use clearly marked placeholders.

Done when:
${sec("acceptance").map((a) => `- ${a}`).join("\n")}`;

  return { sections, prompt };
}

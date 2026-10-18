export interface ServiceDef {
  id: string;
  label: string;
  keywords: string[];
  pitch: string;
}

export const SERVICES: ServiceDef[] = [
  { id: "react", label: "React / Next.js", keywords: ["react", "next.js", "nextjs", "next js", "spa"], pitch: "building React and Next.js interfaces that are fast, maintainable and easy to extend" },
  { id: "node", label: "JavaScript / Node.js", keywords: ["node", "javascript", "express", "typescript", "backend"], pitch: "JavaScript and Node.js work, from server logic to tooling" },
  { id: "wordpress", label: "WordPress / WooCommerce", keywords: ["wordpress", "woocommerce", "elementor", "wp ", "plugin"], pitch: "WordPress and WooCommerce builds, fixes and customisations" },
  { id: "shopify", label: "Shopify", keywords: ["shopify", "liquid", "shopify theme"], pitch: "Shopify theme customisation and store setup" },
  { id: "api", label: "API integrations", keywords: ["api", "integration", "webhook", "stripe", "paystack", "flutterwave", "zapier", "crm"], pitch: "connecting systems through APIs and webhooks" },
  { id: "landing", label: "Landing / business websites", keywords: ["landing page", "business website", "company website", "website for", "one page"], pitch: "clear business websites and landing pages built around one goal" },
  { id: "redesign", label: "Redesigns", keywords: ["redesign", "revamp", "modernize", "modernise", "outdated", "refresh"], pitch: "redesigning existing sites without losing what already works" },
  { id: "booking", label: "Booking systems", keywords: ["booking", "appointment", "reservation", "calendar", "schedule"], pitch: "booking and appointment flows that reduce back-and-forth" },
  { id: "ecommerce", label: "E-commerce", keywords: ["e-commerce", "ecommerce", "online store", "shop", "checkout", "cart", "products"], pitch: "e-commerce builds focused on a smooth path to checkout" },
  { id: "maintenance", label: "Maintenance", keywords: ["maintenance", "maintain", "bug", "fix", "support", "update"], pitch: "ongoing maintenance, fixes and updates" },
  { id: "performance", label: "Performance", keywords: ["performance", "speed", "slow", "core web vitals", "lighthouse", "optimi"], pitch: "performance work: load times, Core Web Vitals and bundle size" },
  { id: "frontend", label: "UI/UX / Frontend", keywords: ["ui", "ux", "frontend", "front-end", "figma", "responsive", "design"], pitch: "turning designs into responsive, accessible frontends" },
];

export const serviceLabel = (id: string) => SERVICES.find((s) => s.id === id)?.label ?? id;

export function detectServices(text: string): string[] {
  const t = ` ${text.toLowerCase()} `;
  return SERVICES.filter((s) => s.keywords.some((k) => t.includes(k))).map((s) => s.id);
}

export const TARGETS = ["Freelance jobs", "Agencies", "SMBs", "E-commerce businesses", "Booking businesses", "Other"];
export const LOCATIONS = ["Nigeria", "United States", "United Kingdom", "Canada", "Worldwide"];
export const PROJECT_TYPES = ["New build", "Redesign", "Fixed-price", "Hourly", "Retainer / maintenance", "Overflow / white-label"];

export const LOCATION_ALIASES: Record<string, string[]> = {
  Nigeria: ["nigeria", "lagos", "abuja", "port harcourt", "ibadan", "ngn", "₦"],
  "United States": ["united states", "usa", "u.s.", " us ", "new york", "california", "texas", "florida"],
  "United Kingdom": ["united kingdom", " uk ", "london", "england", "manchester", "£"],
  Canada: ["canada", "toronto", "vancouver", "montreal"],
};

export function detectLocation(text: string): string {
  const t = ` ${text.toLowerCase()} `;
  for (const [loc, aliases] of Object.entries(LOCATION_ALIASES)) {
    if (aliases.some((a) => t.includes(a))) return loc;
  }
  return "";
}

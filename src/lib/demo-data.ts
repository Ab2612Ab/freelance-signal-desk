import type { Activity, Lead } from "./types";

/** Clearly labeled sample records. Fictional, no real people or contacts. Removable from Settings. */
export function makeDemoLeads(todayStr: string): Lead[] {
  const now = new Date().toISOString();
  const shift = (days: number) => {
    const d = new Date(todayStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const base = { jobUrl: "", website: "", contactPage: "", email: "", phone: "", whatsapp: "", archived: false, isDemo: true, createdAt: now, updatedAt: now, notes: "" };
  return [
    { ...base, id: "demo-1", prospect: "[Demo] Salon owner", title: "Booking website for a hair salon", platform: "Direct", location: "Nigeria", category: "booking", budget: "₦450,000", sourceText: "We need a simple website where customers can book appointments online and see our services and prices. Must work well on phones. We currently take bookings on WhatsApp.", dateDiscovered: shift(-6), status: "researched", followUpDate: shift(-1) },
    { ...base, id: "demo-2", prospect: "[Demo] Upwork client", title: "Next.js developer to fix slow product pages", platform: "Upwork", location: "United States", category: "performance", budget: "$800 fixed", sourceText: "Our Next.js storefront product pages load slowly on mobile. Looking for someone to improve Core Web Vitals and fix image loading. Should have experience with Shopify Storefront API.", dateDiscovered: shift(-3), status: "new", followUpDate: shift(0) },
    { ...base, id: "demo-3", prospect: "[Demo] Design agency", title: "White-label WordPress overflow support", platform: "Agency", location: "United Kingdom", category: "wordpress", budget: "", sourceText: "Small design studio looking for a reliable developer to build WordPress sites from Figma designs when we're at capacity.", dateDiscovered: shift(-10), status: "contacted", followUpDate: shift(4) },
  ];
}

export function makeDemoActivity(): Activity[] {
  const at = new Date().toISOString();
  return [
    { id: "demo-a1", type: "lead_created", leadId: "demo-1", message: "Lead created: Booking website for a hair salon", at, isDemo: true },
    { id: "demo-a2", type: "lead_created", leadId: "demo-2", message: "Lead created: Next.js developer to fix slow product pages", at, isDemo: true },
    { id: "demo-a3", type: "status_changed", leadId: "demo-3", message: "Status changed to Contacted: White-label WordPress overflow support", at, isDemo: true },
  ];
}

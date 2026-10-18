# Freelance Signal Desk

Build a polished, genuinely usable frontend-only SaaS web app called Freelance Signal Desk. Tagline: “Find the right projects. Follow up with confidence.” This is a personal freelance client research and outreach manager for a freelance full-stack web developer. Services: React/Next.js, JavaScript/Node.js, WordPress/WooCommerce, Shopify, API integrations, landing/business websites, redesigns, booking systems, e-commerce, maintenance, performance, UI/UX/frontend. Target Upwork opportunities, agencies needing overflow support, direct SMB clients, e-commerce and booking businesses in Nigeria and internationally including the US.

HARD CONSTRAINTS: frontend only. Do NOT create/enable/configure a backend, Supabase, Firebase, auth providers, paid integrations, AI APIs, API key settings, scraping services, email/WhatsApp automation, or claim live Upwork integration. Use local deterministic templates and text-processing rules, browser localStorage only (clearly label browser-local data), and optional clearly labeled removable demo records. No fabricated metrics, contacts, experience, client history, earnings, or project outcomes. Organize a documented future API service layer with local/mock adapter only.

DESIGN: premium commercial SaaS, deep navy typography, white/soft-grey surfaces, teal/blue primary accents, restrained lime highlights, subtle borders/shadows, generous spacing, rounded cards, polished tables, Lucide icons, tasteful hover/microinteractions, responsive desktop/tablet/mobile. Avoid generic AI-template look, giant empty hero, meaningless charts, excessive gradients/decorations. Persistent desktop sidebar: Overview, Find Leads, Saved Leads, Outreach Studio, Demo Briefs, Activity, Settings; mobile drawer/nav. Topbar with page title, search, optional notifications/profile.

ONBOARDING: skippable editable 6-step wizard: welcome/tagline/workflow; services selectable plus custom; target clients (freelance jobs, agencies, SMBs, e-commerce, booking businesses, other); multiple geographies (Nigeria, US, UK, Canada, worldwide); project types, minimum budget, outreach tone; completion to dashboard.

OVERVIEW: actual data-derived saved leads, researched leads, drafts, follow-ups due; recently updated leads, activity, pipeline, quick actions (add lead, paste job description, write outreach, create demo brief, import CSV). Honest empty states, no fabricated live statistics.

FIND LEADS: manually collect public opportunities; search and filters platform/service/location/budget/status; manual add form, paste description, CSV import, table/list and detail panel. Lead fields: prospect/client, project title, platform, public job URL, company website, public contact page, optional manually verified public email/phone/WhatsApp, location, category, budget, source text, date discovered, status, fit score, notes, follow-up date. Contact details optional and never invented. Show notice to follow Upwork terms/privacy; no scraping private info, bypassing login or prohibited automation.

SAVED LEADS: stages New, Researched, Drafted, Contacted, Replied, Won, Lost. Create/edit/details/status/notes/follow-up/search/filter/archive/delete with confirmation/sort newest-oldest-next follow-up/export selected or all CSV. No fake Upwork connection.

OUTREACH STUDIO: template-based writing (not AI-powered), works offline with no API. Choose saved lead or enter brief; modes: Upwork proposal, initial client outreach, agency partnership, follow-up, discovery questions, short project introduction. Controls for service, tone (natural/professional/friendly/concise), length, relevant portfolio project, stated problem, next step. Deterministic local templates use supplied title/description, explain relevant service, avoid generic intros, natural professional tone, never invent facts or claims, use placeholders for missing info, editable. Working Generate, regenerate variation, copy, save, edit, clear.

DEMO BRIEFS: turn manually entered project/job description into structured plan with inputs title, description, requirements, desired service, optional design references and tech preferences. Generate using local rules/templates: summary, audience, stated problem, recommended pages, features, visual direction, stack, responsive requirements, acceptance checklist, missing info/assumptions, complete copyable Lovable prompt. Clearly distinguish brief facts from recommendations/assumptions. Copy full prompt or sections, edit/save. Never claim AI or automatic site creation/deployment.

ACTIVITY/FOLLOW-UPS: log lead created/updated, draft created, status changed, note added, follow-up scheduled; manual notes; overdue/due today/upcoming based on real saved dates. No automated sending.

SETTINGS: profile, services, locations, project preferences, outreach tone, data management, privacy. Export and clear local demo data. No API key settings.

ARCHITECTURE: reusable components and types for leads, drafts, briefs, preferences, activity. Separate mock data, frontend state, template generation, CSV utilities and future API service interface. Core requirements: working nav, onboarding, forms/validation, CRUD, search/filter/status, template generation, editable drafts, demo brief generator, clipboard, CSV import with validation/export, local persistence, responsive layouts, accessibility/keyboard, loading/success/empty/error states. Every visible control must work; no dead buttons or fake progress. Test main flows and ensure it builds. Prioritize a real working frontend over decoration. Do not publish/deploy unless asked.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/14d0e3ba-d95a-47b9-a3a9-db3443dc328c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

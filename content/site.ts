/**
 * Copy and structure shared by every page: brand, navigation, the
 * announcement bar, the footer and the closing demo band.
 *
 * All of the site's wording lives in this folder (one file per page) so that
 * text can be edited without touching layout code.
 */

export const BRAND = {
  /** The company, where a company name is needed. */
  company: "GOLEM AI",
  /** The product, as it is written in running prose. */
  product: "GOLEM",
  positioning: "Agentic Operations Platform · Human-approved by Design",
  positioningShort: "Agentic Operations Platform",
} as const;

export const NAV = [
  { label: "Product", href: "/product" },
  { label: "About Us", href: "/about" },
] as const;

export const PRIMARY_CTA = { label: "Request a demo", href: "#contact" } as const;

export const ANNOUNCEMENT = {
  tag: "The name",
  text: "A golem lives by one word: truth. We hold our AI to it.",
  linkLabel: "Read the story",
  href: "/about#name",
} as const;

/** Systems GOLEM connects to, shown as a scrolling strip. Names only, no logos. */
export const INTEGRATIONS = {
  eyebrow: "Integrates with the point-of-sale and finance systems already in use",
  rowOne: ["Square", "Shopify", "Lightspeed", "Clover", "Zettle", "SumUp", "Epos Now", "Toast", "Vend", "Revel", "TouchBistro"],
  rowTwo: ["Xero", "QuickBooks", "Sage", "Stripe", "Deputy", "Dojo", "Worldpay", "FreeAgent", "Planday", "Adyen", "GoCardless"],
} as const;

export const FOOTER = {
  tagline: "Operational intelligence for businesses that run on a point of sale. Human-approved by design.",
  commitments: [
    { icon: "approve", title: "Held for your approval", sub: "Nothing runs until a person approves it" },
    { icon: "isolate", title: "Your data, isolated", sub: "Kept apart from every other customer’s" },
    { icon: "deploy", title: "Cloud by default", sub: "Private deployment available when needed" },
  ],
  links: [
    { label: "Product", href: "/product" },
    { label: "About Us", href: "/about" },
    { label: "Request a demo", href: "#contact" },
  ],
} as const;

export const DEMO_BAND = {
  headlineLead: "Every decision crosses",
  headlineAccent: "your desk first.",
  sub: "A 30-minute session with the GOLEM team, using a sample of your own sales data where available.",
  formTitle: "Tell us about your business",
  formSub: "We respond within one working day.",
  bullets: [
    "Walk through a 06:00 plan: the orders, prices and rota it prepares",
    "See an action held, approved and written to the ledger",
    "Ask about your POS, your back office, deployment and data handling",
  ],
} as const;

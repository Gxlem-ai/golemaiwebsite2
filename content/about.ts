/** Wording for the About Us page. Layout lives in components/sections. */

export const ABOUT = {
  meta: {
    title: "About Us",
    description:
      "Why the company is called GOLEM, what the ledger is for, and the rules we hold ourselves to: a source for every number, approval before any action, and misses kept on the record.",
  },

  hero: {
    eyebrow: "About",
    headlineMuted: "AI will give a business a confident answer whether or not it is true.",
    headlineStrong: "GOLEM is built so that every answer can be checked.",
    body: "GOLEM is an Agentic Operations Platform for businesses that run on a point of sale. We built it for the people who answer for every pound of margin: it prepares the ordering, pricing and staffing decisions, a person approves every action, and every figure can be traced to its source.",
    /** Phrases inside `body`, shown in the accent colour. */
    bodyAccents: ["a person approves every action", "traced to its source"],
    cta: { label: "See how it works", href: "/product" },
  },

  name: {
    eyebrow: "The name",
    title: "Why “Golem”?",
    /** Revealed word by word as the section scrolls. */
    legend:
      "In the legend, a golem — a figure of clay — is brought to life by one word written on its forehead: emet. Truth. Erase a single letter and it reads met. Dead. The clay doesn’t get to lie; the word is either true, or the golem stops.",
    resolution:
      "We named the company after the legend because the same rule holds for AI at work in a business: it runs on truth, or it’s dead weight. The ledger is how we keep it awake.",
    /** A phrase inside `resolution`, shown in the accent colour. */
    resolutionAccent: "it runs on truth, or it’s dead weight.",
    /** The line under the stone, as the legend moves through its three states. */
    states: {
      clay: "A figure of clay",
      alive: "emet \u00b7 truth",
      stopped: "met \u00b7 dead",
    },
  },

  ledgerBand: {
    h2: "How we keep it awake",
    paragraphs: [
      "Every forecast is written to the ledger before the day it predicts. When the day closes, the real outcome is recorded beside it. A miss stays on the record exactly as a hit does.",
      "Recommendations and approvals are recorded in the same way, and no entry is edited after the fact. What GOLEM said, what you decided and what happened can all be read back later.",
    ],
  },

  principles: {
    eyebrow: "Principles",
    h2: "What we hold ourselves to",
    items: [
      {
        title: "No number without a source.",
        tag: "Sourced figures",
        body: "Every figure GOLEM shows carries the system it came from and the time it was read. If a number is going to move your margin, you should be able to follow it back to the row.",
      },
      {
        title: "No action without approval.",
        tag: "Human approval",
        body: "GOLEM prepares orders, price changes and rota adjustments. A person approves each one before anything is executed, and can adjust it first. What you do not approve does not happen.",
      },
      {
        title: "No miss left off the record.",
        tag: "Misses included",
        body: "Forecasts are recorded before the day they predict, and the real outcome is recorded beside them. Entries are not edited after the fact. When GOLEM gets a day wrong, that stays on the record too.",
      },
      {
        title: "Your data works for you alone.",
        tag: "Isolated data",
        body: "Your sales, stock and staffing data is kept isolated from every other customer’s and is used to plan for your business alone. GOLEM is cloud-hosted by default, with private deployment available.",
      },
    ],
  },

  foundersNote: {
    eyebrow: "From the founders",
    title: "You should not have to take our word",
    paragraphs: [
      "Most of what a business needs to know to order, price and staff well is already written down somewhere: in the till, the stock count, the supplier invoice, the rota. Nobody has the time to read all of it before the doors open, so most decisions are made from a fraction of what the business knows.",
      "We built GOLEM to do that reading. We also know what would make it worthless. An AI that produces a confident figure it cannot support is worse than no system at all, because sooner or later somebody acts on it. In the legend, the clay stops the moment its word is no longer true. We hold software that touches your margin to the same standard.",
      "That standard is uncomfortable, and it is meant to be. It means showing the source of every figure, waiting for a person before anything is done, and leaving our misses on the record where you can count them.",
      "You should not have to take our word for any of this. The ledger exists so that you never need to.",
    ],
    signoff: "The founders, GOLEM AI",
  },
} as const;

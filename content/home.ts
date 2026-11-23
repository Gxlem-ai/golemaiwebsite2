/** Wording for the home page. Layout lives in components/sections. */

export const HOME = {
  hero: {
    badge: "Agentic Operations Platform · Human-approved by Design",
    badgeShort: "Agentic Operations Platform",
    h1Lead: "Operational intelligence, built on the point of sale.",
    h1Muted: "Approved by you before it acts, and on the record once it has.",
    body: "GOLEM connects to the point-of-sale and back-office systems a business already runs. It forecasts demand, prepares ordering, pricing and staffing decisions, and executes them once an operator approves. One integration covers any POS and every location.",
    /** A phrase inside `body`, shown in the accent colour. */
    bodyAccent: "once an operator approves",
    primaryCta: "Request a demo",
    secondaryCta: "See how it works",
  },

  rowConnect: {
    title: "Your till, your stock and your books, in one record.",
    body: "GOLEM connects to the POS you already use, then brings payments, inventory, suppliers, accounting and scheduling into the same record. No new hardware, and nothing your staff already know has to be replaced.",
  },

  rowForecast: {
    title: "Tomorrow’s trading, modelled tonight.",
    body: "Each night GOLEM runs thousands of demand scenarios against your own sales history, the weather, local events and your promotions, and turns the result into quantities you can order against.",
  },

  planBand: {
    h2Lead: "Introducing the 06:00 plan.",
    h2Muted: "Review, adjust, approve.",
    body: "By 06:00 the day’s orders, price changes and rota adjustments are drafted and waiting, each with its reasoning and its source. You review, adjust and approve. GOLEM does the rest and records what happened.",
    cta: "See how the plan is built",
  },

  rowApprove: {
    title: "Nothing executes until someone approves it.",
    body: "Every order, price change and rota adjustment waits in a queue with its reasoning and expected impact attached. Review it, adjust it, approve it. Only then does GOLEM act.",
  },

  rowSource: {
    title: "Every number shows its source.",
    body: "Ask about yesterday’s trading in plain language. Each figure in the answer points to the row it was read from, in the till, the stock system or the accounts. If a number looks wrong, you can check it.",
  },

  ledgerBand: {
    eyebrow: "The ledger",
    h2: "Written down before the day. Checked against it after.",
    body: "Each forecast is entered in the ledger before the day it predicts, and what actually happened is entered beside it. Nothing is edited afterwards, so the misses stay on the record beside the hits. When GOLEM says what Saturday will need, you can look up how it did last time.",
  },

  why: {
    h2: "Why GOLEM?",
    cards: [
      {
        title: "Decide before the day starts, not after it ends.",
        body: "GOLEM checks each draft order against forecast demand and the stock you already hold. Where a quantity is off, it shows the correction and the reason before anything is sent.",
      },
      {
        title: "Small corrections add up to margin you keep.",
        body: "A discount runs deeper than it needs to. A line is set to sell out by lunchtime. Each correction you approve protects a little margin, and you can watch the total build.",
      },
      {
        title: "Take the spreadsheet out of the morning.",
        body: "Exports, stock counts and a best guess used to fill the start of the day. Now the forecast, the order and the rota are drafted before you arrive. You read the plan and decide.",
      },
    ],
    footnote: "Figures in the product illustrations are examples, not customer results.",
  },

  mission: {
    eyebrow: "Our mission",
    sentence:
      "Our mission is to put AI to work in every business that runs on a point of sale, with every decision approved and every number true.",
    /** The closing clause of `sentence`, revealed in the accent colour. */
    accent: "with every decision approved and every number true.",
  },

  foundersNote: {
    eyebrow: "From the founders",
    title: "The rule behind our name",
    paragraphs: [
      "A business that runs on a point of sale already holds the truth about itself. It sits in the till, the stock count, the supplier invoice and the rota. What nobody has is the time to read all of it before the doors open.",
      "We built GOLEM to do that reading, on one condition: you must be able to check it. So every figure carries its source. Every action waits for your approval. Every forecast is written down before the day it predicts, and the outcome is recorded beside it, whether GOLEM was right or not.",
      "An AI you cannot check is dead weight. That is the rule behind our name, and we keep the ledger so that you can hold us to it.",
    ],
    signoff: "The founders, GOLEM AI",
    link: { label: "Why we chose the name", href: "/about#name" },
  },
} as const;

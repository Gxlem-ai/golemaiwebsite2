/** Wording for the Product page. Layout lives in components/sections. */

export const PRODUCT = {
  meta: {
    title: "Product",
    description:
      "How GOLEM works: one integration with the point of sale and back office, demand modelled overnight, a daily plan ready by 06:00, every action held for approval and every outcome written to the ledger.",
  },

  hero: {
    eyebrow: "Product",
    h1: "The operating layer for businesses that run on a point of sale.",
    callout: "One integration covers any POS and every location.",
    body: "Most businesses run on disconnected tools, spreadsheets and the memory of a few key people. GOLEM consolidates that operating data and prepares the decisions that depend on it.",
    accentSentence: "You approve what runs, and the forecast, the decision and the outcome all go on the record.",
    cta: "See how it works",
  },

  gapPanel: {
    h2: "Your till knows what sold. It does not know what to order.",
    body: "Sales sit in one system, stock in another and the rota somewhere else. Joining them up is left to whoever opens up, usually with a spreadsheet and not much time. GOLEM does that work overnight and brings you a decision that is ready to check.",
    principle:
      "GOLEM prepares the decision and shows the source. It waits for approval. It executes only what is approved, and it records what happened. In that order, every time.",
    /** A phrase inside `principle`, shown in the accent colour. */
    principleAccent: "In that order, every time.",
    principleLabel: "How GOLEM operates",
  },

  how: {
    h2: "How GOLEM works",
    cta: "Request a demo",
    groups: [
      {
        label: "Connect",
        steps: [
          {
            title: "Connects to the POS you already run",
            body: "Native connectors read sales, items and transactions from the point of sale in use. No new hardware and no migration; a typical connection takes under 30 minutes.",
          },
          {
            title: "Builds one operating record",
            body: "Payments, inventory, suppliers, accounting and scheduling are normalised into a single record for every location, kept current as the systems change.",
          },
          {
            title: "Answers questions in plain language",
            body: "Ask what sold, what ran out or where margin went. Answers come from the underlying systems, not from a report assembled the week before.",
          },
        ],
      },
      {
        label: "Model",
        steps: [
          {
            title: "Models tomorrow’s demand overnight",
            body: "Thousands of demand scenarios are evaluated each night against your sales history, the weather, local events and your own promotions.",
          },
          {
            title: "Prepares the daily plan",
            body: "Specific reorder quantities, price adjustments and rota changes are drafted for each site and ready by 06:00, every trading day.",
          },
          {
            title: "Attaches the reasoning and the source",
            body: "Each recommendation carries the data behind it, where that data was read from and when, so a decision can be checked before it is made.",
          },
        ],
      },
      {
        label: "Govern",
        steps: [
          {
            title: "Holds every action for approval",
            body: "Approve in one step or adjust first. GOLEM changes a price, places an order or publishes a rota only after a person has signed it off.",
          },
          {
            title: "Writes everything to the ledger",
            body: "The forecast, the decision and the outcome are recorded side by side and never edited afterwards. Misses stay on the record beside the hits.",
          },
        ],
      },
    ],
  },

  forecastDemo: {
    eyebrow: "Try it",
    h2: "The signals your baseline cannot see.",
    sub: "A week-on-week average misses the market, the weather and your own price tests. Switch the signals on and off to see what each one contributes to next week’s demand.",
    footnote:
      "Illustrative figures for a single site. Live forecasts are built from each business’s own sales history and local conditions.",
  },

  approvalsDemo: {
    eyebrow: "Try it",
    h2: "Run the 06:00 queue yourself.",
    sub: "This is the daily plan as an operator sees it. Adjust any recommendation, approve it, and watch it reach the ledger. Every action carries its reasoning and its expected impact.",
  },

  outcomes: {
    eyebrow: "Outcomes",
    h2: "Measured outcomes, from a single site to a multi-location estate.",
    sub: "Across inventory, pricing, labour and daily operations, GOLEM works from actual sales and local conditions rather than industry averages.",
    footnote: "Figures reflect early deployments and vary by business, sector and data quality.",
    metrics: [
      { label: "Gross margin", value: "+3–5 pts", sub: "Typical improvement within 90 days", lo: 3, hi: 5, scaleMin: 0, scaleMax: 10, scaleNote: "0 to 10 pts" },
      { label: "Waste and overstock", value: "Up to 50%", sub: "Reduction in spoilage and dead stock", lo: 0, hi: 50, scaleMin: 0, scaleMax: 100, scaleNote: "0 to 100%" },
      { label: "Administrative time", value: "60–100 hrs", sub: "Recovered per month across forecasting and ordering", lo: 60, hi: 100, scaleMin: 0, scaleMax: 120, scaleNote: "0 to 120 hrs" },
      { label: "Forecast accuracy", value: "96–99%", sub: "Daily demand, measured at line level", lo: 96, hi: 99, scaleMin: 90, scaleMax: 100, scaleNote: "90 to 100%" },
    ],
  },
} as const;

/**
 * The illustrative business behind every product mock-up on the site.
 *
 * One small estate, one trading week, one set of numbers, so that a figure
 * seen in one animation agrees with the same figure in another. Everything
 * here is invented for illustration; none of it is customer data.
 */

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** A plain week-on-week average: what most operators order against. */
export const BASELINE = [420, 435, 430, 455, 520, 610, 540] as const;

/** What each signal adds to the baseline, in covers, day by day. */
export const SIGNALS = [
  { key: "weather", label: "Weather", note: "Clear and 4°C above seasonal from Friday", delta: [5, 8, 6, 10, 28, 48, 40] },
  { key: "events", label: "Local events", note: "Saturday street market, 11:00–16:00", delta: [0, 0, 0, 0, 10, 62, 14] },
  { key: "promotions", label: "Promotions", note: "Midweek price test on three lines", delta: [0, 0, 44, 30, 10, 0, 0] },
] as const;

export type SignalKey = (typeof SIGNALS)[number]["key"];

/** The forecast with every signal applied. Saturday lands 18% above baseline. */
export const FORECAST = BASELINE.map((b, i) => b + SIGNALS.reduce((sum, s) => sum + s.delta[i], 0));

export const SATURDAY = {
  baseline: BASELINE[5],
  forecast: FORECAST[5],
  upliftCovers: FORECAST[5] - BASELINE[5],
  upliftPct: Math.round((FORECAST[5] / BASELINE[5] - 1) * 100),
} as const;

/** The three sites in the estate. */
export const SITES = [
  { id: "01", name: "High Street" },
  { id: "02", name: "Riverside" },
  { id: "03", name: "Station" },
] as const;

/** The six kinds of system GOLEM reads from. Categories, not product names. */
export const SOURCES = [
  { key: "pos", label: "POS", detail: "412 transactions" },
  { key: "payments", label: "Payments", detail: "Card and cash" },
  { key: "inventory", label: "Inventory", detail: "218 lines" },
  { key: "suppliers", label: "Suppliers", detail: "9 price lists" },
  { key: "accounting", label: "Accounting", detail: "Ledger codes" },
  { key: "scheduling", label: "Scheduling", detail: "This week’s rota" },
] as const;

/** The 06:00 daily plan: three recommendations awaiting approval. */
export const PLAN = {
  id: "PLAN_2211",
  day: "Saturday",
  readyAt: "06:00",
  approvedAt: "06:02",
  actions: [
    {
      key: "order",
      agent: "Ordering",
      title: "Order six fast-moving lines up for Saturday",
      short: "+6 lines for Saturday",
      reason: "Demand forecast 18% above baseline; stock covers 71% of it.",
      impact: 408,
      impactLabel: "margin protected",
    },
    {
      key: "price",
      agent: "Pricing",
      title: "Hold weekend discounts at 12% on three lines",
      short: "Discount depth to 12%",
      reason: "These lines sold at full rate last weekend; the deeper discount bought no volume.",
      impact: 444,
      impactLabel: "margin recovered",
    },
    {
      key: "labour",
      agent: "Labour",
      title: "Move one shift from Tuesday evening to Saturday midday",
      short: "+1 midday shift",
      reason: "Tuesday evening is over-covered; Saturday midday is one person short for the market.",
      impact: 95,
      impactLabel: "labour cost avoided",
    },
  ],
} as const;

export const PLAN_IMPACT = PLAN.actions.reduce((sum, a) => sum + a.impact, 0);

/** Yesterday's trading, as the console reports it. */
export const TRADING = {
  revenue: 4920,
  revenueVsLastWeekPct: 8,
  marginPts: 3.1,
  transactions: 412,
  basket: 11.94,
  stockouts: 2,
  scenarios: 12000,
} as const;

/**
 * Ledger entries: what was forecast, written down beforehand, against what
 * happened. The miss is kept on purpose; it is the point of the ledger.
 */
export const LEDGER = [
  { key: "sat-covers", label: "Covers", scope: "Sat · all sites", forecast: 720, actual: 712, unit: "", hit: true },
  { key: "fri-flatwhite", label: "Oat flat white", scope: "Fri · High Street", forecast: 310, actual: 318, unit: "", hit: true },
  { key: "sat-sourdough", label: "Sourdough loaf", scope: "Sat · Riverside", forecast: 84, actual: 61, unit: "", hit: false },
  { key: "sun-covers", label: "Covers", scope: "Sun · all sites", forecast: 594, actual: 601, unit: "", hit: true },
] as const;

/** Signed percentage difference of actual against forecast, to one decimal. */
export const variancePct = (forecast: number, actual: number) =>
  Math.round(((actual - forecast) / forecast) * 1000) / 10;

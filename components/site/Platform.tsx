"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  CountUp,
  Reveal,
  RevealItem,
  Section,
  SectionHeader,
  SpotlightCard,
  cx,
  usePrefersReducedMotion,
  type RM,
} from "@/components/site/primitives";

/* ═══════════════════════ Integrations ═══════════════════════ */

const ROW_ONE = [
  "Square",
  "Shopify",
  "Lightspeed",
  "Clover",
  "Zettle",
  "SumUp",
  "Epos Now",
  "Toast",
  "Vend",
  "Revel",
  "TouchBistro",
];
const ROW_TWO = [
  "Xero",
  "QuickBooks",
  "Sage",
  "Stripe",
  "Deputy",
  "Dojo",
  "Worldpay",
  "FreeAgent",
  "Planday",
  "Adyen",
  "GoCardless",
];

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className="marquee-track mask-fade-edges overflow-hidden">
      <div
        className={cx(
          "marquee-row flex w-max items-center gap-3",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
      >
        {row.map((name, i) => (
          <span
            key={`${name}-${i}`}
            aria-hidden={i >= items.length}
            className="group whitespace-nowrap rounded-lg border border-w-border bg-w-bg-secondary px-5 py-2.5 text-[14px] font-medium text-w-muted transition-colors duration-300 hover:border-accent/30 hover:bg-w-card hover:text-w-cream"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function IntegrationsStrip({ reducedMotion }: { reducedMotion: RM }) {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <Reveal className="mb-5 text-center">
        <p className="text-[11px] uppercase tracking-[0.16em] text-w-faint">
          Integrates with the point-of-sale and finance systems already in use
        </p>
      </Reveal>
      <div className="space-y-3">
        <MarqueeRow items={ROW_ONE} />
        <MarqueeRow items={ROW_TWO} reverse />
      </div>
    </div>
  );
}

/* ═══════════════════════ Capability band ═══════════════════════ */

/* NOTE: these describe how the product operates, not traction. Replace as needed. */
export function ProofBand() {
  const stats: { to: number; prefix?: string; suffix?: string; label: string }[] = [
    { to: 30, prefix: "<", suffix: " min", label: "Typical time to connect a POS" },
    { to: 6, prefix: "0", suffix: ":00", label: "Daily plan delivered, every trading day" },
    { to: 100, suffix: "%", label: "Actions subject to human approval" },
    { to: 24, suffix: "/7", label: "Continuous monitoring of connected systems" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-6">
      <Reveal stagger={0.08}>
        <div className="grid grid-cols-2 divide-y divide-w-border overflow-hidden rounded-2xl border border-w-border bg-w-bg-secondary sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
          {stats.map((s) => (
            <RevealItem key={s.label}>
              <div className="group relative overflow-hidden p-5 text-center transition-colors duration-300 hover:bg-w-card sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent/50 to-transparent transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
                <div className="whitespace-nowrap text-[28px] font-semibold leading-none text-w-cream sm:text-[38px]">
                  <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="mx-auto mt-3 max-w-[190px] text-[13px] leading-relaxed text-w-muted">
                  {s.label}
                </div>
              </div>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

/* ═══════════════════════ Operating model ═══════════════════════ */

export function NewWaySection({ reducedMotion }: { reducedMotion: RM }) {
  const cards = [
    {
      title: "One system of record for operations",
      desc: "Sales, stock, pricing, staffing, supplier and cash data are consolidated into a single operating view. Questions are answered from the underlying systems, not from a report assembled the week before.",
    },
    {
      title: "Institutional memory that stays with the business",
      desc: "Every promotion, supplier change, weather event and shift note is retained and used in subsequent forecasts. Operating knowledge accumulates in the platform rather than leaving with individual staff.",
    },
    {
      title: "Judgement remains with the operator",
      desc: "GOLEM presents options together with the data and reasoning behind them. Operators review, adjust and approve. Nothing is executed without sign-off.",
    },
  ];

  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left */}
        <div>
          <SectionHeader
            align="left"
            eyebrow="The operating model"
            title={
              <>
                From fragmented systems to{" "}
                <span className="text-gradient-accent">one governed operation.</span>
              </>
            }
            subtitle="Most small and mid-sized businesses run on disconnected tools, spreadsheets and the memory of a few key people. GOLEM consolidates that operating data, prepares the decisions that depend on it, and holds every action for approval."
          />

          {/* Before / after */}
          <Reveal delay={0.15} className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row">
            <div className="flex-1 rounded-xl border border-w-border bg-w-bg-secondary p-4 opacity-70 transition-opacity duration-500 hover:opacity-100">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-w-faint">Today</p>
              <div className="space-y-2">
                {["Data spread across disconnected tools", "Ordering and pricing set by instinct", "Knowledge held by individuals"].map((t) => (
                  <div key={t} className="flex items-start gap-2 text-[12px] leading-snug text-w-muted">
                    <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-w-dim" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <motion.div
                animate={reducedMotion ? {} : { x: [0, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="sm:rotate-0"
              >
                <ArrowRight className="h-5 w-5 rotate-90 text-accent sm:rotate-0" aria-hidden="true" />
              </motion.div>
            </div>
            <SpotlightCard className="flex-1 rounded-xl border border-accent/25 bg-accent/[0.06] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-accent">
                With GOLEM
              </p>
              <div className="space-y-2">
                {["A single, consolidated operating record", "Forecast-driven ordering and pricing", "Every decision reviewed and logged"].map((t) => (
                  <div key={t} className="flex items-start gap-2 text-[12px] leading-snug text-w-cream">
                    <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {t}
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>
        </div>

        {/* Right: cards */}
        <Reveal stagger={0.1} className="space-y-3">
          {cards.map((card) => (
            <RevealItem key={card.title}>
              <SpotlightCard className="group rounded-xl border border-w-border bg-w-bg-secondary p-5 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-w-border-light hover:bg-w-card hover:shadow-card">
                <h3 className="text-[15px] font-semibold text-w-cream">{card.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-w-muted">{card.desc}</p>
              </SpotlightCard>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

/* ═══════════════════════ Capability glyphs ═══════════════════════ */

type GlyphKind = "connect" | "model" | "estate" | "approve";

/**
 * Small animated diagrams that stand in for icons. Each one animates once when
 * it scrolls into view and again on hover, via the group-hover class on the card.
 */
function CapabilityGlyph({ kind, reducedMotion }: { kind: GlyphKind; reducedMotion: RM }) {
  const stroke = "rgba(27,26,24,0.22)";
  const accent = "#7c3aed";
  const common = {
    viewBox: "0 0 72 56",
    className: "h-14 w-[72px]",
    fill: "none" as const,
    "aria-hidden": true as const,
  };

  if (kind === "connect") {
    const sources = [10, 28, 46];
    return (
      <svg {...common}>
        {sources.map((y, i) => (
          <g key={y}>
            <rect x="2" y={y - 5} width="18" height="10" rx="3" fill="rgba(27,26,24,0.06)" stroke={stroke} />
            <path d={`M20,${y} C34,${y} 34,28 46,28`} stroke={stroke} strokeWidth="1" />
            {!reducedMotion && (
              <circle r="1.8" fill={accent}>
                <animateMotion dur={`${2.6 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}
                  path={`M20,${y} C34,${y} 34,28 46,28`} />
                <animate attributeName="opacity" values="0;1;1;0" dur={`${2.6 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
              </circle>
            )}
          </g>
        ))}
        <circle cx="56" cy="28" r="11" fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.45)" />
        <circle cx="56" cy="28" r="3.5" fill={accent} />
      </svg>
    );
  }

  if (kind === "model") {
    const bars = [16, 30, 22, 42, 34, 50];
    return (
      <svg {...common}>
        <line x1="4" y1="52" x2="68" y2="52" stroke={stroke} strokeWidth="1" />
        {bars.map((h, i) => (
          <motion.rect
            key={i}
            x={6 + i * 11}
            width="7"
            rx="2"
            fill={i === bars.length - 1 ? accent : "rgba(124,58,237,0.28)"}
            initial={reducedMotion ? false : { height: 0, y: 52 }}
            whileInView={{ height: h, y: 52 - h }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>
    );
  }

  if (kind === "estate") {
    const pins = [
      { x: 16, y: 18 },
      { x: 38, y: 12 },
      { x: 56, y: 24 },
      { x: 26, y: 38 },
      { x: 50, y: 44 },
    ];
    return (
      <svg {...common}>
        <rect x="3" y="5" width="66" height="46" rx="6" fill="rgba(27,26,24,0.04)" stroke={stroke} />
        {pins.map((p, i) => (
          <g key={i}>
            {!reducedMotion && (
              <circle cx={p.x} cy={p.y} r="6" fill="rgba(124,58,237,0.18)">
                <animate attributeName="r" values="3;9;3" dur="3s" repeatCount="indefinite" begin={`${i * 0.45}s`} />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" begin={`${i * 0.45}s`} />
              </circle>
            )}
            <circle cx={p.x} cy={p.y} r="2.6" fill={accent} />
          </g>
        ))}
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M36 6 L54 13 V29 C54 40 46 47 36 50 C26 47 18 40 18 29 V13 Z"
        fill="rgba(124,58,237,0.08)"
        stroke="rgba(124,58,237,0.42)"
      />
      <motion.path
        d="M28 28 L34 34 L45 22"
        stroke={accent}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reducedMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

/* ═══════════════════════ Platform capabilities ═══════════════════════ */

export function CapabilitiesSection({ reducedMotion }: { reducedMotion: RM }) {
  const prefersReduced = usePrefersReducedMotion();
  const rm = reducedMotion || prefersReduced;

  const features: { title: string; desc: string; kind: GlyphKind }[] = [
    {
      kind: "connect",
      title: "Integrates with existing systems",
      desc: "Connects to the POS, payment, inventory and accounting platforms already in use. No new hardware, and no replacement of the tools staff already know.",
    },
    {
      kind: "model",
      title: "Models the business every night",
      desc: "Evaluates thousands of demand scenarios against actual sales history and prepares ordering, pricing and staffing recommendations before trading begins.",
    },
    {
      kind: "estate",
      title: "Consolidates every location",
      desc: "Each site receives its own plan. Results roll up so performance can be compared, standardised and acted on across the whole estate.",
    },
    {
      kind: "approve",
      title: "Holds every action for approval",
      desc: "Price changes, orders and rota adjustments wait for explicit approval, with the reasoning and a complete audit trail attached to each one.",
    },
  ];

  return (
    <Section id="platform" divider>
      <SectionHeader
        eyebrow="Platform"
        title={
          <>
            One integration. <span className="text-gradient-accent">Four operating functions.</span>
          </>
        }
        subtitle="GOLEM connects to the systems a business already runs, models the business overnight, and provides a single place to operate it. Cloud-hosted by default, with private deployment available."
      />

      <Reveal stagger={0.09} className="mx-auto mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <RevealItem key={f.title}>
            <SpotlightCard className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-w-border bg-w-bg-secondary p-6 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-w-border-light hover:shadow-lift">
              <div className="hairline-accent absolute inset-x-0 top-0 h-px opacity-60" />
              <div className="mb-4">
                <CapabilityGlyph kind={f.kind} reducedMotion={rm} />
              </div>
              <h3 className="text-[16px] font-semibold text-w-cream">{f.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-w-text">{f.desc}</p>
            </SpotlightCard>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}

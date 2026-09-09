"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Reveal,
  RevealItem,
  Section,
  SectionHeader,
  SpotlightCard,
  cx,
  type RM,
} from "@/components/site/primitives";

/* ═══════════════════════ Outcomes ═══════════════════════ */

type Metric = {
  label: string;
  value: string;
  sub: string;
  /** Range drawn as a band between `scaleMin` and `scaleMax` on the meter track. */
  lo: number;
  hi: number;
  scaleMin: number;
  scaleMax: number;
  scaleNote: string;
};

const METRICS: Metric[] = [
  {
    label: "Gross margin",
    value: "+3–5 pts",
    sub: "Typical improvement within 90 days",
    lo: 3,
    hi: 5,
    scaleMin: 0,
    scaleMax: 10,
    scaleNote: "0 to 10 pts",
  },
  {
    label: "Waste and overstock",
    value: "Up to 50%",
    sub: "Reduction in spoilage and dead stock",
    lo: 0,
    hi: 50,
    scaleMin: 0,
    scaleMax: 100,
    scaleNote: "0 to 100%",
  },
  {
    label: "Administrative time",
    value: "60–100 hrs",
    sub: "Recovered per month across forecasting and ordering",
    lo: 60,
    hi: 100,
    scaleMin: 0,
    scaleMax: 120,
    scaleNote: "0 to 120 hrs",
  },
  {
    /* Scaled 90-100 rather than 0-100: against a full scale a 3-point band
       collapses to an invisible sliver and reads as a rendering fault. The
       scale is stated beneath the meter so the band is not misread. */
    label: "Forecast accuracy",
    value: "96–99%",
    sub: "Daily demand, measured at line level",
    lo: 96,
    hi: 99,
    scaleMin: 90,
    scaleMax: 100,
    scaleNote: "90 to 100%",
  },
];

/**
 * Range meter. The band shows the reported range rather than a single point, so
 * the mark never claims more precision than the figure has. Track and fill are
 * steps of the same hue.
 */
function RangeMeter({ metric, reducedMotion }: { metric: Metric; reducedMotion: RM }) {
  const span = metric.scaleMax - metric.scaleMin;
  const left = ((metric.lo - metric.scaleMin) / span) * 100;
  const width = ((metric.hi - metric.lo) / span) * 100;

  return (
    <div className="mt-4">
      <div className="h-2 w-full overflow-hidden rounded-full bg-accent/15">
        <motion.div
          className="h-full rounded-full bg-accent"
          style={{ marginLeft: `${left}%` }}
          initial={reducedMotion ? false : { width: 0, opacity: 0 }}
          whileInView={{ width: `${Math.max(width, 4)}%`, opacity: 1 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="mt-1.5 text-[10.5px] text-w-dim">Scale {metric.scaleNote}</p>
    </div>
  );
}

export function ResultsSection({ reducedMotion }: { reducedMotion: RM }) {
  return (
    <Section id="outcomes" divider>
      <SectionHeader
        eyebrow="Outcomes"
        title={
          <>
            Measured outcomes, from a single site{" "}
            <span className="text-gradient-accent">to a multi-location estate.</span>
          </>
        }
        subtitle="Across inventory, pricing, labour and daily operations, GOLEM AI works from actual sales and local conditions rather than industry averages."
      />

      <Reveal stagger={0.08} className="mx-auto mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <RevealItem key={m.label}>
            <SpotlightCard className="group flex h-full flex-col rounded-xl border border-w-border bg-w-bg-secondary p-6 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-w-border-light hover:shadow-lift">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-w-faint">
                {m.label}
              </div>
              <div className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-w-cream">
                {m.value}
              </div>
              <div className="mt-2 flex-1 text-[13px] leading-snug text-w-muted">{m.sub}</div>
              <RangeMeter metric={m} reducedMotion={reducedMotion} />
            </SpotlightCard>
          </RevealItem>
        ))}
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[12px] text-w-faint">
          Figures reflect early deployments and vary by business, sector and data quality.
        </p>
      </Reveal>
    </Section>
  );
}

/* ═══════════════════════ Why now ═══════════════════════ */

export function MarketSection({ reducedMotion }: { reducedMotion: RM }) {
  const why = [
    {
      title: "Point-of-sale data is now accessible",
      desc: "Modern POS and payment platforms expose reliable, real-time APIs. Operating data that was previously locked inside proprietary systems can now be read and acted on.",
    },
    {
      title: "Agents are dependable enough to act",
      desc: "Tool-using AI agents can reason over inconsistent operational data and take bounded actions under human approval, at a cost that is viable for smaller businesses.",
    },
    {
      title: "Margins leave no room for error",
      desc: "Inflation, labour costs and price pressure have compressed margins. The businesses that hold their position will be those that make full use of the data they already generate.",
    },
  ];

  return (
    <Section id="market" divider>
      <SectionHeader
        eyebrow="Why now"
        title={
          <>
            Three shifts have made this <span className="text-gradient-accent">practical</span>.
          </>
        }
        subtitle="Operational AI of this kind was not viable for small and mid-sized businesses until recently. Three developments changed that."
      />

      <Reveal stagger={0.09} className="mx-auto mt-12 grid gap-4 lg:grid-cols-3">
        {why.map((w, i) => (
          <RevealItem key={w.title}>
            <SpotlightCard className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-w-border bg-w-bg-secondary p-6 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-w-border-light hover:shadow-lift">
              <span
                aria-hidden="true"
                className="absolute right-4 top-3 text-[54px] font-semibold leading-none text-w-cream/[0.05] transition-colors duration-500 group-hover:text-accent/10"
              >
                {i + 1}
              </span>
              <h3 className="relative text-[16px] font-semibold text-w-cream">{w.title}</h3>
              <p className="relative mt-2 text-[14px] leading-relaxed text-w-text">{w.desc}</p>
            </SpotlightCard>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}

/* ═══════════════════════ Principles ═══════════════════════ */

export function PillarsSection({ reducedMotion }: { reducedMotion: RM }) {
  const pillars = [
    {
      title: "A different architecture",
      points: [
        "An operating layer above the POS, rather than another reporting dashboard",
        "Models that improve with each deployment while customer data stays isolated",
        "Human approval designed into every workflow, not added afterwards",
      ],
    },
    {
      title: "Grounded in existing operations",
      points: [
        "Works with the systems businesses already own; no new hardware required",
        "Pays back through protected margin and recovered management time",
        "Cloud-hosted by default, with private deployment for regulated or sensitive operations",
      ],
    },
    {
      title: "Designed to scale",
      points: [
        "One integration layer that extends to any POS, sector or region",
        "Operates a single site or a multi-location estate from one place",
        "Supports growth from the first location to a national footprint",
      ],
    },
  ];

  return (
    <Section>
      <SectionHeader
        eyebrow="Principles"
        title={
          <>
            Built to be <span className="text-gradient-accent">trusted</span>.
          </>
        }
        subtitle="The commitments that shape how the platform is designed, deployed and operated."
      />

      <Reveal stagger={0.09} className="mx-auto mt-12 grid gap-4 lg:grid-cols-3">
        {pillars.map((p) => (
          <RevealItem key={p.title}>
            <SpotlightCard className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-w-border bg-w-bg-secondary p-7 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-lift">
              <div className="hairline-accent absolute inset-x-0 top-0 h-px" />
              <h3 className="text-[17px] font-semibold text-w-cream">{p.title}</h3>
              <ul className="mt-4 space-y-3">
                {p.points.map((pt) => (
                  <li
                    key={pt}
                    className="group/item flex items-start gap-3 text-[14px] leading-relaxed text-w-text"
                  >
                    <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15 transition-transform duration-300 group-hover/item:scale-110">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}

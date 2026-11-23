"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eyebrow, Section } from "@/components/ui/Layout";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { EASE } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { PRODUCT } from "@/content/product";

type Metric = (typeof PRODUCT.outcomes.metrics)[number];

/**
 * Range meter. The band shows the reported range rather than a single point,
 * so the mark never claims more precision than the figure has. The scale is
 * stated beneath it so a narrow band is not misread.
 */
function RangeMeter({ metric }: { metric: Metric }) {
  const reduced = usePrefersReducedMotion();
  const span = metric.scaleMax - metric.scaleMin;
  const left = ((metric.lo - metric.scaleMin) / span) * 100;
  const width = Math.max(4, ((metric.hi - metric.lo) / span) * 100);

  return (
    <div aria-hidden="true" className="mt-6">
      <div className="h-2 w-full overflow-hidden rounded-full bg-accent/15">
        <motion.div
          className="h-full rounded-full bg-accent"
          style={{ marginLeft: `${left}%` }}
          initial={reduced ? false : { width: 0 }}
          whileInView={{ width: `${width}%` }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </div>
      <p className="mt-2 text-[11px] leading-none text-faint">Scale {metric.scaleNote}</p>
    </div>
  );
}

/** What early deployments have measured, each figure shown as the range it is. */
export function Outcomes() {
  const { outcomes } = PRODUCT;
  return (
    <Section id="outcomes" pad="default">
      <Reveal>
        <Eyebrow kind="dot">{outcomes.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-[820px] text-balance text-h2 text-ink">{outcomes.h2}</h2>
        <p className="mt-5 max-w-[620px] text-pretty text-para text-muted">{outcomes.sub}</p>
      </Reveal>

      <Reveal stagger={0.08} className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
        {outcomes.metrics.map((m) => (
          <RevealItem key={m.label} className="flex h-full flex-col rounded-card border border-line bg-white p-7">
            <p className="font-mono text-label uppercase text-muted">{m.label}</p>
            <p className="mt-5 whitespace-nowrap text-[34px] font-medium leading-none tracking-[-0.04em] text-ink xl:text-[40px]">{m.value}</p>
            <p className="mt-3 flex-1 text-small text-muted">{m.sub}</p>
            <RangeMeter metric={m} />
          </RevealItem>
        ))}
      </Reveal>

      <p className="mt-6 text-[12px] text-faint">{outcomes.footnote}</p>
    </Section>
  );
}

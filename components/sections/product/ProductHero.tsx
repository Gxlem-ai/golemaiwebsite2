"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { FloatChip, Marked, MockFigure, ResultMark, StatusPill, Window } from "@/components/ui/Mock";
import { cx, EASE } from "@/components/ui/core";
import { usePrefersReducedMotion, useSequence } from "@/components/ui/hooks";
import { PRODUCT } from "@/content/product";

const rise = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* Four decisions, each caused by something in the sentence above them. */
const RULES = [
  { key: "covers", op: "= 720" },
  { key: "order", op: "+= 6 lines" },
  { key: "shift", op: "+= 1 midday" },
  { key: "discount", op: "≤ 12%" },
] as const;

/**
 * Signals in, decisions out: a sentence about Saturday has its signals picked
 * out one by one, and each becomes a line of the plan.
 */
function SignalsMock() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 at rest · 1 to 3 one signal read each · 4 the fourth decision follows
  const { step } = useSequence(ref, [700, 750, 750, 750], { amount: 0.5 });
  const prepared = Math.min(RULES.length, step);

  return (
    <MockFigure
      ref={ref}
      texture="none"
      label="Animation: a description of Saturday (a street market, warm weather, a price test) is read, and four decisions are prepared from it: forecast covers, the order, a shift and a discount limit."
      className="rounded-none"
    >
      <div className="relative pt-5">
        <FloatChip tone="ok" className="absolute left-10 top-0 z-10">
          <span className="tabular-nums">{prepared} decisions prepared</span>
        </FloatChip>
        <Window title="Saturday · signals" brand={false} bodyClassName="px-5 pb-6 pt-5">
          <div className="flex justify-end">
            <StatusPill>High Street</StatusPill>
          </div>
          <p className="mt-2 text-[17px] leading-[1.6] tracking-[-0.01em] text-ink">
            <Marked on={step >= 1}>Street market from 11:00</Marked>, clear and <Marked on={step >= 2}>4°C above seasonal</Marked>, with a{" "}
            <Marked on={step >= 3}>price test running on three lines</Marked>.
          </p>
        </Window>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-2">
        {RULES.map((rule, i) => {
          const on = i < prepared;
          return (
            <li
              key={rule.key}
              className={cx(
                "flex h-[38px] items-center justify-between gap-2 rounded-[10px] border border-line bg-white px-3 font-mono text-[12px] leading-none transition-opacity duration-500 sm:text-[12.5px]",
                on ? "opacity-100" : "opacity-40"
              )}
            >
              <span className="truncate">
                <span className="text-accent">{rule.key}</span> <span className="text-ink">{rule.op}</span>
              </span>
              <ResultMark ok className={cx("transition-all duration-300", on ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
            </li>
          );
        })}
      </ul>
    </MockFigure>
  );
}

/** The Product page hero: what the product is, and a first look at how it thinks. */
export function ProductHero() {
  const reduced = usePrefersReducedMotion();
  const { hero } = PRODUCT;
  return (
    <section className="relative">
      <Container className="grid items-end gap-x-24 gap-y-12 pb-10 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,512px)]">
        <motion.div initial={reduced ? false : "hidden"} animate="visible" transition={{ staggerChildren: 0.08 }} className="lg:pl-10">
          <motion.div variants={rise}>
            <Eyebrow kind="square">{hero.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h1 variants={rise} className="mt-7 max-w-[540px] text-balance text-h2 text-ink">
            {hero.h1}
          </motion.h1>
          <motion.p
            variants={rise}
            className="mt-8 max-w-[512px] border-l-2 border-accent bg-accent-wash/70 px-[18px] py-5 text-[18px] leading-[1.25] tracking-[-0.01em] text-ink"
          >
            {hero.callout}
          </motion.p>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          <SignalsMock />
          <p className="mt-10 text-pretty text-para text-ink-soft">
            {hero.body} <span className="text-accent">{hero.accentSentence}</span>
          </p>
          <div className="mt-8">
            <Button href="#how" size="lg">
              {hero.cta}
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { GolemMark } from "@/components/brand/Logo";
import { Container, Highlight } from "@/components/ui/Layout";
import { FloatChip, MockCursor, MockFigure, MockLabel, ResultMark, StatusPill, Window } from "@/components/ui/Mock";
import { Reveal } from "@/components/ui/Reveal";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { PRODUCT } from "@/content/product";

const ROWS = [
  { label: "Forecast need", value: "84", ok: true },
  { label: "Drafted order", value: "40", ok: false },
  { label: "Stock on hand", value: "12", ok: true },
  { label: "Shortfall", value: "32", ok: false },
  { label: "Margin at risk", value: "£136", ok: false },
] as const;

/**
 * One order checked against the forecast: the rows resolve in turn, the
 * shortfall is priced, and a single press adjusts the order.
 */
function OrderCheck() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 at rest · 1 mismatch flagged · 2 to 6 one row resolved each
  // 7 pointer travels · 8 press · 9 adjusted
  const { step } = useSequence(ref, [600, 500, 420, 420, 420, 420, 700, 900, 260], { amount: 0.3 });
  const resolved = Math.max(0, Math.min(ROWS.length, step - 1));
  const adjusted = step >= 9;

  return (
    <MockFigure
      ref={ref}
      texture="ruled"
      label="Animation: Saturday's bakery order is checked against the forecast. It is 32 loaves short, putting £136 of margin at risk; one press adjusts the order and the risk falls to nothing."
      className="h-full min-h-[600px] w-full !bg-paper-sunk"
    >
      <FloatChip tone="ink" className="absolute left-4 top-[76px] z-20 max-w-[92%] lg:left-[52px] lg:top-[112px]">
        <span className="truncate">Checking Saturday’s order against the forecast</span>
      </FloatChip>

      <div className="absolute bottom-0 left-4 right-4 top-[132px] lg:left-[52px] lg:right-0 lg:top-[172px]">
        <Window
          title="GOLEM · Check CHK_014"
          className="h-full rounded-b-none border-b-0 lg:rounded-tr-none lg:border-r-0"
          bodyClassName="relative px-5 pt-5"
        >
          <MockLabel>CHK_014</MockLabel>
          <p className="mt-2 text-[18px] leading-none tracking-[-0.02em] text-ink">Bakery order · Saturday</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <StatusPill tone={adjusted ? "ok" : "flag"}>{adjusted ? "Adjusted" : "Short"}</StatusPill>
            <StatusPill>Unreviewed</StatusPill>
            <StatusPill tone="flag">Due 11:00</StatusPill>
          </div>

          <div className="mt-4 flex gap-5 border-b border-line text-[12.5px] leading-none text-faint">
            <span className="pb-2.5">Overview</span>
            <span className="pb-2.5">Lines</span>
            <span className="-mb-px border-b-2 border-accent pb-2.5 text-accent">Forecast</span>
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: step >= 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="mt-3 rounded-lg bg-terra-wash px-3 py-2"
          >
            <MockLabel tone="terra">Order_lt_forecast</MockLabel>
            <p className="mt-1 text-[12.5px] leading-tight text-terra-deep">Drafted 40 loaves against a forecast of 84</p>
          </motion.div>

          <dl className="mt-1 divide-y divide-line">
            {ROWS.map((row, i) => {
              const done = i < resolved;
              return (
                <div key={row.label} className="flex h-[40px] items-center justify-between gap-3">
                  <dt className="text-[13px] text-muted">{row.label}</dt>
                  <dd className={cx("flex items-center gap-2.5 text-[13px] font-medium tabular-nums", done && !row.ok ? "text-terra-deep" : "text-ink")}>
                    {done ? row.value : "–"}
                    <ResultMark ok={row.ok} className={cx("transition-all duration-300", done ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
                  </dd>
                </div>
              );
            })}
            <div className="flex h-[40px] items-center justify-between gap-3">
              <dt className="text-[13px] text-muted">After adjustment</dt>
              <dd className={cx("flex items-center gap-2.5 text-[13px] font-medium tabular-nums", adjusted ? "text-ok-deep" : "text-ink")}>
                {adjusted ? "£0" : "–"}
                <ResultMark ok className={cx("transition-all duration-300", adjusted ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
              </dd>
            </div>
          </dl>

          <div className="relative mt-4 inline-block">
            <span
              className={cx(
                "inline-flex h-[30px] items-center gap-1.5 rounded-lg border px-3 text-[12px] font-medium transition-colors duration-300",
                adjusted ? "border-ok bg-ok text-white" : "border-terra/50 bg-white text-terra-deep"
              )}
            >
              {adjusted ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
              {adjusted ? "Adjusted" : "Adjust order"}
            </span>
            <MockCursor x={step >= 7 ? 62 : 190} y={step >= 7 ? 55 : -160} visible={step >= 7 && step <= 9} press={step === 8} />
          </div>
        </Window>
      </div>
    </MockFigure>
  );
}

/** Opening quotation marks, drawn rather than typed so they sit on the grid. */
function QuoteMark() {
  return (
    <svg aria-hidden="true" width="30" height="24" viewBox="0 0 30 24" fill="#7c3aed">
      <path d="M0 24V13.2C0 5.6 4.3 1.1 11.6 0l1.1 3.6C8.9 4.6 6.9 7 6.8 10.6H12V24H0Zm17 0V13.2C17 5.6 21.3 1.1 28.6 0l1.1 3.6c-3.8 1-5.8 3.4-5.9 7H29V24H17Z" />
    </svg>
  );
}

/**
 * The cream panel that states the product's case: the gap it closes, the
 * principle it operates on, and one check running on the right.
 */
export function GapPanel() {
  const { gapPanel } = PRODUCT;
  return (
    <section className="px-3 py-10 sm:px-6 sm:py-14 lg:px-16">
      <div className="mx-auto max-w-[1312px] rounded-[20px] bg-paper-soft">
        <Container className="grid justify-between gap-y-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,496px)_minmax(0,560px)] lg:py-20">
          <Reveal className="lg:pl-10">
            <h2 className="text-balance text-h2 text-ink">{gapPanel.h2}</h2>
            <p className="mt-8 text-pretty text-para text-ink-soft">{gapPanel.body}</p>

            <div className="band mt-10 rounded-[20px] p-7 sm:p-10">
              <QuoteMark />
              <p className="mt-5 text-pretty text-[19px] leading-[1.45] tracking-[-0.01em] text-white sm:text-[21px]">
                <Highlight text={gapPanel.principle} phrase={gapPanel.principleAccent} className="text-accent-lav" />
              </p>
              <div className="mt-7 flex items-center justify-between border-t border-white/15 pt-5">
                <p className="text-[15px] leading-none text-white">{gapPanel.principleLabel}</p>
                <GolemMark size={20} className="text-white/70" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <OrderCheck />
          </Reveal>
        </Container>
      </div>
    </section>
  );
}

"use client";

import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Band } from "@/components/ui/Layout";
import { MockFigure, MockLabel, StatusPill, Window, type PillTone } from "@/components/ui/Mock";
import { Reveal } from "@/components/ui/Reveal";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { ABOUT } from "@/content/about";

/* What the ledger checks for one forecast, and what it found. */
const CHECKS: { title: string; found: string; result: string; tone: PillTone }[] = [
  { title: "Written before the day", found: "Recorded Fri 22:14, ahead of Saturday’s trading", result: "Pass", tone: "ok" },
  { title: "A source on every figure", found: "POS, inventory and rota, each with the time it was read", result: "Pass", tone: "ok" },
  { title: "Held for approval", found: "Approved at 06:02; nothing was sent before that", result: "Pass", tone: "ok" },
  { title: "Outcome beside the forecast", found: "712 covers against a forecast of 720", result: "Pass", tone: "ok" },
  { title: "Misses kept", found: "Sourdough loaf: 61 against 84, left on the record", result: "Kept", tone: "flag" },
];

/**
 * One forecast put through the ledger's five checks. Each row is checked in
 * turn and says what it found; the last one keeps a miss rather than hiding it.
 */
function LedgerChecklist() {
  const ref = useRef<HTMLDivElement>(null);
  // Row i is being checked at step 2i + 1 and resolved from step 2i + 2; the
  // final step closes the record.
  const { step } = useSequence(ref, [500, ...CHECKS.flatMap(() => [650, 250])]);
  const closed = step >= CHECKS.length * 2 + 1;

  return (
    <MockFigure
      ref={ref}
      texture="dusk"
      label="Animation: one forecast passes the ledger's five checks in turn: written before the day, a source on every figure, held for approval, outcome recorded beside the forecast, and misses kept. One miss is kept and nothing is edited."
      className="flex h-full w-full items-center justify-center px-4 py-8"
    >
      <Window chrome={false} className="w-full max-w-[420px] shadow-[0_24px_60px_-24px_rgba(80,40,60,0.45)]">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <MockLabel>Forecast_2211 · Week 47</MockLabel>
          <span className="flex items-center gap-2">
            <span className={cx("h-[6px] w-[6px] rounded-full", closed ? "bg-ok" : "animate-breathe bg-accent")} />
            <MockLabel tone={closed ? "ok" : "accent"}>{closed ? "On the record" : "Checking"}</MockLabel>
          </span>
        </div>

        <ul className="divide-y divide-line">
          {CHECKS.map((check, i) => {
            const checking = step === i * 2 + 1;
            const resolved = step >= i * 2 + 2;
            return (
              <li key={check.title} className={cx("px-4 py-3 transition-colors duration-300", checking && "bg-paper-soft")}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-medium leading-tight text-ink">{check.title}</p>
                  {resolved ? (
                    <StatusPill tone={check.tone}>{check.result}</StatusPill>
                  ) : checking ? (
                    <StatusPill tone="accent">Checking</StatusPill>
                  ) : (
                    <StatusPill>Pending</StatusPill>
                  )}
                </div>
                <AnimatePresence initial={false}>
                  {resolved ? (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden text-[12px] leading-snug text-muted"
                    >
                      <span className="block pt-1.5">{check.found}</span>
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <motion.div
          initial={false}
          animate={{ opacity: closed ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="border-t border-line px-4 py-3"
        >
          <MockLabel tone="accent">1 miss kept · nothing edited</MockLabel>
        </motion.div>
      </Window>
    </MockFigure>
  );
}

/** The dark band on the About page that explains how the ledger keeps GOLEM honest. */
export function AboutLedgerBand() {
  const { ledgerBand } = ABOUT;
  return (
    <Band glow="none" pad="default">
      <div className="grid items-center justify-between gap-y-12 lg:grid-cols-[minmax(0,400px)_minmax(0,660px)]">
        <Reveal>
          <h2 className="text-h3 text-white">{ledgerBand.h2}</h2>
          <div className="mt-6 space-y-6">
            {ledgerBand.paragraphs.map((p) => (
              <p key={p} className="text-pretty text-para text-white/70">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="min-h-[537px]">
            <LedgerChecklist />
          </div>
        </Reveal>
      </div>
    </Band>
  );
}

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CloudSun, Tag } from "lucide-react";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { CountTo, FloatChip, MockFigure, MockLabel, StatusPill, Window } from "@/components/ui/Mock";
import { BASELINE, DAYS, SATURDAY, SIGNALS } from "@/content/demo";

const ICONS = { weather: CloudSun, events: CalendarDays, promotions: Tag } as const;

/* Chart geometry, in viewBox units. */
const W = 376;
const H = 162;
const PAD = { t: 24, r: 10, b: 26, l: 10 };
const Y_MIN = 380;
const Y_MAX = 760;
const SAT = 5;

const xAt = (i: number) => PAD.l + (i / (DAYS.length - 1)) * (W - PAD.l - PAD.r);
const yAt = (v: number) => PAD.t + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.t - PAD.b);

/**
 * Monotone cubic interpolation (Fritsch-Carlson). An ordinary spline overshoots
 * between points, which would draw demand the forecast never predicted.
 */
function monotonePath(values: readonly number[]) {
  const pts = values.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  const n = pts.length;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1].x - pts[i].x;
    slope[i] = (pts[i + 1].y - pts[i].y) / dx[i];
  }
  const m: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) m[i] = 0;
    else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      m[i] = (w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]);
    }
  }
  m[n - 1] = slope[n - 2];
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    d += ` C${(pts[i].x + dx[i] / 3).toFixed(1)},${(pts[i].y + (m[i] * dx[i]) / 3).toFixed(1)} ${(pts[i + 1].x - dx[i] / 3).toFixed(1)},${(pts[i + 1].y - (m[i + 1] * dx[i]) / 3).toFixed(1)} ${pts[i + 1].x.toFixed(1)},${pts[i + 1].y.toFixed(1)}`;
  }
  return d;
}

/** The forecast with the first `count` signals applied. */
const withSignals = (count: number) =>
  BASELINE.map((b, i) => b + SIGNALS.slice(0, count).reduce((sum, s) => sum + s.delta[i], 0));

/**
 * A week's demand forecast. The line begins on the baseline and lifts as each
 * signal is switched on; the Saturday figure climbs with it, so the number and
 * the picture always agree.
 */
export function ForecastMock({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // 0 baseline only · 1 weather · 2 local events · 3 promotions · 4 peak marked
  const { step, reduced } = useSequence(ref, [800, 950, 950, 950]);
  const active = Math.min(SIGNALS.length, step);
  const marked = step >= 4;

  const target = useMemo(() => withSignals(active), [active]);
  const [shown, setShown] = useState<number[]>(target);
  const from = useRef<number[]>(target);

  // Ease the seven values toward the new target so the line morphs, not jumps.
  useEffect(() => {
    if (reduced) {
      from.current = target;
      setShown(target);
      return;
    }
    const start = from.current;
    const controls = animate(0, 1, {
      duration: 0.7,
      ease: EASE,
      onUpdate: (t) => {
        const next = start.map((v, i) => v + (target[i] - v) * t);
        from.current = next;
        setShown(next);
      },
    });
    return () => controls.stop();
  }, [target, reduced]);

  const line = monotonePath(shown);
  const area = `${line} L${xAt(DAYS.length - 1).toFixed(1)},${H - PAD.b} L${xAt(0).toFixed(1)},${H - PAD.b} Z`;

  return (
    <MockFigure
      ref={ref}
      texture="lav"
      label={`Animation: a week's demand forecast. As weather, local events and promotions are switched on, the forecast for Saturday rises from a baseline of ${SATURDAY.baseline} covers to ${SATURDAY.forecast}, ${SATURDAY.upliftPct}% above it.`}
      className={cx("h-full w-full", className)}
    >
      <div className="absolute inset-0 flex flex-col items-center px-4">
        <div className="flex h-full w-full max-w-[408px] flex-col">
          <div className="flex h-[68px] shrink-0 items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={marked ? "done" : "run"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {marked ? (
                  <FloatChip tone="ok">Saturday forecast · {SATURDAY.upliftPct}% above baseline</FloatChip>
                ) : (
                  <FloatChip tone="accent" pulse>
                    Modelling Saturday · 12,000 scenarios
                  </FloatChip>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <Window title="GOLEM · Forecast" className="min-h-0 flex-1 rounded-b-none border-b-0" bodyClassName="px-4 pt-3.5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <MockLabel>Covers · Saturday</MockLabel>
                <CountTo
                  value={target[SAT]}
                  duration={0.7}
                  className="mt-1.5 block text-[28px] font-medium leading-none tracking-[-0.03em] text-ink"
                />
              </div>
              <motion.div initial={false} animate={{ opacity: marked ? 1 : 0, y: marked ? 0 : 4 }} transition={{ duration: 0.35, ease: EASE }}>
                <StatusPill tone="accent">+{SATURDAY.upliftPct}% vs baseline</StatusPill>
              </motion.div>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-auto w-full overflow-visible">
              {[440, 560, 680].map((v) => (
                <line key={v} x1={PAD.l} x2={W - PAD.r} y1={yAt(v)} y2={yAt(v)} stroke="#e7e3dc" strokeWidth="1" />
              ))}
              <path d={area} fill="#7c3aed" opacity="0.08" />
              <path d={monotonePath(BASELINE)} fill="none" stroke="#c75f3d" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
              <path d={line} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

              {/* The Saturday peak: both points, the gap between them, and its size. */}
              <motion.g initial={false} animate={{ opacity: marked ? 1 : 0 }} transition={{ duration: 0.4 }}>
                <line x1={xAt(SAT)} x2={xAt(SAT)} y1={yAt(shown[SAT]) + 5} y2={yAt(BASELINE[SAT]) - 5} stroke="#7c3aed" strokeWidth="1.25" strokeDasharray="2 3" />
                <circle cx={xAt(SAT)} cy={yAt(BASELINE[SAT])} r="3.5" fill="#c75f3d" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx={xAt(SAT)} cy={yAt(shown[SAT])} r="4" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.5" />
                <text x={xAt(SAT)} y={yAt(shown[SAT]) - 10} textAnchor="middle" fontSize="12" fontWeight="500" fill="#1b1a18">
                  +{SATURDAY.upliftCovers} covers
                </text>
              </motion.g>

              {DAYS.map((d, i) => (
                <text key={d} x={xAt(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === DAYS.length - 1 ? "end" : "middle"} fontSize="11.5" fill={marked && i === SAT ? "#1b1a18" : "#928e86"}>
                  {d}
                </text>
              ))}
            </svg>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {SIGNALS.map((signal, i) => {
                const Icon = ICONS[signal.key];
                const on = i < active;
                return (
                  <span
                    key={signal.key}
                    className={cx(
                      "inline-flex h-[26px] items-center gap-1.5 rounded-full border pl-2 pr-1.5 text-[11.5px] leading-none transition-colors duration-500",
                      on ? "border-accent/30 bg-accent-wash text-ink" : "border-line bg-white text-faint"
                    )}
                  >
                    <Icon className={cx("h-3 w-3 transition-colors duration-500", on ? "text-accent" : "text-dim")} strokeWidth={2} />
                    {signal.label}
                    <span className={cx("ml-0.5 flex h-[12px] w-[20px] items-center rounded-full px-[2px] transition-colors duration-500", on ? "bg-accent" : "bg-line-strong")}>
                      <span className={cx("h-2 w-2 rounded-full bg-white transition-transform duration-500 ease-out-expo", on && "translate-x-2")} />
                    </span>
                  </span>
                );
              })}
            </div>

            <motion.div initial={false} animate={{ opacity: marked ? 1 : 0 }} transition={{ duration: 0.4, delay: marked ? 0.2 : 0 }} className="mt-3">
              <MockLabel>Written to the ledger · Fri 22:14</MockLabel>
            </motion.div>
          </Window>
        </div>
      </div>
    </MockFigure>
  );
}

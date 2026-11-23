"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, AnimatePresence, useInView } from "framer-motion";
import { CalendarDays, CloudSun, Table2, Tag } from "lucide-react";
import { Eyebrow, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { cx } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { BASELINE, DAYS, SIGNALS, type SignalKey } from "@/content/demo";
import { PRODUCT } from "@/content/product";

/* ═══════════════════════ Data ═══════════════════════ */

/* The week, the baseline and the three signals come from content/demo.ts, so
   this chart agrees with every other illustration on the site. */
const ICONS = { weather: CloudSun, events: CalendarDays, promotions: Tag } as const;

const Y_MAX = 900;
const TICKS = [0, 200, 400, 600, 800];

/* ═══════════════════════ Geometry ═══════════════════════ */

type Geo = {
  vw: number;
  vh: number;
  pad: { t: number; r: number; b: number; l: number };
  pw: number;
  ph: number;
  /** Narrow layout: no direct end-labels, larger relative type. */
  compact: boolean;
  font: { tick: number; day: number; label: number };
};

function makeGeo(
  vw: number,
  vh: number,
  pad: Geo["pad"],
  compact: boolean,
  font: Geo["font"]
): Geo {
  return { vw, vh, pad, pw: vw - pad.l - pad.r, ph: vh - pad.t - pad.b, compact, font };
}

/**
 * Two geometries rather than one scaled SVG: at phone width a 780-unit viewBox
 * renders 10-unit type at roughly 4px, which is unreadable. The compact box
 * drops the direct end-labels (the legend still carries identity) and reclaims
 * that padding for the plot.
 */
const WIDE_GEO = makeGeo(780, 320, { t: 24, r: 96, b: 40, l: 48 }, false, {
  tick: 10,
  day: 11,
  label: 11,
});
const COMPACT_GEO = makeGeo(400, 300, { t: 18, r: 16, b: 34, l: 34 }, true, {
  tick: 9,
  day: 10,
  label: 10,
});

const xAt = (i: number, g: Geo) => g.pad.l + (i / (DAYS.length - 1)) * g.pw;
const yAt = (v: number, g: Geo) => g.pad.t + g.ph * (1 - v / Y_MAX);

/** True below the `sm` breakpoint. Starts false so server and client agree. */
function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
}

/**
 * Fritsch–Carlson monotone cubic interpolation. A plain cardinal spline
 * overshoots between points, which would draw demand the forecast never
 * predicted; the monotone form cannot invent peaks that are not in the data.
 */
function monotonePath(values: readonly number[], g: Geo): string {
  const pts = values.map((v, i) => ({ x: xAt(i, g), y: yAt(v, g) }));
  const n = pts.length;
  if (n < 2) return "";

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1].x - pts[i].x;
    slope[i] = (pts[i + 1].y - pts[i].y) / dx[i];
  }

  const m: number[] = new Array(n);
  m[0] = slope[0];
  m[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) {
      m[i] = 0;
    } else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      m[i] = (w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]);
    }
  }

  let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const c1x = pts[i].x + dx[i] / 3;
    const c1y = pts[i].y + (m[i] * dx[i]) / 3;
    const c2x = pts[i + 1].x - dx[i] / 3;
    const c2y = pts[i + 1].y - (m[i + 1] * dx[i]) / 3;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${pts[i + 1].x.toFixed(2)},${pts[i + 1].y.toFixed(2)}`;
  }
  return d;
}

/** Closed band between an upper and lower series, used for the confidence wash. */
function bandPath(upper: readonly number[], lower: readonly number[], g: Geo): string {
  const up = monotonePath(upper, g);
  const down = lower
    .map((v, i) => ({ x: xAt(i, g), y: yAt(v, g) }))
    .reverse()
    .map((p) => `L${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  return `${up} ${down} Z`;
}

/**
 * Eases an array of values toward a target whenever the target changes, so the
 * line morphs rather than jumping when a signal is toggled.
 */
function useTweenedSeries(target: number[], reduced: boolean) {
  const [shown, setShown] = useState<number[]>(target);
  const shownRef = useRef<number[]>(target);
  shownRef.current = shown;

  useEffect(() => {
    if (reduced) {
      setShown(target);
      return;
    }
    const from = shownRef.current;
    const controls = animate(0, 1, {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (t) => setShown(from.map((v, i) => v + (target[i] - v) * t)),
    });
    return () => controls.stop();
  }, [target, reduced]);

  return shown;
}

/* ═══════════════════════ Chart ═══════════════════════ */

function ForecastChart({ active, reducedMotion }: { active: Set<SignalKey>; reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hover, setHover] = useState<number | null>(null);
  const compact = useCompact();
  const g = compact ? COMPACT_GEO : WIDE_GEO;

  const target = useMemo(
    () =>
      BASELINE.map((base, i) => {
        let v: number = base;
        for (const s of SIGNALS) if (active.has(s.key)) v += s.delta[i];
        return v;
      }),
    [active]
  );

  const golem = useTweenedSeries(target, reducedMotion);
  const upper = golem.map((v) => Math.min(Y_MAX, v * 1.06));
  const lower = golem.map((v) => v * 0.94);

  const peakIndex = target.indexOf(Math.max(...target));
  const uplift = Math.round(target[peakIndex] - BASELINE[peakIndex]);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * g.vw;
    const i = Math.round(((x - g.pad.l) / g.pw) * (DAYS.length - 1));
    setHover(i >= 0 && i < DAYS.length ? i : null);
  };

  return (
    <div ref={ref} className="viz-root relative">
      <svg
        viewBox={`0 0 ${g.vw} ${g.vh}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label={`Demand forecast for the coming week. The GOLEM forecast peaks at ${Math.round(target[peakIndex])} covers on ${DAYS[peakIndex]}, against a baseline of ${BASELINE[peakIndex]}.`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {/* Gridlines: hairline, solid, recessive */}
        {TICKS.map((t) => (
          <g key={t}>
            <line
              x1={g.pad.l}
              x2={g.pad.l + g.pw}
              y1={yAt(t, g)}
              y2={yAt(t, g)}
              className="viz-grid"
              opacity={t === 0 ? 0.9 : 0.5}
            />
            <text
              x={g.pad.l - 8}
              y={yAt(t, g)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={g.font.tick}
              fill="var(--text-muted)"
            >
              {t.toLocaleString("en-GB")}
            </text>
          </g>
        ))}

        {/* Day labels */}
        {DAYS.map((d, i) => (
          <text
            key={d}
            x={xAt(i, g)}
            y={g.vh - (g.compact ? 12 : 16)}
            textAnchor="middle"
            fontSize={g.font.day}
            fill={hover === i ? "var(--text-secondary)" : "var(--text-muted)"}
            fontWeight={hover === i ? 600 : 400}
          >
            {d}
          </text>
        ))}

        {/* Hover crosshair sits beneath the marks */}
        {hover !== null && (
          <line
            x1={xAt(hover, g)}
            x2={xAt(hover, g)}
            y1={g.pad.t}
            y2={g.pad.t + g.ph}
            stroke="var(--axis)"
            strokeWidth="1"
          />
        )}

        {/* Confidence band: series hue at a low wash, never a saturated block */}
        <motion.path
          d={bandPath(upper, lower, g)}
          fill="var(--series-1)"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: inView || reducedMotion ? 0.1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Baseline series */}
        <motion.path
          d={monotonePath(BASELINE, g)}
          className="viz-line"
          stroke="var(--series-2)"
          strokeDasharray="5 5"
          initial={reducedMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: inView || reducedMotion ? 1 : 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* GOLEM series */}
        <motion.path
          d={monotonePath(golem, g)}
          className="viz-line"
          stroke="var(--series-1)"
          initial={reducedMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: inView || reducedMotion ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* End markers, each with a 2px surface ring */}
        <circle cx={xAt(6, g)} cy={yAt(BASELINE[6], g)} r="4" fill="var(--series-2)" className="viz-dot" />
        <circle cx={xAt(6, g)} cy={yAt(golem[6], g)} r="4.5" fill="var(--series-1)" className="viz-dot" />

        {/* Direct end labels. Identity comes from the dot; the text stays in ink.
            Omitted in the compact box, where there is no room beside the plot. */}
        {!g.compact && (
          <>
            <g>
              <circle cx={g.pad.l + g.pw + 14} cy={yAt(golem[6], g) - 1} r="3.5" fill="var(--series-1)" />
              <text
                x={g.pad.l + g.pw + 22}
                y={yAt(golem[6], g)}
                dominantBaseline="middle"
                fontSize={g.font.label}
                fontWeight="600"
                fill="var(--text-secondary)"
              >
                GOLEM
              </text>
            </g>
            <g>
              <circle cx={g.pad.l + g.pw + 14} cy={yAt(BASELINE[6], g) - 1} r="3.5" fill="var(--series-2)" />
              <text
                x={g.pad.l + g.pw + 22}
                y={yAt(BASELINE[6], g)}
                dominantBaseline="middle"
                fontSize={g.font.label}
                fill="var(--text-secondary)"
              >
                Baseline
              </text>
            </g>
          </>
        )}

        {/* Hover markers */}
        {hover !== null && (
          <>
            <circle cx={xAt(hover, g)} cy={yAt(BASELINE[hover], g)} r="4.5" fill="var(--series-2)" className="viz-dot" />
            <circle cx={xAt(hover, g)} cy={yAt(golem[hover], g)} r="5" fill="var(--series-1)" className="viz-dot" />
          </>
        )}

        {/* Peak callout: the one number the chart is about. A surface-coloured
            halo keeps it legible where it crosses the forecast line. */}
        {uplift > 0 && (
          <motion.g
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <line
              x1={xAt(peakIndex, g)}
              x2={xAt(peakIndex, g)}
              y1={yAt(target[peakIndex], g)}
              y2={yAt(BASELINE[peakIndex], g)}
              stroke="var(--series-1)"
              strokeWidth="1.5"
              strokeDasharray="2 3"
              opacity="0.6"
            />
            <text
              x={xAt(peakIndex, g) - 10}
              y={(yAt(target[peakIndex], g) + yAt(BASELINE[peakIndex], g)) / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={g.font.label}
              fontWeight="600"
              fill="var(--text-secondary)"
              stroke="var(--surface-1)"
              strokeWidth="4"
              paintOrder="stroke"
              strokeLinejoin="round"
            >
              +{uplift} covers
            </text>
          </motion.g>
        )}
      </svg>

      {/* Tooltip, positioned in viewBox percentages so it tracks at any width */}
      <AnimatePresence>
        {hover !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-10 min-w-[150px] -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-white p-2.5 shadow-lift"
            style={{
              left: `${(xAt(hover, g) / g.vw) * 100}%`,
              top: `${(Math.min(yAt(golem[hover], g), yAt(BASELINE[hover], g)) / g.vh) * 100 - 3}%`,
            }}
          >
            <div className="text-[11px] font-semibold text-ink">{DAYS[hover]}</div>
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-muted">
                  <span className="h-1.5 w-3 rounded-full bg-series-1" />
                  GOLEM
                </span>
                <span className="text-[11px] font-semibold tabular-nums text-ink">
                  {Math.round(golem[hover]).toLocaleString("en-GB")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-muted">
                  <span className="h-1.5 w-3 rounded-full bg-series-2" />
                  Baseline
                </span>
                <span className="text-[11px] font-semibold tabular-nums text-ink">
                  {BASELINE[hover].toLocaleString("en-GB")}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════ Table view ═══════════════════════ */

function ForecastTable({ active }: { active: Set<SignalKey> }) {
  const rows = DAYS.map((d, i) => {
    let v: number = BASELINE[i];
    for (const s of SIGNALS) if (active.has(s.key)) v += s.delta[i];
    return { day: d, baseline: BASELINE[i], golem: Math.round(v) };
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left">
        <caption className="sr-only">Forecast covers per day, baseline against the GOLEM forecast</caption>
        <thead>
          <tr className="border-b border-line">
            {["Day", "Baseline", "GOLEM", "Difference"].map((h) => (
              <th
                key={h}
                scope="col"
                className="py-2 pr-4 text-[11px] font-semibold uppercase tracking-wider text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.day} className="border-b border-line/60">
              <th scope="row" className="py-2 pr-4 text-[13px] font-medium text-ink">
                {r.day}
              </th>
              <td className="py-2 pr-4 text-[13px] tabular-nums text-copy">
                {r.baseline.toLocaleString("en-GB")}
              </td>
              <td className="py-2 pr-4 text-[13px] font-semibold tabular-nums text-ink">
                {r.golem.toLocaleString("en-GB")}
              </td>
              <td className="py-2 pr-4 text-[13px] tabular-nums text-copy">
                {r.golem - r.baseline > 0 ? "+" : ""}
                {(r.golem - r.baseline).toLocaleString("en-GB")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════ Section ═══════════════════════ */

export function ForecastDemo() {
  const reduced = usePrefersReducedMotion();
  const { forecastDemo } = PRODUCT;
  const [active, setActive] = useState<Set<SignalKey>>(new Set(["weather", "events", "promotions"]));
  const [showTable, setShowTable] = useState(false);

  const toggle = (key: SignalKey) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <Section id="forecast" pad="default">
      <Reveal className="mx-auto max-w-[760px] text-center">
        <Eyebrow kind="dot">{forecastDemo.eyebrow}</Eyebrow>
        <h2 className="mt-5 text-balance text-h2 text-ink">{forecastDemo.h2}</h2>
        <p className="mx-auto mt-4 max-w-[640px] text-pretty text-para text-muted">{forecastDemo.sub}</p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-[1040px]">
        <div className="overflow-hidden rounded-card border border-line bg-white shadow-window">
          {/* Controls in a single row above the chart */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-label uppercase text-muted">Signals</span>
              {SIGNALS.map((s) => {
                const on = active.has(s.key);
                const Icon = ICONS[s.key];
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => toggle(s.key)}
                    aria-pressed={on}
                    title={s.note}
                    className={cx(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors duration-300",
                      on ? "border-accent/35 bg-accent-wash text-ink" : "border-line bg-white text-muted hover:border-line-strong hover:text-muted"
                    )}
                  >
                    <Icon className={cx("h-3.5 w-3.5 transition-colors", on ? "text-accent" : "text-dim")} aria-hidden="true" />
                    {s.label}
                    <span className={cx("ml-0.5 h-1.5 w-1.5 rounded-full transition-colors", on ? "bg-accent" : "bg-dim")} />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowTable((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12px] text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
              {showTable ? "Chart" : "Table"}
            </button>
          </div>

          {/* Legend: always present for two series */}
          <div className="flex flex-wrap items-center gap-4 px-5 pt-4">
            <span className="inline-flex items-center gap-2 text-[12px] text-copy">
              <span className="h-[2px] w-5 rounded-full bg-series-1" aria-hidden="true" />
              GOLEM forecast
            </span>
            <span className="inline-flex items-center gap-2 text-[12px] text-copy">
              <span
                className="h-[2px] w-5 rounded-full"
                style={{ backgroundImage: "repeating-linear-gradient(90deg,#c75f3d 0 4px,transparent 4px 8px)" }}
                aria-hidden="true"
              />
              Baseline average
            </span>
            <span className="ml-auto hidden text-[11px] text-muted sm:inline">Hover the chart for daily values</span>
          </div>

          <div className="px-3 pb-5 pt-2 sm:px-5">
            {showTable ? (
              <div className="py-2">
                <ForecastTable active={active} />
              </div>
            ) : (
              <ForecastChart active={active} reducedMotion={reduced} />
            )}
          </div>

          {/* Signal notes */}
          <div className="grid gap-px border-t border-line bg-line sm:grid-cols-3">
            {SIGNALS.map((s) => {
              const on = active.has(s.key);
              const Icon = ICONS[s.key];
              return (
                <div key={s.key} className={cx("bg-paper-soft px-5 py-3.5 transition-opacity duration-300", on ? "opacity-100" : "opacity-45")}>
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
                    <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    {s.label}
                  </div>
                  <p className="mt-1 text-[12px] leading-snug text-muted">{s.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-center text-[12px] text-muted">{forecastDemo.footnote}</p>
      </Reveal>
    </Section>
  );
}

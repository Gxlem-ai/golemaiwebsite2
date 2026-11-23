"use client";

import React from "react";
import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { cx } from "@/components/ui/core";
import {
  PinnedScroll,
  RevealProgress,
  RevealWords,
  splitWords,
  wordWindow,
} from "@/components/sections/ScrollReveal";
import { ABOUT } from "@/content/about";

const NAME = ABOUT.name;
const LEGEND = splitWords(NAME.legend);
const RESOLUTION = splitWords(NAME.resolution);

/* The pin is one timeline in two acts. Act one reveals the legend; act two
   replaces it with what the legend means for the company. */
const ACT_ONE = { from: 0.02, to: 0.5 };
const HANDOVER = { out: [0.53, 0.57], in: [0.56, 0.6] } as const;
const ACT_TWO = { from: 0.6, to: 0.94 };

const resolutionAt = (i: number) => wordWindow(i, RESOLUTION.length, ACT_TWO.from, ACT_TWO.to);

/** Scroll progress at which word `x` of the legend begins to arrive (fractions allowed). */
const legendTime = (x: number) => wordWindow(x, LEGEND.length, ACT_ONE.from, ACT_ONE.to).start;

/** Position of a word in the legend, or a proportional fallback if the copy changes. */
const find = (word: string, fallback: number) => {
  const i = LEGEND.indexOf(word);
  return i === -1 ? Math.round(LEGEND.length * fallback) : i;
};

/* The three moments in the text that the stone answers to. */
const EMET = find("emet.", 0.46);
const ERASE = find("Erase", 0.5);
const MET = find("met.", 0.65);
/* The closing sentence of the resolution: "The ledger is how we keep it awake." */
const WAKE = Math.max(0, RESOLUTION.lastIndexOf("The"));

/* Interpolation needs strictly rising inputs; this keeps them so even if the
   wording is edited and two moments end up closer than expected. */
const rising = (xs: number[]) => xs.map((x, i, all) => (i === 0 ? x : Math.max(x, all[i - 1] + 0.0005)));

const wakeStart = resolutionAt(WAKE).start;
const awake = resolutionAt(RESOLUTION.length - 1).end;
const wakeMid = (wakeStart + awake) / 2;

/* Every input range below is in scroll progress. The mark is drawn over the
   seven words before "emet", the stone lives through "Truth", part of the mark
   is wiped as "erase a single letter" arrives, the stone is still by "met",
   and the resolution's closing sentence draws the mark whole again. */
const RANGE = {
  ring: rising([legendTime(EMET - 7), legendTime(EMET - 1), legendTime(ERASE + 1), legendTime(ERASE + 5), wakeStart, awake]),
  point: rising([legendTime(EMET - 2), legendTime(EMET)]),
  life: rising([legendTime(EMET - 1), legendTime(EMET + 1.5), legendTime(ERASE + 2), legendTime(MET), wakeStart, awake]),
  warmth: rising([legendTime(EMET - 7), legendTime(EMET + 1.5), legendTime(ERASE + 2), legendTime(MET), wakeStart, awake]),
  clay: rising([legendTime(EMET - 1), legendTime(EMET + 1.5)]),
  truth: rising([legendTime(EMET - 1), legendTime(EMET + 1.5), legendTime(MET - 2), legendTime(MET + 0.5), wakeMid, awake]),
  dead: rising([legendTime(MET - 1.5), legendTime(MET + 1), wakeStart, wakeMid]),
};

/* How much of the mark is left once part of it has been wiped away. */
const WIPED = 0.55;

const PASSAGE =
  "mx-auto max-w-[1000px] text-balance text-[clamp(1.25rem,2.65vw,2.375rem)] leading-[1.2] tracking-[-0.025em]";

const LEGEND_MARKS = [
  { phrase: "emet. Truth.", tone: "accent" },
  { phrase: "met. Dead.", tone: "terra" },
] as const;

/**
 * The name, told as it scrolls.
 *
 * A stone of clay sits above the text, cold and still. As the legend reaches
 * "one word written on its forehead" a mark is drawn on it (the ring and point
 * of the GOLEM logo) and the stone warms and comes to life. At "erase a single
 * letter" part of the mark is wiped and it stops. The closing line, about the
 * ledger, draws the mark whole and wakes it again.
 */
export function NameLegend() {
  return (
    <PinnedScroll id="name" screens={3.35}>
      {(progress, pinned) => (pinned ? <Pinned progress={progress} /> : <Static progress={progress} />)}
    </PinnedScroll>
  );
}

/* ═══════════════════════ Pinned ═══════════════════════ */

function Pinned({ progress }: { progress: MotionValue<number> }) {
  // The mark: the ring is drawn, partly wiped, and drawn again; the point is
  // set once the ring has closed on it. A stroke of no length still paints
  // its round caps, so the ring is hidden until there is some of it to show.
  const ring = useTransform(progress, RANGE.ring, [0, 1, 1, WIPED, WIPED, 1]);
  const ringOpacity = useTransform(ring, [0, 0.03], [0, 1]);
  const point = useTransform(progress, RANGE.point, [0, 1]);

  // Life: the light in and behind the stone, and the warmth in its clay.
  const life = useTransform(progress, RANGE.life, [0, 1, 1, 0, 0, 1]);
  const lit = useTransform(() => life.get() * ringOpacity.get());
  const saturation = useTransform(progress, RANGE.warmth, [0.28, 1, 1, 0.2, 0.2, 1]);
  const brightness = useTransform(progress, RANGE.warmth, [0.97, 1, 1, 0.95, 0.95, 1]);
  const filter = useMotionTemplate`saturate(${saturation}) brightness(${brightness})`;

  // Awake, it sits a little lighter on the ground.
  const lift = useTransform(life, [0, 1], [0, -5]);
  const shadow = useTransform(life, [0, 1], [1, 0.72]);

  // Captions under the stone: clay, then truth, then dead, then truth again.
  const captionClay = useTransform(progress, RANGE.clay, [1, 0]);
  const captionTruth = useTransform(progress, RANGE.truth, [0, 1, 1, 0, 0, 1]);
  const captionDead = useTransform(progress, RANGE.dead, [0, 1, 1, 0]);

  // Act one hands over to act two.
  const legendOpacity = useTransform(progress, [HANDOVER.out[0], HANDOVER.out[1]], [1, 0]);
  const legendY = useTransform(progress, [HANDOVER.out[0], HANDOVER.out[1]], [0, -14]);
  const resolutionOpacity = useTransform(progress, [HANDOVER.in[0], HANDOVER.in[1]], [0, 1]);

  return (
    <Container className="flex flex-col items-center text-center">
      <Eyebrow kind="dot">{NAME.eyebrow}</Eyebrow>
      <h2 className="mt-4 text-h3 text-ink">{NAME.title}</h2>

      <Stone
        className="mt-6 sm:mt-7"
        motion={{ ring, ringOpacity, point, life, lit, lift, shadow, filter }}
        captions={{ clay: captionClay, truth: captionTruth, dead: captionDead }}
      />

      <div className="mt-7 grid w-full sm:mt-9">
        <motion.div style={{ opacity: legendOpacity, y: legendY }} className="col-start-1 row-start-1">
          <RevealWords
            as="p"
            text={NAME.legend}
            marks={LEGEND_MARKS}
            progress={progress}
            pinned
            from={ACT_ONE.from}
            to={ACT_ONE.to}
            className={PASSAGE}
          />
        </motion.div>
        <motion.div style={{ opacity: resolutionOpacity }} className="col-start-1 row-start-1 flex items-center">
          <RevealWords
            as="p"
            text={NAME.resolution}
            marks={[{ phrase: NAME.resolutionAccent, tone: "accent" }]}
            progress={progress}
            pinned
            from={ACT_TWO.from}
            to={ACT_TWO.to}
            className={PASSAGE}
          />
        </motion.div>
      </div>

      <RevealProgress progress={progress} pinned from={ACT_ONE.from} to={ACT_TWO.to} className="mt-7 sm:mt-9" />
    </Container>
  );
}

/* ═══════════════════════ Static (reduced motion) ═══════════════════════ */

function Static({ progress }: { progress: MotionValue<number> }) {
  return (
    <Container className="flex flex-col items-center text-center">
      <Eyebrow kind="dot">{NAME.eyebrow}</Eyebrow>
      <h2 className="mt-4 text-h3 text-ink">{NAME.title}</h2>
      <Stone className="mt-7" />
      <RevealWords as="p" text={NAME.legend} marks={LEGEND_MARKS} pinned={false} progress={progress} className={cx(PASSAGE, "mt-9")} />
      <RevealWords
        as="p"
        text={NAME.resolution}
        marks={[{ phrase: NAME.resolutionAccent, tone: "accent" }]}
        pinned={false}
        progress={progress}
        className={cx(PASSAGE, "mt-8")}
      />
    </Container>
  );
}

/* ═══════════════════════ The stone ═══════════════════════ */

/* The outline of the stone, as fractions of its box: fuller at the left
   shoulder, sloping away to the right, flatter underneath. */
const OUTLINE = "M.44 0C.72 0 1 .28 1 .56C1 .789 .837 1 .52 1C.177 1 0 .808 0 .6C0 .24 .176 0 .44 0Z";

/* The GOLEM mark: an open ring closing on a single point. */
const RING = "M21.5 7.5 A9 9 0 1 0 21.5 15 H14";
const POINT = { cx: 14, cy: 14, r: 2.3 };
const STROKE = { strokeWidth: 2.4, strokeLinecap: "round" } as const;

/* A carved line is a dark cut with light catching its lower edge. */
const CUT = "rgba(98, 46, 24, 0.46)";
const CATCH = "rgba(255, 255, 255, 0.5)";
const CATCH_OFFSET = "translate(0.28 0.36)";
const VIOLET = "#7c3aed";

type StoneMotion = {
  /** How much of the ring is drawn, 0 to 1. */
  ring: MotionValue<number>;
  ringOpacity: MotionValue<number>;
  point: MotionValue<number>;
  /** 0 when the stone is still, 1 when it is awake. */
  life: MotionValue<number>;
  /** The light in the mark itself. */
  lit: MotionValue<number>;
  lift: MotionValue<number>;
  shadow: MotionValue<number>;
  filter: MotionValue<string>;
};

/**
 * The stone and its mark. Given motion values it is driven by the scroll;
 * given none it is shown whole and awake.
 */
function Stone({
  className = "",
  motion: m,
  captions,
}: {
  className?: string;
  motion?: StoneMotion;
  captions?: { clay: MotionValue<number>; truth: MotionValue<number>; dead: MotionValue<number> };
}) {
  const { states } = NAME;
  const outline = `stone-${React.useId().replace(/:/g, "")}`;
  const drawn = { pathLength: m?.ring ?? 1, opacity: m?.ringOpacity ?? 1 };

  return (
    <div className={cx("flex flex-col items-center", className)}>
      <p className="sr-only">
        A stone of clay, carved with a ring that closes on a single point. As the legend is told the stone warms and
        comes to life, falls still when part of the mark is wiped away, and wakes again when the mark is made whole.
      </p>

      <div aria-hidden="true" className="relative">
        <svg width="0" height="0" className="absolute">
          <clipPath id={outline} clipPathUnits="objectBoundingBox">
            <path d={OUTLINE} />
          </clipPath>
        </svg>

        {/* Life: a violet glow that breathes while the stone is awake. */}
        <motion.div style={{ opacity: m?.life ?? 1 }} className="pointer-events-none absolute -inset-x-16 -inset-y-12">
          <div className="h-full w-full animate-breathe rounded-[50%] bg-[radial-gradient(closest-side,rgba(124,58,237,0.42),rgba(124,58,237,0.14)_55%,transparent)] blur-2xl" />
        </motion.div>

        {/* The shadow it rests on. */}
        <motion.div
          style={{ opacity: m?.shadow ?? 0.72 }}
          className="absolute inset-x-[9%] -bottom-2.5 h-5 rounded-[50%] bg-[rgba(84,42,24,0.42)] blur-[10px]"
        />

        <motion.div
          style={{ filter: m?.filter, y: m?.lift ?? -5, clipPath: `url(#${outline})` }}
          className="tx tx-clay relative h-[clamp(7.5rem,min(15vw,22vh),12rem)] w-[clamp(12rem,min(24vw,35vh),19.5rem)]"
        >
          {/* Form: light from the upper left, shade pooling at the lower right. */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_26%_8%,rgba(255,255,255,0.62),transparent_55%),radial-gradient(110%_95%_at_76%_106%,rgba(98,46,24,0.5),transparent_62%)]" />

          {/* Light from within, once it is awake. */}
          <motion.div
            style={{ opacity: m?.life ?? 1 }}
            className="absolute inset-0 bg-[radial-gradient(closest-side_at_50%_53%,rgba(255,255,255,0.72),rgba(203,176,247,0.4)_46%,transparent_74%)]"
          />

          {/* The mark: carved first, then lit. */}
          <svg
            viewBox="0 0 28 28"
            fill="none"
            className="absolute left-1/2 top-[53%] h-[46%] w-auto -translate-x-1/2 -translate-y-1/2 overflow-visible"
          >
            <g transform={CATCH_OFFSET}>
              <motion.path d={RING} stroke={CATCH} {...STROKE} style={drawn} />
              <motion.circle {...POINT} fill={CATCH} style={{ opacity: m?.point ?? 1 }} />
            </g>
            <motion.path d={RING} stroke={CUT} {...STROKE} style={drawn} />
            <motion.circle {...POINT} fill={CUT} style={{ opacity: m?.point ?? 1 }} />

            <g className="[filter:drop-shadow(0_0_1.6px_rgba(124,58,237,0.55))]">
              <motion.path
                d={RING}
                stroke={VIOLET}
                {...STROKE}
                style={{ pathLength: m?.ring ?? 1, opacity: m?.lit ?? 1 }}
              />
              <motion.circle {...POINT} fill={VIOLET} style={{ opacity: m?.life ?? 1 }} />
            </g>
          </svg>

          {/* A pulse from the point while the stone is awake. */}
          <motion.span
            style={{ opacity: m?.life ?? 1 }}
            className="absolute left-1/2 top-[53%] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 motion-reduce:hidden"
          >
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent/50" />
          </motion.span>
        </motion.div>
      </div>

      {/* Caption: one line, three readings, cross-faded in place. */}
      <div aria-hidden="true" className="relative mt-6 h-4 w-full font-mono text-label uppercase">
        {captions ? (
          <>
            <motion.span style={{ opacity: captions.clay }} className="absolute inset-0 text-faint">
              {states.clay}
            </motion.span>
            <motion.span style={{ opacity: captions.truth }} className="absolute inset-0 text-accent">
              {states.alive}
            </motion.span>
            <motion.span style={{ opacity: captions.dead }} className="absolute inset-0 text-terra-deep">
              {states.stopped}
            </motion.span>
          </>
        ) : (
          <span className="absolute inset-0 text-accent">{states.alive}</span>
        )}
      </div>
    </div>
  );
}

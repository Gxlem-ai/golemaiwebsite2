"use client";

import React from "react";
import { Frank_Ruhl_Libre } from "next/font/google";
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

/* The inscription is the one place the site sets Hebrew, so the face is loaded
   here rather than site-wide. */
const hebrew = Frank_Ruhl_Libre({
  subsets: ["hebrew"],
  weight: ["500"],
  display: "swap",
  variable: "--font-hebrew",
});

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

/* The three moments in the text that the inscription answers to. */
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

/* Every input range below is in scroll progress. The word is written over the
   seven words before "emet", lives through "Truth", loses its first letter as
   "erase a single letter" arrives, is dead by "met", and is rewritten by the
   resolution's closing sentence. */
const RANGE = {
  aleph: rising([legendTime(EMET - 7), legendTime(EMET - 4), legendTime(ERASE + 1), legendTime(ERASE + 5), wakeStart, awake]),
  mem: rising([legendTime(EMET - 5), legendTime(EMET - 2)]),
  tav: rising([legendTime(EMET - 3), legendTime(EMET)]),
  erase: rising([legendTime(ERASE + 1), legendTime(ERASE + 5), wakeStart, awake]),
  life: rising([legendTime(EMET - 1), legendTime(EMET + 1.5), legendTime(ERASE + 2), legendTime(MET), wakeStart, awake]),
  saturation: rising([legendTime(EMET - 7), legendTime(EMET + 1.5), legendTime(ERASE + 2), legendTime(MET), wakeStart, awake]),
  clay: rising([legendTime(EMET - 1), legendTime(EMET + 1.5)]),
  truth: rising([legendTime(EMET - 1), legendTime(EMET + 1.5), legendTime(MET - 2), legendTime(MET + 0.5), wakeMid, awake]),
  dead: rising([legendTime(MET - 1.5), legendTime(MET + 1), wakeStart, wakeMid]),
};

const PASSAGE =
  "mx-auto max-w-[1000px] text-balance text-[clamp(1.25rem,2.65vw,2.375rem)] leading-[1.2] tracking-[-0.025em]";

const LEGEND_MARKS = [
  { phrase: "emet. Truth.", tone: "accent" },
  { phrase: "met. Dead.", tone: "terra" },
] as const;

/**
 * The name, told as it scrolls.
 *
 * A clay tablet sits above the text. As the legend reaches "one word written
 * on its forehead" the word is written, letter by letter, and the tablet comes
 * to life. At "erase a single letter" the first letter goes and it stops. The
 * closing line, about the ledger, writes the letter back.
 */
export function NameLegend() {
  return (
    <PinnedScroll id="name" screens={3.35} className={hebrew.variable}>
      {(progress, pinned) => (pinned ? <Pinned progress={progress} /> : <Static progress={progress} />)}
    </PinnedScroll>
  );
}

/* ═══════════════════════ Pinned ═══════════════════════ */

function Pinned({ progress }: { progress: MotionValue<number> }) {
  // The three letters, in the order they are written.
  const aleph = useTransform(progress, RANGE.aleph, [0, 1, 1, 0.07, 0.07, 1]);
  const mem = useTransform(progress, RANGE.mem, [0, 1]);
  const tav = useTransform(progress, RANGE.tav, [0, 1]);
  const alephBlur = useTransform(progress, RANGE.erase, [0, 4, 4, 0]);
  const alephFilter = useMotionTemplate`blur(${alephBlur}px)`;
  const alephY = useTransform(progress, RANGE.erase, ["0em", "0.05em", "0.05em", "0em"]);

  // Life: the glow behind the tablet, and the colour in its clay.
  const life = useTransform(progress, RANGE.life, [0, 1, 1, 0, 0, 1]);
  const saturation = useTransform(progress, RANGE.saturation, [0.55, 1, 1, 0.3, 0.3, 1]);
  const tabletFilter = useMotionTemplate`saturate(${saturation})`;

  // Captions under the tablet: clay, then truth, then dead, then truth again.
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

      <Tablet
        className="mt-6 sm:mt-7"
        letters={[
          { opacity: aleph, filter: alephFilter, y: alephY },
          { opacity: mem },
          { opacity: tav },
        ]}
        life={life}
        tabletFilter={tabletFilter}
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
      <Tablet className="mt-7" />
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

/* ═══════════════════════ The tablet ═══════════════════════ */

type LetterStyle = { opacity: MotionValue<number>; filter?: MotionValue<string>; y?: MotionValue<string> };

/**
 * The clay tablet and its word. Given motion values it is driven by the
 * scroll; given none it is shown whole and alive.
 */
function Tablet({
  className = "",
  letters,
  life,
  tabletFilter,
  captions,
}: {
  className?: string;
  letters?: [LetterStyle, LetterStyle, LetterStyle];
  life?: MotionValue<number>;
  tabletFilter?: MotionValue<string>;
  captions?: { clay: MotionValue<number>; truth: MotionValue<number>; dead: MotionValue<number> };
}) {
  const { inscription } = NAME;
  return (
    <div className={cx("flex flex-col items-center", className)}>
      <p className="sr-only">
        A clay tablet inscribed with the Hebrew word {inscription.alive.word}, meaning {inscription.alive.meaning}.
        With its first letter erased it reads {inscription.stopped.word}, meaning {inscription.stopped.meaning}.
      </p>

      <div aria-hidden="true" className="relative">
        {/* Life: a violet glow that breathes while the word is whole. */}
        <motion.div style={life ? { opacity: life } : undefined} className="pointer-events-none absolute -inset-x-16 -inset-y-10">
          <div className="h-full w-full animate-breathe rounded-[50%] bg-[radial-gradient(closest-side,rgba(124,58,237,0.42),rgba(124,58,237,0.14)_55%,transparent)] blur-2xl" />
        </motion.div>

        <motion.div
          style={tabletFilter ? { filter: tabletFilter } : undefined}
          className="tx tx-clay relative rounded-[22px] border border-white/50 px-8 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-10px_24px_-12px_rgba(140,70,40,0.35),0_22px_44px_-24px_rgba(120,60,30,0.6)] sm:px-12 sm:py-5"
        >
          <div
            dir="rtl"
            lang="he"
            className="flex items-center justify-center gap-[0.1em] font-hebrew text-[clamp(3.75rem,min(9.5vw,15vh),8.25rem)] font-medium leading-[1.05] text-ink [text-shadow:0_1px_0_rgba(255,255,255,0.55)]"
          >
            {inscription.letters.map((letter, i) => {
              const s = letters?.[i];
              return (
                <motion.span
                  key={letter}
                  style={s ? { opacity: s.opacity, filter: s.filter, y: s.y } : undefined}
                  className="inline-block [will-change:opacity,filter,transform]"
                >
                  {letter}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Caption: one line, three readings, cross-faded in place. */}
      <div aria-hidden="true" className="relative mt-4 h-4 w-full font-mono text-label uppercase">
        {captions ? (
          <>
            <motion.span style={{ opacity: captions.clay }} className="absolute inset-0 text-faint">
              A figure of clay
            </motion.span>
            <motion.span style={{ opacity: captions.truth }} className="absolute inset-0 text-accent">
              {inscription.alive.word} · {inscription.alive.meaning}
            </motion.span>
            <motion.span style={{ opacity: captions.dead }} className="absolute inset-0 text-terra-deep">
              {inscription.stopped.word} · {inscription.stopped.meaning}
            </motion.span>
          </>
        ) : (
          <span className="absolute inset-0 text-accent">
            {inscription.alive.word} · {inscription.alive.meaning}
          </span>
        )}
      </div>
    </div>
  );
}

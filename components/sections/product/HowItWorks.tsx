"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { cx, EASE } from "@/components/ui/core";
import { useMediaQuery, usePrefersReducedMotion } from "@/components/ui/hooks";
import { STAGES } from "@/components/sections/product/how/stages";
import { PRODUCT } from "@/content/product";

/**
 * "How GOLEM works": eight steps in three groups.
 *
 * On a wide screen the section pins to the viewport and the page's scroll
 * walks through the steps: the list on the left opens the current step, the
 * rail beside it fills, and the stage on the right swaps to that step's
 * mock-up. On a narrow screen, and for reduced-motion visitors, nothing pins:
 * every step is laid out in order with its mock-up beneath it.
 */

type FlatStep = { index: number; group: string; title: string; body: string; firstOfGroup: boolean };

const FLAT: FlatStep[] = PRODUCT.how.groups.flatMap((g) =>
  g.steps.map((s, i) => ({ group: g.label, title: s.title, body: s.body, firstOfGroup: i === 0, index: 0 }))
).map((s, index) => ({ ...s, index }));

const COUNT = FLAT.length;
const two = (n: number) => String(n).padStart(2, "0");

/** Scroll distance given to each step while pinned, in viewport heights. */
const SCREENS_PER_STEP = 0.3;

export function HowItWorks() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduced = usePrefersReducedMotion();
  return wide && !reduced ? <Pinned /> : <Stacked />;
}

/* ═══════════════════════ Pinned (desktop) ═══════════════════════ */

function Pinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [fill, setFill] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(COUNT - 1, Math.max(0, Math.floor(p * COUNT))));
  });

  // The rail's filled length runs from its top to the current step's dot.
  // Measured after layout, and again a beat later once the opening paragraph
  // has finished its height animation and the dots have settled.
  const measure = useCallback(() => {
    const dot = dotRefs.current[active];
    const list = listRef.current;
    if (!dot || !list) return;
    const d = dot.getBoundingClientRect();
    const l = list.getBoundingClientRect();
    setFill(d.top + d.height / 2 - l.top);
  }, [active]);

  useLayoutEffect(() => {
    measure();
    const id = setTimeout(measure, 460);
    return () => clearTimeout(id);
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Clicking a step scrolls the page to the middle of that step's range.
  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / COUNT) * range, behavior: "smooth" });
  };

  const Stage = STAGES[active];
  const current = FLAT[active];

  return (
    <section
      ref={sectionRef}
      id="how"
      className="relative"
      style={{ height: `${(1 + COUNT * SCREENS_PER_STEP) * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-[72px]">
        <Container className="grid grid-cols-[minmax(0,1fr)_minmax(0,581px)] items-center gap-x-[72px]">
          {/* Steps */}
          <div className="pl-10">
            <h2 className="text-h2 text-ink">{PRODUCT.how.h2}</h2>

            <div ref={listRef} className="relative mt-8 pl-[26px]">
              <span aria-hidden="true" className="absolute bottom-2 left-[4px] top-1 w-px bg-line-strong" />
              <motion.span
                aria-hidden="true"
                className="absolute left-[4px] top-1 w-px bg-accent"
                initial={false}
                animate={{ height: Math.max(0, fill - 4) }}
                transition={{ duration: 0.5, ease: EASE }}
              />

              <ol>
                {FLAT.map((step) => {
                  const isActive = step.index === active;
                  const isDone = step.index < active;
                  return (
                    <li key={step.title}>
                      {step.firstOfGroup ? (
                        <p
                          className={cx(
                            "font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-muted",
                            step.index === 0 ? "pb-3" : "pb-3 pt-6"
                          )}
                        >
                          {step.group}
                        </p>
                      ) : null}

                      <div className="relative">
                        <span
                          ref={(el) => {
                            dotRefs.current[step.index] = el;
                          }}
                          aria-hidden="true"
                          className={cx(
                            "absolute top-[9px] rounded-full transition-all duration-500 ease-out-expo",
                            isActive
                              ? "-left-[27px] h-[11px] w-[11px] bg-accent"
                              : "-left-[26px] h-[9px] w-[9px] border-[1.5px] bg-paper",
                            !isActive && (isDone ? "border-accent" : "border-line-strong")
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => goTo(step.index)}
                          aria-current={isActive ? "step" : undefined}
                          className={cx(
                            "block w-full py-[5px] text-left text-[17px] leading-[1.3] tracking-[-0.01em] transition-colors duration-500",
                            isActive ? "text-ink" : "text-ink/40 hover:text-ink/70"
                          )}
                        >
                          {step.title}
                        </button>
                        <AnimatePresence initial={false}>
                          {isActive ? (
                            <motion.div
                              key="body"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.42, ease: EASE }}
                              className="overflow-hidden"
                            >
                              <p className="max-w-[420px] pb-2 pt-0.5 text-[15px] leading-[1.5] text-muted">{step.body}</p>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-8 pl-[26px]">
              <Button href="#contact" pill size="lg" arrow>
                {PRODUCT.how.cta}
              </Button>
            </div>
          </div>

          {/* Stage */}
          <div>
            <div className="tx-ruled relative h-[min(708px,calc(100vh-208px))] min-h-[440px] rounded-[20px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.34, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Stage />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center gap-4 font-mono text-[12px] leading-none">
              <span className="tabular-nums text-ink">
                {two(active + 1)} <span className="text-muted">/ {two(COUNT)}</span>
              </span>
              <span className="relative h-px flex-1 bg-line-strong">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-accent"
                  initial={false}
                  animate={{ width: `${((active + 1) / COUNT) * 100}%` }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </span>
              <span className="uppercase tracking-[0.06em] text-muted">{current.group}</span>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ═══════════════════════ Stacked (mobile, reduced motion) ═══════════════════════ */

function Stacked() {
  const groups = useMemo(() => PRODUCT.how.groups, []);
  let n = -1;
  return (
    <section id="how" className="py-16 sm:py-20">
      <Container>
        <h2 className="text-h2 text-ink">{PRODUCT.how.h2}</h2>

        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-muted">{group.label}</p>
              <ol className="mt-5 space-y-10">
                {group.steps.map((step) => {
                  n += 1;
                  const Stage = STAGES[n];
                  return (
                    <li key={step.title} className="grid gap-5 md:grid-cols-2 md:items-center md:gap-10">
                      <div>
                        <p className="font-mono text-[12px] tabular-nums leading-none text-accent">{two(n + 1)}</p>
                        <h3 className="mt-3 text-[20px] font-medium leading-tight tracking-[-0.02em] text-ink">{step.title}</h3>
                        <p className="mt-2.5 max-w-[460px] text-[15px] leading-[1.5] text-muted">{step.body}</p>
                      </div>
                      <div className="tx-ruled relative h-[440px] rounded-card">
                        <Stage />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Button href="#contact" pill size="lg" arrow>
            {PRODUCT.how.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}

"use client";

import React, { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Eyebrow, Section } from "@/components/ui/Layout";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { cx, EASE } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { ABOUT } from "@/content/about";

/**
 * The rules the company holds itself to, set as a list of large statements.
 * Each row opens to a paragraph; one is open at a time.
 */
export function Principles() {
  const { principles } = ABOUT;
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();

  return (
    <Section id="principles" pad="default">
      <Reveal>
        <h2 className="max-w-[560px] text-balance text-[clamp(2.25rem,4vw,3.5rem)] font-normal leading-[1.02] tracking-[-0.035em] text-ink">
          {principles.h2}
        </h2>
      </Reveal>

      <div className="mt-12 sm:mt-14">
        <Eyebrow kind="plain">{principles.eyebrow}</Eyebrow>
        <Reveal as="ul" stagger={0.07} className="mt-4 border-b border-line">
          {principles.items.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${base}-button-${i}`;
            const panelId = `${base}-panel-${i}`;
            return (
              <RevealItem as="li" key={item.title} className="border-t border-line">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
                >
                  <span className="text-[clamp(1.5rem,3.1vw,2.75rem)] font-normal leading-[1.08] tracking-[-0.03em] text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transform-none">
                    {item.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-6">
                    <span className="hidden text-[14px] leading-none text-muted sm:inline">{item.tag}</span>
                    <span
                      className={cx(
                        "flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300",
                        isOpen
                          ? "border-accent bg-accent text-white"
                          : "border-line-strong text-ink group-hover:border-ink group-hover:bg-ink group-hover:text-white group-focus-visible:border-ink group-focus-visible:bg-ink group-focus-visible:text-white"
                      )}
                    >
                      <Plus aria-hidden="true" className={cx("h-4 w-4 transition-transform duration-500 ease-out-expo", isOpen && "rotate-45")} />
                    </span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="font-mono text-label uppercase text-muted sm:hidden">{item.tag}</p>
                      <p className="max-w-[640px] pb-8 pt-2 text-pretty text-lead text-copy sm:pt-0">{item.body}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}

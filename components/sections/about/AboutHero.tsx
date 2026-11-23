"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Highlight } from "@/components/ui/Layout";
import { EASE } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { ABOUT } from "@/content/about";

const rise = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE } },
};

/**
 * The About page hero: a dark panel inset from the page edges, with the
 * problem stated quietly and the company's answer stated plainly.
 */
export function AboutHero() {
  const reduced = usePrefersReducedMotion();
  const { hero } = ABOUT;
  return (
    <section className="px-3 sm:px-6 lg:px-10">
      <div className="band band-glow-tl relative flex min-h-[560px] items-end rounded-[20px] lg:min-h-[min(820px,calc(100vh-148px))]">
        <Container className="py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={reduced ? false : "hidden"}
            animate="visible"
            transition={{ staggerChildren: 0.12 }}
            className="grid items-end gap-x-24 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,510px)]"
          >
            <div className="lg:pl-10">
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}>
                <Eyebrow kind="square" tone="light">
                  {hero.eyebrow}
                </Eyebrow>
              </motion.div>
              <h1 className="mt-8 max-w-[640px] text-balance text-hero sm:mt-10">
                <motion.span variants={rise} className="block text-white/50">
                  {hero.headlineMuted}
                </motion.span>{" "}
                <motion.span variants={rise} className="block text-white">
                  {hero.headlineStrong}
                </motion.span>
              </h1>
            </div>

            <motion.div variants={rise}>
              <p className="text-pretty text-[17px] leading-[1.42] tracking-[-0.01em] text-white sm:text-[18px]">
                <Highlight text={hero.body} phrase={[...hero.bodyAccents]} className="text-accent-lav" />
              </p>
              <div className="mt-9">
                <Button href={hero.cta.href} size="lg">
                  {hero.cta.label}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}

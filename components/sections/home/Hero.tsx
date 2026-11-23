"use client";

import React from "react";
import { motion } from "framer-motion";
import { Console } from "@/components/sections/home/Console";
import { Button, TextLink } from "@/components/ui/Button";
import { Container, Highlight, TwoTone } from "@/components/ui/Layout";
import { FloatChip, textureClass } from "@/components/ui/Mock";
import { cx, EASE } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { HOME } from "@/content/home";

const rise = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * The home page hero: the claim on the left, the product answering questions
 * on the right. It sits above the fold, so it animates on mount, not on scroll.
 */
export function HomeHero() {
  const reduced = usePrefersReducedMotion();
  const { hero } = HOME;

  return (
    <section className="relative">
      <Container className="grid items-center gap-x-16 gap-y-12 pb-7 pt-8 sm:pt-11 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)]">
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="visible"
          transition={{ staggerChildren: 0.07 }}
          className="max-w-[560px]"
        >
          <motion.p
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-wash px-3.5 py-1.5 text-[12.5px] font-medium leading-none text-ink"
          >
            <span aria-hidden="true" className="relative flex h-[7px] w-[7px]">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent" />
              <span className="relative h-[7px] w-[7px] rounded-full bg-accent" />
            </span>
            <span className="sm:hidden">{hero.badgeShort}</span>
            <span className="hidden sm:inline">{hero.badge}</span>
          </motion.p>

          <motion.div variants={rise} className="mt-6">
            <TwoTone as="h1" className="text-h1" lead={hero.h1Lead} rest={hero.h1Muted} />
          </motion.div>

          <motion.p variants={rise} className="mt-6 max-w-[500px] text-pretty text-para text-ink-soft">
            <Highlight text={hero.body} phrase={hero.bodyAccent} />
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="#contact" size="lg">
              {hero.primaryCta}
            </Button>
            <TextLink href="/product">{hero.secondaryCta}</TextLink>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className={cx(
            textureClass("lav"),
            "rounded-card px-4 pb-4 pt-[68px] sm:px-10 sm:pb-10 sm:pt-[84px] lg:h-[596px]"
          )}
        >
          <FloatChip tone="ok" className="absolute left-4 top-[18px] sm:left-10 sm:top-7">
            Connected · 6 systems
          </FloatChip>
          <Console />
        </motion.div>
      </Container>
    </section>
  );
}

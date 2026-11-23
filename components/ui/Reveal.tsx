"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { EASE } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";

type Tag = "div" | "section" | "li" | "ul" | "ol" | "p" | "span";

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Reveals its children once, the first time they scroll into view. Give a
 * parent `stagger` and wrap each child in `RevealItem` to cascade them.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
  stagger,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  stagger?: number;
  as?: Tag;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    const Plain = as as React.ElementType;
    return <Plain className={className}>{children}</Plain>;
  }

  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      variants={
        stagger
          ? { hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }
          : { hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0 } }
      }
      transition={stagger ? undefined : { duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    const Plain = as as React.ElementType;
    return <Plain className={className}>{children}</Plain>;
  }
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag className={className} variants={item} transition={{ duration: 0.7, ease: EASE }}>
      {children}
    </MotionTag>
  );
}

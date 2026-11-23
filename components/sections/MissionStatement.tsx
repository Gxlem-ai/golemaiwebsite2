"use client";

import React from "react";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { PinnedScroll, RevealProgress, RevealWords } from "@/components/sections/ScrollReveal";

/**
 * The mission statement. The section pins for a little over one screen while
 * the sentence comes into focus a word at a time; the closing clause arrives
 * in the accent colour.
 */
export function MissionStatement({
  sentence,
  accent,
  eyebrow = "Our mission",
  id = "mission",
}: {
  sentence: string;
  /** The closing clause, an exact substring at the end of `sentence`. */
  accent: string;
  eyebrow?: string;
  id?: string;
}) {
  return (
    <PinnedScroll id={id}>
      {(progress, pinned) => (
        <Container className="flex flex-col items-center text-center">
          <Eyebrow kind="dot">{eyebrow}</Eyebrow>
          <RevealWords
            text={sentence}
            accent={accent}
            progress={progress}
            pinned={pinned}
            className="mx-auto mt-8 max-w-[1080px] text-balance text-display sm:mt-10"
          />
          <RevealProgress progress={progress} pinned={pinned} className="mt-9 sm:mt-11" />
        </Container>
      )}
    </PinnedScroll>
  );
}

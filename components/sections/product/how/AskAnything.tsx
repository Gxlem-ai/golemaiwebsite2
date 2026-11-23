"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GolemMark } from "@/components/brand/Logo";
import { EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { FloatChip, MockLabel, Window } from "@/components/ui/Mock";
import { Scene } from "@/components/sections/product/how/Scene";

const QUESTION = "What ran out before 14:00 yesterday?";
const ANSWER = "Two lines. Sourdough loaf sold out at 13:10 and oat milk 1L at 13:40, both at High Street.";

/** Types `text` once `active`; shows it whole when `instant`. */
function useTyped(text: string, active: boolean, instant: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    if (instant) {
      setCount(text.length);
      return;
    }
    const id = setInterval(() => setCount((c) => (c >= text.length ? c : c + 1)), 26);
    return () => clearInterval(id);
  }, [text, active, instant]);
  return text.slice(0, count);
}

/** Step 3: a question in plain language, answered from the record with its sources. */
export function AskAnything() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 at rest · 1 question typed · 2 answered · 3 sources shown · 4 done
  const { step, reduced } = useSequence(ref, [500, 1300, 900, 600]);
  const typed = useTyped(QUESTION, step >= 1, reduced || step >= 2);

  return (
    <Scene
      ref={ref}
      label="Animation: the question what ran out before 14:00 yesterday is typed, and answered from the record: two lines, with the point of sale and inventory named as sources."
    >
      <div className="flex h-[34px] justify-center">
        {step >= 4 ? <FloatChip tone="ok">Answered from the record</FloatChip> : null}
      </div>

      <Window title="GOLEM · Ask" bodyClassName="flex min-h-[250px] flex-col px-4 pt-4">
        <p className="ml-auto min-h-[34px] max-w-[86%] rounded-[12px] bg-paper-soft px-3 py-2 text-[13px] leading-snug text-ink">
          {typed || " "}
        </p>

        <motion.div
          initial={false}
          animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 6 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-3.5 flex gap-2.5"
        >
          <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-line text-ink">
            <GolemMark size={12} />
          </span>
          <p className="text-[13px] leading-relaxed text-copy">{ANSWER}</p>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: step >= 3 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="ml-8 mt-3 flex flex-wrap gap-1.5"
        >
          {["POS · read 05:58", "Inventory · read 05:57"].map((s) => (
            <span key={s} className="rounded-full border border-line px-2 py-[5px]">
              <MockLabel>{s}</MockLabel>
            </span>
          ))}
        </motion.div>

        <div className="mt-auto flex items-center gap-2 border-t border-line py-2.5 text-[12px] text-faint">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Ask anything about the business
        </div>
      </Window>
    </Scene>
  );
}

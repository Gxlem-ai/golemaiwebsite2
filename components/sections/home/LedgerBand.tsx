import React from "react";
import { LedgerScanMock } from "@/components/mocks/LedgerScanMock";
import { Band, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { HOME } from "@/content/home";

/**
 * The dark band about the ledger: what it is on the left, and on the right the
 * week's forecasts being checked against what happened.
 */
export function LedgerBand() {
  const { ledgerBand } = HOME;
  return (
    <Band glow="none" pad="default">
      <div className="grid items-center justify-between gap-y-12 lg:grid-cols-[minmax(0,420px)_minmax(0,637px)]">
        <Reveal>
          <Eyebrow kind="plain" tone="lav">
            {ledgerBand.eyebrow}
          </Eyebrow>
          <h2 className="mt-7 text-balance text-[clamp(2rem,3.2vw,2.75rem)] font-medium leading-[1.04] tracking-[-0.03em] text-white">
            {ledgerBand.h2}
          </h2>
          <p className="mt-6 max-w-[410px] text-pretty text-para text-white/70">{ledgerBand.body}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="h-[490px] sm:h-[509px]">
            <LedgerScanMock />
          </div>
        </Reveal>
      </div>
    </Band>
  );
}

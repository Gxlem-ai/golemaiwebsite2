"use client";

import React, { useRef } from "react";
import { Banknote, Boxes, CalendarClock, ReceiptText, Tags, Truck } from "lucide-react";
import { cx } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { FloatChip, MockLabel, StatusPill, Window } from "@/components/ui/Mock";
import { Scene } from "@/components/sections/product/how/Scene";
import { SITES } from "@/content/demo";

const TILES = [
  { label: "Sales", icon: ReceiptText },
  { label: "Stock", icon: Boxes },
  { label: "Prices", icon: Tags },
  { label: "Suppliers", icon: Truck },
  { label: "Rota", icon: CalendarClock },
  { label: "Cash", icon: Banknote },
] as const;

/** Step 2: six kinds of data, normalised into one record for every site. */
export function OperatingRecord() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 at rest · 1 to 6 one source joins each · 7 to 9 one site current each · 10 done
  const { step } = useSequence(ref, [400, 240, 240, 240, 240, 240, 420, 320, 320, 420]);
  const joined = Math.min(TILES.length, step);
  const current = Math.max(0, Math.min(SITES.length, step - TILES.length));

  return (
    <Scene
      ref={ref}
      label="Animation: sales, stock, prices, suppliers, rota and cash data join one operating record, which is then current for all three sites."
    >
      <div className="grid grid-cols-3 gap-2">
        {TILES.map((tile, i) => {
          const on = i < joined;
          return (
            <div
              key={tile.label}
              className={cx(
                "flex h-[42px] items-center gap-2 rounded-[10px] border bg-white px-2.5 text-[11.5px] leading-none transition-colors duration-500",
                on ? "border-accent/40 text-ink" : "border-line text-muted"
              )}
            >
              <tile.icon className={cx("h-3.5 w-3.5 shrink-0 transition-colors duration-500", on ? "text-accent" : "text-faint")} strokeWidth={1.8} />
              <span className="truncate">{tile.label}</span>
            </div>
          );
        })}
      </div>

      {/* The join: three hairlines dropping into the record. */}
      <div className="-my-1.5 flex justify-around px-10">
        {[0, 1, 2].map((i) => (
          <span key={i} className={cx("h-5 w-px transition-colors duration-500", joined > i * 2 + 1 ? "bg-accent/50" : "bg-line-strong")} />
        ))}
      </div>

      <Window title="GOLEM · Operating record" bodyClassName="px-4 pb-3 pt-3.5">
        <MockLabel>One record · three sites</MockLabel>
        <ul className="mt-2 divide-y divide-line">
          {SITES.map((site, i) => (
            <li key={site.id} className="flex h-[40px] items-center justify-between gap-3">
              <span className="text-[13px] leading-none text-ink">
                <span className="mr-2 font-mono text-[11px] text-faint">{site.id}</span>
                {site.name}
              </span>
              {i < current ? (
                <StatusPill tone="ok" icon="check">
                  Current
                </StatusPill>
              ) : (
                <span className="text-[11px] tabular-nums leading-none text-faint">
                  {joined} of {TILES.length} sources
                </span>
              )}
            </li>
          ))}
        </ul>
      </Window>

      <div className="flex h-[34px] justify-center">
        {step >= 10 ? <FloatChip tone="ok">One record, current to 05:58</FloatChip> : null}
      </div>
    </Scene>
  );
}

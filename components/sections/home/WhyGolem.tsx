import React from "react";
import { ImpactChartMock } from "@/components/mocks/why/ImpactChartMock";
import { MorningPlanMock } from "@/components/mocks/why/MorningPlanMock";
import { OrderCheckMock } from "@/components/mocks/why/OrderCheckMock";
import { Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { HOME } from "@/content/home";

const CARD = "tx-ruled relative overflow-hidden rounded-xl border border-line";

function CardText({ title, body, className = "" }: { title: string; body: string; className?: string }) {
  return (
    <div className={className}>
      <h3 className="max-w-[400px] text-balance text-h3 text-ink">{title}</h3>
      <p className="mt-3 max-w-[400px] text-pretty text-para text-ink-soft">{body}</p>
    </div>
  );
}

/**
 * "Why GOLEM?": three reasons, each on a card with its own small animation.
 * Two cards share the first row; the third runs the full width.
 */
export function WhyGolem() {
  const { why } = HOME;
  const [first, second, third] = why.cards;
  return (
    <Section pad="default">
      <Reveal>
        <h2 className="text-center text-h2 text-ink">{why.h2}</h2>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-2">
        <Reveal className={`${CARD} h-[620px] lg:h-[603px]`}>
          <CardText {...first} className="p-6 sm:p-10" />
          <div className="absolute inset-x-0 bottom-0 h-[360px] sm:h-[380px]">
            <OrderCheckMock />
          </div>
        </Reveal>

        <Reveal delay={0.08} className={`${CARD} h-[620px] lg:h-[603px]`}>
          <CardText {...second} className="p-6 sm:p-10" />
          <div className="absolute inset-x-0 bottom-0 h-[380px] sm:h-[400px]">
            <ImpactChartMock />
          </div>
        </Reveal>

        <Reveal className={`${CARD} h-[720px] lg:col-span-2 lg:h-[603px]`}>
          <CardText {...third} className="p-6 sm:p-10 lg:max-w-[390px]" />
          <div className="absolute inset-x-0 bottom-0 h-[470px] lg:inset-y-0 lg:left-[34%] lg:h-auto">
            <MorningPlanMock />
          </div>
        </Reveal>
      </div>

      <p className="mt-5 text-center text-[12px] text-muted">{why.footnote}</p>
    </Section>
  );
}

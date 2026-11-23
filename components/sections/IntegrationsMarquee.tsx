import React from "react";
import { Container } from "@/components/ui/Layout";
import { Marquee } from "@/components/ui/Marquee";
import { INTEGRATIONS } from "@/content/site";

/**
 * The strip of systems GOLEM connects to. Names are set as plain wordmarks;
 * no third-party logos are used.
 */
export function IntegrationsMarquee({ eyebrow = INTEGRATIONS.eyebrow }: { eyebrow?: string }) {
  const names = [...INTEGRATIONS.rowOne, ...INTEGRATIONS.rowTwo];
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <p className="mx-auto max-w-[36ch] text-center font-mono text-label uppercase leading-relaxed text-muted sm:max-w-none">
          {eyebrow}
        </p>
        <ul aria-label="Supported systems" className="sr-only">
          {names.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <div aria-hidden="true" className="mx-auto mt-7 max-w-[1100px]">
          <Marquee
            items={names}
            gapClassName="gap-14 sm:gap-16"
            itemClassName="text-[21px] font-semibold tracking-[-0.035em] text-faint sm:text-[23px]"
          />
        </div>
      </Container>
    </section>
  );
}

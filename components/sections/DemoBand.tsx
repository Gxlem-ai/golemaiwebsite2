import React from "react";
import { Check } from "lucide-react";
import { DemoForm } from "@/components/site/DemoForm";
import { Band, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { DEMO_BAND } from "@/content/site";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

/**
 * The closing band on every page: the case for a demo on the left, the
 * request form on the right. `visual` is the animation shown under the pitch.
 */
export function DemoBand({ visual }: { visual?: React.ReactNode }) {
  return (
    <Band id="contact" glow="bc" pad="loose">
      <div className="grid items-center gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,548px)]">
        <Reveal>
          <h2 className="max-w-[560px] text-balance text-cta text-white">
            {DEMO_BAND.headlineLead} <span className="text-accent-lav">{DEMO_BAND.headlineAccent}</span>
          </h2>
          <p className="mt-6 max-w-[470px] text-para text-white/75">{DEMO_BAND.sub}</p>

          {visual ? <div className="mt-10 max-w-[520px]">{visual}</div> : null}

          <ul className="mt-10 max-w-[520px] space-y-3">
            {DEMO_BAND.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] leading-snug text-white/80">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Check aria-hidden="true" className="h-2.5 w-2.5 text-accent-lav" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="on-light rounded-[20px] bg-white p-6 text-ink shadow-form sm:p-8">
            <Eyebrow kind="dot">30-minute session</Eyebrow>
            <h3 className="mt-3.5 text-[28px] font-medium leading-[1.05] tracking-[-0.03em] text-ink sm:text-[30px]">
              {DEMO_BAND.formTitle}
            </h3>
            <p className="mt-2.5 text-[14.5px] leading-normal text-muted">
              {DEMO_BAND.formSub} Prefer email? Write to{" "}
              <a
                href={CONTACT_MAILTO}
                className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <DemoForm />
          </div>
        </Reveal>
      </div>
    </Band>
  );
}

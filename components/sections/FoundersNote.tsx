import React from "react";
import { GolemMark } from "@/components/brand/Logo";
import { TextLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { cx } from "@/components/ui/core";

/**
 * A note from the founders, set as a letter on a cream panel with the brand's
 * two warm hues glowing faintly in one corner. Used as the closing word on
 * the home page and, at fuller length, on the About page.
 */
export function FoundersNote({
  eyebrow,
  title,
  paragraphs,
  signoff,
  link,
  id = "founders",
  className = "",
}: {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  signoff: string;
  link?: { label: string; href: string };
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cx("px-3 py-16 sm:px-6 sm:py-20 lg:px-10", className)}>
      <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[20px] bg-paper-soft">
        {/* Corner glow: clay and violet, low enough to read as warmth, not colour. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-[520px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(217,119,87,0.30),rgba(217,119,87,0.10)_55%,transparent)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-56 left-40 -z-10 h-[460px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.16),transparent)] blur-2xl"
        />

        <Container className="py-14 sm:py-20 lg:py-24">
          <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
            <Reveal className="flex flex-col">
              <Eyebrow kind="dot">{eyebrow}</Eyebrow>
              <h2 className="mt-6 max-w-[460px] text-balance text-h2 text-ink">{title}</h2>

              <div className="mt-10 hidden items-center gap-3.5 lg:mt-auto lg:flex lg:pt-16">
                <Signature signoff={signoff} />
              </div>
            </Reveal>

            <Reveal stagger={0.09} className="max-w-[560px]">
              {paragraphs.map((p, i) => (
                <RevealItem
                  key={i}
                  as="p"
                  className={cx(
                    "text-pretty",
                    i === 0
                      ? "text-[21px] leading-[1.4] tracking-[-0.015em] text-ink sm:text-[23px]"
                      : "mt-6 text-lead text-copy"
                  )}
                >
                  {p}
                </RevealItem>
              ))}

              <RevealItem className="mt-9 flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
                <div className="flex items-center gap-3.5 lg:hidden">
                  <Signature signoff={signoff} />
                </div>
                {link ? <TextLink href={link.href}>{link.label}</TextLink> : null}
              </RevealItem>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}

function Signature({ signoff }: { signoff: string }) {
  return (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-white text-ink">
        <GolemMark size={22} />
      </span>
      <span className="text-[15px] font-medium leading-tight text-ink">{signoff}</span>
    </>
  );
}

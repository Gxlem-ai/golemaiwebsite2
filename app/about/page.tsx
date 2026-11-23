import type { Metadata } from "next";
import { DecisionLine } from "@/components/mocks/DecisionLine";
import { DemoBand } from "@/components/sections/DemoBand";
import { FoundersNote } from "@/components/sections/FoundersNote";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutLedgerBand } from "@/components/sections/about/LedgerBand";
import { NameLegend } from "@/components/sections/about/NameLegend";
import { Principles } from "@/components/sections/about/Principles";
import { ABOUT } from "@/content/about";

export const metadata: Metadata = {
  title: ABOUT.meta.title,
  description: ABOUT.meta.description,
  alternates: { canonical: "/about" },
  openGraph: { title: `${ABOUT.meta.title} | GOLEM AI`, description: ABOUT.meta.description, url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <NameLegend />
      <AboutLedgerBand />
      <Principles />
      <FoundersNote {...ABOUT.foundersNote} />
      <DemoBand visual={<DecisionLine />} />
    </>
  );
}

"use client";

import React, { useCallback } from "react";
import { usePrefersReducedMotion } from "@/components/site/primitives";
import { Navbar } from "@/components/site/Nav";
import { HeroSection } from "@/components/site/Hero";
import {
  CapabilitiesSection,
  IntegrationsStrip,
  NewWaySection,
  ProofBand,
} from "@/components/site/Platform";
import { LifecycleSection, WorkflowStepsSection } from "@/components/site/HowItWorks";
import {
  MarketSection,
  PillarsSection,
  ResultsSection,
} from "@/components/site/Investor";
import { CTASection, Footer } from "@/components/site/CTA";

export default function MantisAILanding() {
  const reducedMotion = usePrefersReducedMotion();

  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    },
    [reducedMotion]
  );

  return (
    <div className="min-h-screen bg-w-bg text-w-cream">
      <Navbar scrollTo={scrollTo} />
      <main>
        {/* Sell the product */}
        <HeroSection reducedMotion={reducedMotion} scrollTo={scrollTo} />
        <div className="space-y-16 py-6">
          <IntegrationsStrip reducedMotion={reducedMotion} />
          <ProofBand />
        </div>
        <NewWaySection reducedMotion={reducedMotion} />
        <CapabilitiesSection reducedMotion={reducedMotion} />
        <WorkflowStepsSection reducedMotion={reducedMotion} />
        <LifecycleSection reducedMotion={reducedMotion} />
        <ResultsSection />

        {/* Why it works for SMEs */}
        <MarketSection reducedMotion={reducedMotion} />
        <PillarsSection reducedMotion={reducedMotion} />

        {/* Convert */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { DecisionLine } from "@/components/mocks/DecisionLine";
import { DemoBand } from "@/components/sections/DemoBand";
import { IntegrationsMarquee } from "@/components/sections/IntegrationsMarquee";
import { ApprovalsDemo } from "@/components/sections/product/ApprovalsDemo";
import { ForecastDemo } from "@/components/sections/product/ForecastDemo";
import { GapPanel } from "@/components/sections/product/GapPanel";
import { HowItWorks } from "@/components/sections/product/HowItWorks";
import { Outcomes } from "@/components/sections/product/Outcomes";
import { ProductHero } from "@/components/sections/product/ProductHero";
import { PRODUCT } from "@/content/product";

export const metadata: Metadata = {
  title: PRODUCT.meta.title,
  description: PRODUCT.meta.description,
  alternates: { canonical: "/product" },
  openGraph: { title: `${PRODUCT.meta.title} | GOLEM AI`, description: PRODUCT.meta.description, url: "/product" },
};

export default function ProductPage() {
  return (
    <>
      <ProductHero />
      <IntegrationsMarquee />
      <GapPanel />
      <HowItWorks />
      <ForecastDemo />
      <ApprovalsDemo />
      <Outcomes />
      <DemoBand visual={<DecisionLine />} />
    </>
  );
}

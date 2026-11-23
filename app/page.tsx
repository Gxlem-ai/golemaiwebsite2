import { ApprovalMock } from "@/components/mocks/ApprovalMock";
import { ConnectMock } from "@/components/mocks/ConnectMock";
import { DecisionLine } from "@/components/mocks/DecisionLine";
import { ForecastMock } from "@/components/mocks/ForecastMock";
import { SourceTraceMock } from "@/components/mocks/SourceTraceMock";
import { DemoBand } from "@/components/sections/DemoBand";
import { FeatureRow } from "@/components/sections/FeatureRow";
import { FoundersNote } from "@/components/sections/FoundersNote";
import { IntegrationsMarquee } from "@/components/sections/IntegrationsMarquee";
import { MissionStatement } from "@/components/sections/MissionStatement";
import { HomeHero } from "@/components/sections/home/Hero";
import { LedgerBand } from "@/components/sections/home/LedgerBand";
import { PlanBand } from "@/components/sections/home/PlanBand";
import { WhyGolem } from "@/components/sections/home/WhyGolem";
import { Section } from "@/components/ui/Layout";
import { HOME } from "@/content/home";

/**
 * The home page: a claim, then proof, in alternation. Light sections make a
 * claim beside an animated mock-up; dark bands mark the two ideas the product
 * rests on (the daily plan and the ledger); the mission and the founders' note
 * close it.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <IntegrationsMarquee />

      <Section pad="default">
        <div className="space-y-16 lg:space-y-24">
          <FeatureRow flip title={HOME.rowConnect.title} body={HOME.rowConnect.body} media={<ConnectMock />} />
          <FeatureRow title={HOME.rowForecast.title} body={HOME.rowForecast.body} media={<ForecastMock />} />
        </div>
      </Section>

      <PlanBand />

      <Section pad="default">
        <div className="space-y-16 lg:space-y-24">
          <FeatureRow title={HOME.rowApprove.title} body={HOME.rowApprove.body} media={<ApprovalMock />} />
          <FeatureRow flip title={HOME.rowSource.title} body={HOME.rowSource.body} media={<SourceTraceMock />} />
        </div>
      </Section>

      <LedgerBand />
      <WhyGolem />

      <MissionStatement eyebrow={HOME.mission.eyebrow} sentence={HOME.mission.sentence} accent={HOME.mission.accent} />

      <DemoBand visual={<DecisionLine />} />
      <FoundersNote {...HOME.foundersNote} />
    </>
  );
}

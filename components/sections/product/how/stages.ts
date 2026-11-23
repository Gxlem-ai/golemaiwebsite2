import type React from "react";
import { ConnectPos } from "@/components/sections/product/how/ConnectPos";
import { OperatingRecord } from "@/components/sections/product/how/OperatingRecord";
import { AskAnything } from "@/components/sections/product/how/AskAnything";
import { ModelDemand } from "@/components/sections/product/how/ModelDemand";
import { DailyPlan } from "@/components/sections/product/how/DailyPlan";
import { Reasoning } from "@/components/sections/product/how/Reasoning";
import { HoldForApproval } from "@/components/sections/product/how/HoldForApproval";
import { WriteToLedger } from "@/components/sections/product/how/WriteToLedger";

/**
 * One mock-up per step of "How GOLEM works", in step order. The order here
 * must match the order of the steps in content/product.ts.
 */
export const STAGES: React.ComponentType[] = [
  ConnectPos,
  OperatingRecord,
  AskAnything,
  ModelDemand,
  DailyPlan,
  Reasoning,
  HoldForApproval,
  WriteToLedger,
];

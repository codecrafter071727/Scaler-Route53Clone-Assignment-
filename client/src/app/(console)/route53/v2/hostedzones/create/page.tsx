import type { Metadata } from "next";
import { CreateHostedZoneContent } from "@/features/route53";

export const metadata: Metadata = {
  title: "Create hosted zone",
  description: "Create a new public or private Amazon Route 53 hosted zone.",
};

export default function CreateHostedZonePage() {
  return <CreateHostedZoneContent />;
}

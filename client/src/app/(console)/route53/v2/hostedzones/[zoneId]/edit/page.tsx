import type { Metadata } from "next";
import { EditHostedZoneContent } from "@/features/route53/components/edit-hosted-zone-content";

type Props = {
  params: Promise<{ zoneId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zoneId } = await params;
  const id = decodeURIComponent(zoneId);
  return {
    title: `Edit hosted zone ${id}`,
    description: `Edit settings for Amazon Route 53 hosted zone ${id}.`,
  };
}

export default function EditHostedZonePage() {
  return <EditHostedZoneContent />;
}

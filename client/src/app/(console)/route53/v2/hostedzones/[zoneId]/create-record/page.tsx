import type { Metadata } from "next";
import { CreateRecordContent } from "@/features/route53/components/create-record-content";

type Props = {
  params: Promise<{ zoneId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zoneId } = await params;
  const id = decodeURIComponent(zoneId);
  return {
    title: `Create record · ${id}`,
    description: `Create a DNS record set in Route 53 hosted zone ${id}.`,
  };
}

export default function CreateRecordPage() {
  return <CreateRecordContent />;
}

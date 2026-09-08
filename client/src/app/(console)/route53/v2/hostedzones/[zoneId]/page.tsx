import type { Metadata } from "next";
import { Suspense } from "react";
import { HostedZoneDetailContent } from "@/features/route53/components/hosted-zone-detail-content";

type Props = {
  params: Promise<{ zoneId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zoneId } = await params;
  const id = decodeURIComponent(zoneId);
  return {
    title: `Hosted zone ${id}`,
    description: `Manage DNS records and tags for Route 53 hosted zone ${id}.`,
  };
}

export default function HostedZoneDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-w-0 flex-1 overflow-auto bg-background px-6 pb-4 pt-5 text-[14px] text-muted-2">
          Loading hosted zone…
        </main>
      }
    >
      <HostedZoneDetailContent />
    </Suspense>
  );
}

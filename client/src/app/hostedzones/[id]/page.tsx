import { Suspense } from "react";
import { HostedZoneDetailContent } from "@/features/route53/components/hosted-zone-detail-content";

export default function HostedZoneDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-w-0 flex-1 overflow-auto bg-white px-6 pb-4 pt-5 text-[14px] text-[#545b64]">
          Loading hosted zone…
        </main>
      }
    >
      <HostedZoneDetailContent />
    </Suspense>
  );
}

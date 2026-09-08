import type { Metadata } from "next";
import { Suspense } from "react";
import { HostedZonesContent } from "@/features/route53";

export const metadata: Metadata = {
  title: "Hosted zones",
  description:
    "View and manage Amazon Route 53 hosted zones for your AWS account.",
};

export default function HostedZonesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-w-0 flex-1 overflow-auto bg-background px-6 pb-4 pt-5 text-[14px] text-muted-2">
          Loading hosted zones…
        </main>
      }
    >
      <HostedZonesContent />
    </Suspense>
  );
}

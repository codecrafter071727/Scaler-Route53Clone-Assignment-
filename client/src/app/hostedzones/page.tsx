import { ConsoleShell } from "@/features/console";
import { HostedZonesContent } from "@/features/route53";

export default function HostedZonesPage() {
  return (
    <ConsoleShell
      crumbs={[
        { label: "Route 53", href: "/hostedzones" },
        { label: "Hosted zones" },
      ]}
    >
      <HostedZonesContent />
    </ConsoleShell>
  );
}

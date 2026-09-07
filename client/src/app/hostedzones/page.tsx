import { RequireAuth } from "@/features/auth";
import { ConsoleShell } from "@/features/console";
import { HostedZonesContent } from "@/features/route53";

export default function HostedZonesPage() {
  return (
    <RequireAuth>
      <ConsoleShell
        crumbs={[
          { label: "Route 53", href: "/hostedzones" },
          { label: "Hosted zones" },
        ]}
      >
        <HostedZonesContent />
      </ConsoleShell>
    </RequireAuth>
  );
}

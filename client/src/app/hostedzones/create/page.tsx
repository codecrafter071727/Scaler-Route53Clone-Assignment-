import { ConsoleShell } from "@/features/console";
import { CreateHostedZoneContent } from "@/features/route53";

export default function CreateHostedZonePage() {
  return (
    <ConsoleShell
      defaultNavOpen={false}
      showBreadcrumbInfo
      crumbs={[
        { label: "Route 53", href: "/hostedzones" },
        { label: "Hosted zones", href: "/hostedzones" },
        { label: "Create hosted zone" },
      ]}
    >
      <CreateHostedZoneContent />
    </ConsoleShell>
  );
}

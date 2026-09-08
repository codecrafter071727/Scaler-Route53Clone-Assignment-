import { RequireAuth } from "@/features/auth";
import { HostedZonesShell } from "@/features/route53";

export function ConsoleAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <HostedZonesShell>{children}</HostedZonesShell>
    </RequireAuth>
  );
}

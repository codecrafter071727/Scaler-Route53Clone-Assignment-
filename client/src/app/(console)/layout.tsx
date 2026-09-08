import type { Metadata } from "next";
import { ConsoleAppLayout } from "@/features/route53/components/console-app-layout";

export const metadata: Metadata = {
  title: {
    default: "Hosted zones",
    template: "%s | Amazon Route 53",
  },
  description:
    "Amazon Route 53 console — create and manage hosted zones, DNS records, health checks, and routing policies.",
};

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConsoleAppLayout>{children}</ConsoleAppLayout>;
}

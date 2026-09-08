import { ConsoleAppLayout } from "@/features/route53/components/console-app-layout";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConsoleAppLayout>{children}</ConsoleAppLayout>;
}

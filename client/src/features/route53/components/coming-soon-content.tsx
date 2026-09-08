"use client";

import Link from "next/link";
import { routes } from "@/features/route53/lib/routes";

type Props = {
  title: string;
};

export function ComingSoonContent({ title }: Props) {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto bg-background px-3 pt-5 text-[14px] leading-5 text-foreground sm:px-6">
      <h1 className="text-[22px] font-bold leading-7 text-foreground sm:text-[24px] sm:leading-8">
        {title}
      </h1>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
        <p className="text-[18px] font-normal leading-6 text-muted sm:text-[20px]">
          Coming soon
        </p>
        <Link
          href={routes.hostedZones}
          className="text-[14px] font-bold text-aws-blue hover:underline"
        >
          Go to Hosted zones
        </Link>
      </div>
    </main>
  );
}

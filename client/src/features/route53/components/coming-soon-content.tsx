"use client";

type Props = {
  title: string;
};

export function ComingSoonContent({ title }: Props) {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-auto bg-background px-6 py-16 text-center">
      <h1 className="text-[28px] font-bold leading-8 text-foreground sm:text-[32px]">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-[16px] leading-6 text-muted-2">
        Coming soon
      </p>
      <p className="mt-2 max-w-lg text-[14px] leading-5 text-muted">
        This page is not available yet. Check back later for updates.
      </p>
    </main>
  );
}

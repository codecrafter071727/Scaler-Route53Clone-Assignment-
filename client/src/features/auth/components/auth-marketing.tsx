"use client";

import Image from "next/image";

/** Lightsail promo panel — artwork already includes title, CTA, and robot. */
export function AuthMarketing() {
  return (
    <div className="hidden w-[570px] shrink-0 lg:block">
      <a
        href="https://aws.amazon.com/lightsail/"
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden"
      >
        <Image
          src="/auth-marketing.png"
          alt="Amazon Lightsail — Lightsail is the easiest way to get started on AWS"
          width={570}
          height={450}
          className="h-auto w-full object-cover"
          priority
        />
      </a>
    </div>
  );
}

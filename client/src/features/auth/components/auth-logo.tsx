"use client";

import Image from "next/image";

export function AuthLogo() {
  return (
    <a
      href="https://aws.amazon.com/"
      className="inline-flex items-center justify-center"
      aria-label="Amazon Web Services"
    >
      <Image
        src="/aws-smile.png"
        alt="AWS"
        width={200}
        height={38}
        className="h-11 w-auto object-contain sm:h-14"
        priority
      />
    </a>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sign in | AWS Console",
  description: "Sign in to the AWS Console",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}

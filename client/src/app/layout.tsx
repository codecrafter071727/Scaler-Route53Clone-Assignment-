import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hosted zones | Route 53 | AWS Console",
  description: "Amazon Route 53 hosted zones",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full overflow-hidden antialiased">{children}</body>
    </html>
  );
}

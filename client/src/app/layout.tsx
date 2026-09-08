import type { Metadata } from "next";
import { ThemeProvider } from "@/features/theme";
import "./globals.css";

const APP_NAME = "Amazon Route 53";
const APP_DESCRIPTION =
  "Manage DNS hosted zones, record sets, and routing policies in the AWS Management Console.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  applicationName: APP_NAME,
  title: {
    default: `${APP_NAME} | AWS Management Console`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "AWS",
    "Amazon Route 53",
    "DNS",
    "hosted zones",
    "Management Console",
  ],
  authors: [{ name: "Amazon Web Services" }],
  creator: "Amazon Web Services",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: `${APP_NAME} | AWS Management Console`,
    description: APP_DESCRIPTION,
    images: [{ url: "/aws-smile.png", alt: "Amazon Web Services" }],
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} | AWS Management Console`,
    description: APP_DESCRIPTION,
    images: ["/aws-smile.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('aws-console-theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.dataset.theme='dark';}else{document.documentElement.dataset.theme='light';}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full bg-background text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

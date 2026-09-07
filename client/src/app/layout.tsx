import type { Metadata } from "next";
import { ThemeProvider } from "@/features/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sign in | AWS Console",
  description: "Sign in to the AWS Console",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('aws-console-theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.dataset.theme='dark';}else{document.documentElement.dataset.theme='light';}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

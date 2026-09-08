import type { Metadata } from "next";
import { AuthPage } from "@/features/auth/components/auth-page";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to the AWS Management Console to manage Route 53 hosted zones and DNS records.",
};

export default function HomePage() {
  return <AuthPage />;
}

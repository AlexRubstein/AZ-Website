import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthExperienceShell } from "@/components/auth/AuthExperienceShell";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Arizona Alpine Trail account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/account" } = await searchParams;

  return (
    <AuthExperienceShell
      title="Log in"
    >
      <AuthForm mode="sign-in" nextPath={next} />
    </AuthExperienceShell>
  );
}

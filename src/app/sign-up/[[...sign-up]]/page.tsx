import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthExperienceShell } from "@/components/auth/AuthExperienceShell";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an Arizona Alpine Trail account for protected route file downloads.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/account" } = await searchParams;

  return (
    <AuthExperienceShell
      title="Register"
    >
      <AuthForm mode="sign-up" nextPath={next} />
    </AuthExperienceShell>
  );
}

import { AuthForm } from "@/components/auth/AuthForm";
import { AuthExperienceShell } from "@/components/auth/AuthExperienceShell";

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

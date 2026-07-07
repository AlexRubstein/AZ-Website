import { AuthForm } from "@/components/auth/AuthForm";
import { AuthExperienceShell } from "@/components/auth/AuthExperienceShell";

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

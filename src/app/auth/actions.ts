"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

export type AuthFormState = {
  status: "idle" | "error" | "success";
  message: string;
};

const idleState: AuthFormState = { status: "idle", message: "" };

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function safeNextPath(formData: FormData) {
  const next = stringValue(formData, "next");

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/account";
  }

  return next;
}

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    return "Password must include uppercase and lowercase letters.";
  }

  if (!/\d/.test(password)) {
    return "Password must include at least one number.";
  }

  return null;
}

export async function signUpAction(
  _previousState: AuthFormState = idleState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;

  const firstName = stringValue(formData, "firstName");
  const lastName = stringValue(formData, "lastName");
  const zipCode = stringValue(formData, "zipCode");
  const email = stringValue(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData);
  const passwordError = validatePassword(password);

  if (!firstName || !lastName || !zipCode || !email || !password) {
    return { status: "error", message: "Complete all fields to register." };
  }

  if (!/^\d{5}(?:-\d{4})?$/.test(zipCode)) {
    return { status: "error", message: "Enter a valid ZIP code." };
  }

  if (passwordError) {
    return { status: "error", message: passwordError };
  }

  const supabase = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  if (!supabase) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add the project URL and anon key.",
    };
  }

  if (!adminClient) {
    return {
      status: "error",
      message: "Supabase service role key is not configured yet.",
    };
  }

  const profileData = {
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`,
    zip_code: zipCode,
  };
  const { error: createUserError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: profileData,
  });

  if (createUserError) {
    if (/already|registered|exists/i.test(createUserError.message)) {
      return {
        status: "error",
        message: "An account already exists for this email. Log in instead.",
      };
    }

    return { status: "error", message: createUserError.message };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { status: "error", message: signInError.message };
  }

  redirect(next);
}

export async function signInAction(
  _previousState: AuthFormState = idleState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;

  const email = stringValue(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData);

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add the project URL and anon key.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: error.message };
  }

  redirect(next);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}

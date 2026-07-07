"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
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

function normalizeSiteOrigin(value: string | null | undefined) {
  const rawValue = value?.trim();

  if (!rawValue) {
    return null;
  }

  const withProtocol =
    rawValue.startsWith("http://") || rawValue.startsWith("https://")
      ? rawValue
      : rawValue.startsWith("localhost") || rawValue.startsWith("127.0.0.1")
        ? `http://${rawValue}`
        : `https://${rawValue}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

async function getSiteOrigin() {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const forwardedProto = requestHeaders.get("x-forwarded-proto") ?? "https";
  const forwardedOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : null;

  return (
    normalizeSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeSiteOrigin(process.env.SITE_URL) ??
    normalizeSiteOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeSiteOrigin(process.env.NEXT_PUBLIC_VERCEL_URL) ??
    normalizeSiteOrigin(process.env.VERCEL_URL) ??
    normalizeSiteOrigin(forwardedOrigin) ??
    normalizeSiteOrigin(requestHeaders.get("origin")) ??
    "http://localhost:3000"
  );
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

  if (!supabase) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add the project URL and anon key.",
    };
  }

  const origin = await getSiteOrigin();
  const confirmationUrl = new URL("/auth/callback", origin);
  confirmationUrl.searchParams.set("next", next);
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: confirmationUrl.toString(),
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        zip_code: zipCode,
      },
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    message: "Check your email to confirm your account, then log in.",
  };
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

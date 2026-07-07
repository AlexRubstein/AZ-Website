"use server";

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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
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

  if (!data.session) {
    return {
      status: "error",
      message:
        "Email confirmation is still enabled in Supabase. Turn off Confirm email, then register again.",
    };
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

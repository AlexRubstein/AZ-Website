"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import {
  DOWNLOAD_TERMS_VERSION,
  getActiveDownloadBySlug,
} from "@/lib/downloads";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

function safeSlug(formData: FormData) {
  return String(formData.get("slug") ?? "").trim();
}

export async function agreeToDownloadTerms(formData: FormData) {
  const slug = safeSlug(formData);
  const supabase = await createSupabaseServerClient();

  if (!supabase || !slug) {
    redirect("/sign-up");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-up?next=${encodeURIComponent(`/downloads/${slug}`)}`);
  }

  const download = await getActiveDownloadBySlug(slug);

  if (!download) {
    redirect("/resources");
  }

  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  const token = randomUUID();
  const { error } = await adminClient.from("download_acceptances").insert({
    user_id: user.id,
    download_file_id: download.id,
    download_slug: download.slug,
    terms_version: DOWNLOAD_TERMS_VERSION,
    access_token: token,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/downloads/${download.slug}/thanks?token=${encodeURIComponent(token)}`);
}

"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/supabase/config";

let browserClient: SupabaseClient | null | undefined;

export function createSupabaseBrowserClient() {
  if (browserClient !== undefined) {
    return browserClient;
  }

  const config = getSupabaseConfig();

  if (!config) {
    browserClient = null;
    return browserClient;
  }

  browserClient = createBrowserClient(config.url, config.anonKey);
  return browserClient;
}

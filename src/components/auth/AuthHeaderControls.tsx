"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { signOutAction } from "@/app/auth/actions";
import { openAuthModal } from "@/components/auth/AuthModal";
import { createSupabaseBrowserClient } from "@/supabase/client";

export function AuthHeaderControls({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);

  const openAuth = (mode: "sign-in" | "sign-up") => {
    onNavigate?.();
    openAuthModal(mode, "/account");
  };

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (compact) {
    return (
      <div className="mt-1 grid gap-1 border-t border-white/12 pt-2 sm:hidden">
        {user ? (
          <>
            <Link
              href="/account"
              onClick={onNavigate}
              className="min-h-11 rounded-[6px] px-3 py-3 text-sm font-semibold text-white/76 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Account
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="min-h-11 w-full rounded-[6px] px-3 py-3 text-left text-sm font-semibold text-white/76 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => openAuth("sign-in")}
              className="min-h-11 rounded-[6px] px-3 py-3 text-sm font-semibold text-white/76 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => openAuth("sign-up")}
              className="min-h-11 rounded-[6px] bg-white px-3 py-3 text-sm font-black text-[#13221a] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Register
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      {user ? (
        <>
          <Link
            href="/account"
            className="min-h-11 rounded-full px-3 text-sm font-semibold leading-[44px] text-white/78 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Account
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="min-h-11 rounded-full border border-white/16 bg-white/10 px-4 text-sm font-black text-white transition hover:border-white/28 hover:bg-white hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Log out
            </button>
          </form>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => openAuth("sign-in")}
            className="min-h-11 rounded-full px-3 text-sm font-semibold leading-[44px] text-white/78 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => openAuth("sign-up")}
            className="min-h-11 rounded-full border border-white/16 bg-white/10 px-4 text-sm font-black leading-[44px] text-white transition hover:border-white/28 hover:bg-white hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Register
          </button>
        </>
      )}
    </div>
  );
}

"use client";

import { Flame, X } from "lucide-react";
import type { FireAlertIncident } from "@/components/FireAlertBannerView";

/**
 * Top Alert Band treatment (concept #1 of 3 explored for this feature): a full-width
 * strip fixed above the header nav row, unmissable on every page. Trade-off vs the
 * Header-Integrated Badge: it adds persistent vertical space site-wide, so any page
 * with fixed hero/header-height assumptions needs its top padding to account for it.
 * Kept swappable — see FireAlertBanner.tsx.
 */
export function FireAlertTopBandView({
  incidents,
  onDismiss,
}: {
  incidents: FireAlertIncident[];
  onDismiss: () => void;
}) {
  if (incidents.length === 0) {
    return null;
  }

  const closest = incidents[0];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-11 w-full items-center justify-between gap-3 bg-gradient-to-r from-[#b74f32] to-[#b87939] px-5 py-2 text-white sm:px-8"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Flame size={16} aria-hidden="true" className="shrink-0" />
        <p className="min-w-0 truncate text-xs font-medium leading-snug sm:text-sm">
          <span className="font-mono font-black uppercase tracking-[0.12em]">Active Fire Advisory</span>
          <span className="mx-1.5 opacity-60">—</span>
          <span className="font-semibold">{closest.name ?? "Unconfirmed hotspot"}</span>
          <span className="opacity-85"> — {closest.distanceMiles} mi from the trail</span>
          {incidents.length > 1 ? (
            <span className="opacity-85"> ({incidents.length - 1} more nearby)</span>
          ) : null}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <a
          href="https://inciweb.wildfire.gov/"
          target="_blank"
          rel="noreferrer"
          className="hidden font-mono text-[11px] font-black uppercase tracking-[0.12em] underline underline-offset-2 sm:inline"
        >
          Details
        </a>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss fire advisory"
          className="grid size-9 shrink-0 place-items-center rounded-full text-white/85 transition hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

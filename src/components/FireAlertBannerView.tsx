"use client";

import { useState } from "react";
import { Flame, X } from "lucide-react";

export type FireAlertIncident = {
  id: string;
  name: string | null;
  distanceMiles: number;
  discoveredAt: string | null;
};

/**
 * Header-Integrated Badge treatment (concept #2 of 3 explored for this feature):
 * a compact pill next to the header nav that expands into a detail panel on tap,
 * rather than a full-width band. Kept deliberately swappable — see FireAlertBanner.tsx.
 */
export function FireAlertBannerView({
  incidents,
  onDismiss,
}: {
  incidents: FireAlertIncident[];
  onDismiss: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (incidents.length === 0) {
    return null;
  }

  const closest = incidents[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#b74f32]/70 bg-gradient-to-b from-[#c96a4a] to-[#b74f32] px-4 font-mono text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[0_6px_18px_rgba(183,79,50,0.45)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(183,79,50,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Flame size={14} aria-hidden="true" />
        {incidents.length > 1 ? `${incidents.length} Active` : "Fire Advisory"}
      </button>

      {expanded ? (
        <div
          role="status"
          aria-live="polite"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 rounded-[8px] border border-[#b74f32]/30 bg-[#fffdf7] p-4 text-[#13221a] shadow-[0_16px_40px_rgba(0,0,0,0.24)]"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.12em] text-[#b74f32]">
              Active Fire Advisory
            </p>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss fire advisory"
              className="grid size-6 shrink-0 place-items-center rounded-full text-[#5f6c63] transition hover:bg-[#d8ded4] hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {incidents.map((incident) => (
              <li key={incident.id} className="text-sm leading-snug">
                <span className="font-semibold">{incident.name ?? "Unconfirmed hotspot"}</span>
                <span className="text-[#5f6c63]"> — {incident.distanceMiles} mi from the trail</span>
              </li>
            ))}
          </ul>
          <a
            href="https://inciweb.wildfire.gov/"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block font-mono text-[11px] font-black uppercase tracking-[0.12em] text-[#b74f32] underline underline-offset-2"
          >
            Details on InciWeb
          </a>
        </div>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {closest ? `Active fire advisory: ${closest.name ?? "unconfirmed hotspot"}, ${closest.distanceMiles} miles from the trail.` : ""}
      </span>
    </div>
  );
}

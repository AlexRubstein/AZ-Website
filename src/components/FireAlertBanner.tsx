"use client";

import { useEffect, useState } from "react";
import { FireAlertBannerView, type FireAlertIncident } from "@/components/FireAlertBannerView";
import { FireAlertTopBandView } from "@/components/FireAlertTopBandView";
import { FireAlertThinStripView } from "@/components/FireAlertThinStripView";

const POLL_INTERVAL_MS = 5 * 60 * 1000;
const DISMISS_STORAGE_KEY = "azat-fire-alert-dismissed";

type FireAlertsApiResponse = {
  active: boolean;
  incidents: FireAlertIncident[];
};

function signatureFor(incidents: FireAlertIncident[]): string {
  return incidents
    .map((incident) => incident.id)
    .sort()
    .join(",");
}

function readDismissedSignature(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(DISMISS_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function FireAlertBanner({ variant = "badge" }: { variant?: "badge" | "topBand" | "thinStrip" }) {
  const [incidents, setIncidents] = useState<FireAlertIncident[]>([]);
  const [dismissedSignature, setDismissedSignature] = useState<string | null>(
    readDismissedSignature
  );

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch("/api/fire-alerts");
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as FireAlertsApiResponse;
        if (!cancelled) {
          setIncidents(data.incidents ?? []);
        }
      } catch {
        // Fire advisory is an enhancement, not critical UI — fail silently and retry next interval.
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const currentSignature = signatureFor(incidents);

  if (incidents.length === 0 || currentSignature === dismissedSignature) {
    return null;
  }

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_STORAGE_KEY, currentSignature);
    } catch {
      // Ignore storage failures; dismissal just won't persist across reloads.
    }
    setDismissedSignature(currentSignature);
  };

  if (variant === "thinStrip") {
    return <FireAlertThinStripView incidents={incidents} />;
  }

  if (variant === "topBand") {
    return <FireAlertTopBandView incidents={incidents} onDismiss={handleDismiss} />;
  }

  return <FireAlertBannerView incidents={incidents} onDismiss={handleDismiss} />;
}

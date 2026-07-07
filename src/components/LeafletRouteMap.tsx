"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";

import type { HomeTrailHighlight } from "@/lib/home";
import { routePreviewBounds, routePreviewPins, routePreviewSegments } from "@/lib/route-preview-data";

export type LeafletRouteMapProps = {
  highlights?: HomeTrailHighlight[];
  activeHighlightId?: string;
  activeFlyTo?: boolean;
  openActivePopup?: boolean;
  onHighlightSelect?: (id: string) => void;
};

function getHighlightId(highlight: HomeTrailHighlight, index: number) {
  return highlight._key || `${highlight.title}-${index}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character] || character;
  });
}

function drawTrailOverlay(
  leaflet: typeof Leaflet,
  overlay: Leaflet.LayerGroup,
  highlights: HomeTrailHighlight[],
  markerRefs: Map<string, Leaflet.CircleMarker>,
  onHighlightSelect?: (id: string) => void,
) {
  overlay.clearLayers();
  markerRefs.clear();

  routePreviewSegments.forEach((segment) => {
    const positions = segment.map(([lat, lng]) => [lat, lng] as [number, number]);
    leaflet.polyline(positions, { color: "#13221a", weight: 9, opacity: 0.35 }).addTo(overlay);
  });
  routePreviewSegments.forEach((segment) => {
    const positions = segment.map(([lat, lng]) => [lat, lng] as [number, number]);
    leaflet.polyline(positions, { color: "#b87939", weight: 5, opacity: 0.98 }).addTo(overlay);
  });
  routePreviewSegments.forEach((segment) => {
    const positions = segment.map(([lat, lng]) => [lat, lng] as [number, number]);
    leaflet.polyline(positions, { color: "#fff2cf", weight: 1.5, opacity: 0.85, dashArray: "2 12" }).addTo(overlay);
  });

  routePreviewPins.forEach((pin) => {
    leaflet
      .circleMarker([pin.lat, pin.lng], {
        radius: 6,
        color: "#173d2b",
        fillColor: "#fffdf7",
        fillOpacity: 1,
        weight: 2,
      })
      .bindPopup(`<strong>${escapeHtml(pin.label)}</strong>`)
      .addTo(overlay);
  });

  highlights.forEach((highlight, index) => {
    if (!highlight.coordinates) return;
    const id = getHighlightId(highlight, index);
    const marker = leaflet
      .circleMarker([highlight.coordinates.lat, highlight.coordinates.lng], {
        radius: 9,
        color: "#fffdf7",
        fillColor: "#e11f3f",
        fillOpacity: 0.96,
        opacity: 1,
        weight: 3,
      })
      .bindPopup(
        `<strong>${escapeHtml(highlight.title)}</strong>${
          highlight.category ? `<br><span>${escapeHtml(highlight.category)}</span>` : ""
        }`,
      )
      .on("click", () => onHighlightSelect?.(id))
      .addTo(overlay);

    markerRefs.set(id, marker);
  });
}

function updateHighlightMarkerStyles(markerRefs: Map<string, Leaflet.CircleMarker>, activeHighlightId?: string) {
  let activeMarker: Leaflet.CircleMarker | undefined;

  markerRefs.forEach((marker, id) => {
    const isActive = id === activeHighlightId;
    marker.setRadius(isActive ? 12 : 9);
    marker.setStyle({
      color: isActive ? "#13221a" : "#fffdf7",
      fillColor: "#e11f3f",
      fillOpacity: isActive ? 1 : 0.96,
      opacity: 1,
      weight: isActive ? 5 : 3,
    });
    if (isActive) activeMarker = marker;
  });

  activeMarker?.bringToFront();
}

export function LeafletRouteMap({
  highlights = [],
  activeHighlightId,
  activeFlyTo = true,
  openActivePopup = true,
  onHighlightSelect,
}: LeafletRouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const overlayRef = useRef<Leaflet.LayerGroup | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const markerRefs = useRef<Map<string, Leaflet.CircleMarker>>(new Map());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    const markerMap = markerRefs.current;

    async function mountMap() {
      if (!container || mapRef.current) return;
      const leaflet = await import("leaflet");
      if (cancelled || !container) return;

      const map = leaflet.map(container, {
        attributionControl: true,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(map);

      const bounds = leaflet.latLngBounds(
        [routePreviewBounds.minLat, routePreviewBounds.minLng],
        [routePreviewBounds.maxLat, routePreviewBounds.maxLng],
      );
      map.fitBounds(bounds, { padding: [36, 36], animate: false });
      const overlay = leaflet.layerGroup().addTo(map);
      overlayRef.current = overlay;
      leafletRef.current = leaflet;
      mapRef.current = map;
      setReady(true);
    }

    mountMap();

    return () => {
      cancelled = true;
      overlayRef.current?.clearLayers();
      overlayRef.current = null;
      markerMap.clear();
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!ready || !leafletRef.current || !overlayRef.current) return;
    drawTrailOverlay(leafletRef.current, overlayRef.current, highlights, markerRefs.current, onHighlightSelect);
  }, [highlights, onHighlightSelect, ready]);

  useEffect(() => {
    if (!ready || !mapRef.current || !containerRef.current) return;

    const map = mapRef.current;
    const container = containerRef.current;
    const invalidateMapSize = () => map.invalidateSize({ animate: false });

    invalidateMapSize();
    const resizeObserver = new ResizeObserver(invalidateMapSize);
    resizeObserver.observe(container);
    window.addEventListener("resize", invalidateMapSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", invalidateMapSize);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready || !mapRef.current || !activeHighlightId) return;
    const activeMarker = markerRefs.current.get(activeHighlightId);
    if (!activeMarker) return;

    updateHighlightMarkerStyles(markerRefs.current, activeHighlightId);
    if (activeFlyTo) {
      const latLng = activeMarker.getLatLng();
      mapRef.current.flyTo(latLng, Math.max(mapRef.current.getZoom(), 9), { duration: 0.6 });
    }
    if (openActivePopup) {
      activeMarker.openPopup();
    }
  }, [activeFlyTo, activeHighlightId, openActivePopup, ready]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 h-full min-h-[430px] w-full sm:min-h-[520px] xl:min-h-[660px]" />
  );
}

"use client";

import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

import { routePreviewBounds, routePreviewPins, routePreviewSegments, type RoutePin } from "@/lib/route-preview-data";

type LeafletRouteMapProps = {
  activeCount: number;
  showRoute: boolean;
  showTowns: boolean;
  selectedPin: RoutePin;
  onSelectPin: (pin: RoutePin) => void;
};

function FitRoute({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  map.fitBounds(bounds, { padding: [36, 36], animate: false });
  return null;
}

const routeSegments: LatLngExpression[][] = routePreviewSegments.map((segment) =>
  segment.map(([lat, lng]) => [lat, lng]),
);
const mapBounds: LatLngBoundsExpression = [
  [routePreviewBounds.minLat, routePreviewBounds.minLng],
  [routePreviewBounds.maxLat, routePreviewBounds.maxLng],
];

export function LeafletRouteMap({
  activeCount,
  showRoute,
  showTowns,
  selectedPin,
  onSelectPin,
}: LeafletRouteMapProps) {
  return (
    <>
      <MapContainer
        center={[34.05, -110.25]}
        zoom={8}
        scrollWheelZoom={false}
        className="absolute inset-0 z-0 h-full min-h-[760px] w-full lg:min-h-[820px]"
        zoomControl
      >
        <FitRoute bounds={mapBounds} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showRoute ? (
          <>
            {routeSegments.map((segment, index) => (
              <Polyline key={`shadow-${index}`} positions={segment} pathOptions={{ color: "#13221a", weight: 9, opacity: 0.35 }} />
            ))}
            {routeSegments.map((segment, index) => (
              <Polyline key={`route-${index}`} positions={segment} pathOptions={{ color: "#b87939", weight: 5, opacity: 0.98 }} />
            ))}
            {routeSegments.map((segment, index) => (
              <Polyline key={`dash-${index}`} positions={segment} pathOptions={{ color: "#fff2cf", weight: 1.5, opacity: 0.85, dashArray: "2 12" }} />
            ))}
          </>
        ) : null}
        {showTowns
          ? routePreviewPins.map((pin) => (
              <CircleMarker
                key={pin.label}
                center={[pin.lat, pin.lng]}
                radius={selectedPin.label === pin.label ? 11 : 8}
                pathOptions={{
                  color: selectedPin.label === pin.label ? "#fffdf7" : "#173d2b",
                  fillColor: selectedPin.label === pin.label ? "#b87939" : "#fffdf7",
                  fillOpacity: 1,
                  weight: selectedPin.label === pin.label ? 3 : 2,
                }}
                eventHandlers={{ click: () => onSelectPin(pin) }}
              >
                <Popup>
                  <strong>{pin.label}</strong>
                  <br />
                  {pin.type}
                </Popup>
              </CircleMarker>
            ))
          : null}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-5 left-5 z-[410] hidden max-w-xs rounded-[2px] bg-[#fffdf7]/92 p-4 text-[#13221a] shadow-[0_18px_50px_rgba(19,34,26,0.18)] backdrop-blur md:block">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center bg-[#173d2b] text-white">
            <span className="size-3 rounded-full bg-[#f0c477]" />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em]">Live route map</p>
            <p className="text-xs leading-5 text-[#5f6c63]">
              OSM tiles / GPX route / {activeCount} layers visible
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

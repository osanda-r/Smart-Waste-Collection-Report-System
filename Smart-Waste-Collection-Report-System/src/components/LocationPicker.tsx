import { useEffect, useState } from "react";
import { Circle, CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_CENTER } from "../lib/geo";
import type { GeoPoint } from "../lib/types";

function ClickToPick({ onPick }: { onPick: (p: GeoPoint) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function PanTo({ point, token }: { point: GeoPoint | null; token: number }) {
  const map = useMap();
  useEffect(() => {
    if (point && token > 0) map.setView([point.lat, point.lng], 17);
    // Only pan when a geolocation request completes (token changes), not on every click.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return null;
}

/**
 * Click the map (or use the device location) to choose a point.
 * Optionally shows a circle, e.g. the collection-zone radius being edited.
 */
export default function LocationPicker({
  value,
  onChange,
  radiusM,
  height = 320,
  allowGeolocation = true,
}: {
  value: GeoPoint | null;
  onChange: (p: GeoPoint) => void;
  radiusM?: number;
  height?: number;
  allowGeolocation?: boolean;
}) {
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [panToken, setPanToken] = useState(0);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setGeoError("Your browser does not support location access. Click the map instead.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setPanToken((t) => t + 1);
        setLocating(false);
      },
      () => {
        setGeoError("Location permission was denied or unavailable. Click the map to pick a point.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  const centre = value ?? DEFAULT_CENTER;

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl border border-slate-300" style={{ height }}>
        <MapContainer center={[centre.lat, centre.lng]} zoom={value ? 16 : 13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPick onPick={onChange} />
          <PanTo point={value} token={panToken} />
          {value && radiusM && (
            <Circle center={[value.lat, value.lng]} radius={radiusM} pathOptions={{ color: "#0f766e", fillOpacity: 0.08 }} />
          )}
          {value && (
            <CircleMarker center={[value.lat, value.lng]} radius={9} pathOptions={{ color: "#fff", weight: 2, fillColor: "#dc2626", fillOpacity: 1 }} />
          )}
        </MapContainer>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {allowGeolocation && (
          <button type="button" onClick={useMyLocation} disabled={locating} className="btn-outline px-3 py-2 text-sm">
            {locating ? "Locating…" : "Use my location"}
          </button>
        )}
        <span className="text-slate-500">
          {value ? `Selected: ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}` : "Click the map to mark the spot."}
        </span>
      </div>
      {geoError && <p className="text-sm text-amber-700">{geoError}</p>}
    </div>
  );
}

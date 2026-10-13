import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CircleMarker, Circle, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_CENTER } from "../lib/geo";
import { STATUS_LABELS, type Report, type ReportStatus, type Zone } from "../lib/types";
import { STATUS_COLORS } from "../lib/colors";
import { formatDate } from "../lib/reports";


function FitToReports({ points }: { points: [number, number][] }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || points.length === 0) return;
    fitted.current = true;
    map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
  }, [map, points]);
  return null;
}

/** Map of reports (coloured by status) with optional zone boundaries. */
export default function ReportsMap({
  reports,
  zones = [],
  detailBase,
  height = 520,
}: {
  reports: Report[];
  zones?: Zone[];
  detailBase?: string;
  height?: number;
}) {
  const points = reports.map((r) => [r.location.lat, r.location.lng] as [number, number]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm" style={{ height }}>
      <MapContainer center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToReports points={points} />
        {zones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.center.lat, zone.center.lng]}
            radius={zone.radiusM}
            pathOptions={{ color: "#0f766e", weight: 2, fillOpacity: 0.06 }}
          >
            <Popup>
              <strong>{zone.name}</strong>
              <div>Radius {zone.radiusM} m</div>
            </Popup>
          </Circle>
        ))}
        {reports.map((report) => (
          <CircleMarker
            key={report.id}
            center={[report.location.lat, report.location.lng]}
            radius={report.priority === "high" ? 10 : 8}
            pathOptions={{ color: "#fff", weight: 2, fillColor: STATUS_COLORS[report.status], fillOpacity: 0.95 }}
          >
            <Popup>
              <div className="min-w-44 space-y-1 text-sm">
                <div className="font-semibold">{report.title}</div>
                <div>{STATUS_LABELS[report.status]} · {formatDate(report.createdAt)}</div>
                <div className="text-slate-600">{report.address}</div>
                {detailBase && (
                  <Link to={`${detailBase}/${report.id}`} className="font-semibold text-emerald-700">
                    Open report →
                  </Link>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export function StatusLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-slate-600">
      {(Object.keys(STATUS_COLORS) as ReportStatus[]).map((status) => (
        <span key={status} className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ background: STATUS_COLORS[status] }} />
          {STATUS_LABELS[status]}
        </span>
      ))}
    </div>
  );
}

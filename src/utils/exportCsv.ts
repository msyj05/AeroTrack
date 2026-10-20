import type { FlightLog } from "../types";

/** Escapes a value for CSV: wraps in quotes, doubles internal quotes. */
function esc(v: string | number | undefined): string {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function downloadFlightLogsCsv(
  logs: FlightLog[],
  filename = "flight-logs.csv",
) {
  const headers = [
    "Flight ID",
    "Date",
    "Pilot",
    "Drone",
    "Location",
    "Start",
    "End",
    "Duration (min)",
    "Battery",
    "Status",
    "Purpose",
    "Flight Type",
    "Initial %",
    "Final %",
    "Initial Temp (°C)",
    "Final Temp (°C)",
    "Incident",
    "Notes",
  ];

  const rows = logs.map((f) => [
    f.id,
    f.date,
    f.pilot,
    f.drone,
    f.location,
    f.start,
    f.end,
    `${f.durationMin} min`,
    f.battery,
    f.status,
    f.purpose ?? "",
    f.flightType ?? "",
    f.initialPct !== undefined ? `${f.initialPct}%` : "",
    f.finalPct !== undefined ? `${f.finalPct}%` : "",
    f.initialTemp !== undefined ? `${f.initialTemp}°C` : "",
    f.finalTemp !== undefined ? `${f.finalTemp}°C` : "",
    f.incident ?? "",
    f.notes ?? "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(esc).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

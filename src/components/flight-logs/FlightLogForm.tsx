import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CheckCircle2, Timer } from "lucide-react";
import { currentUser } from "../../data/mock";
import { useData } from "../../data/DataContext";
import type { FlightFormState, FlightLog } from "../../types";
import type { FlightFormChange } from "./FormParts";
import FlightInfoSection from "./FlightInfoSection";
import DroneInfoSection from "./DroneInfoSection";
import BatteryInfoSection from "./BatteryInfoSection";
import AdditionalInfoSection from "./AdditionalInfoSection";
import FlightLogChecklist from "./FlightLogChecklist";

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Convert a stored FlightLog (formatted date, numeric values) back into the
 * string-based shape the form fields expect.
 */
function logToFormState(log: FlightLog): FlightFormState {
  // "Oct 5, 2026" → "2026-10-05"
  const dateObj = new Date(log.date);
  const date = Number.isNaN(dateObj.getTime())
    ? ""
    : `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

  const str = (v: number | undefined) => (v === undefined ? "" : String(v));

  return {
    date,
    location: log.location,
    reporting: log.reporting ?? "",
    leaving: log.leaving ?? "",
    start: log.start,
    end: log.end,
    purpose: log.purpose ?? "",
    drone: log.drone,
    pilot: log.pilot,
    type: log.flightType ?? "",
    batterySerial: log.battery,
    cycles: "",
    initialPct: str(log.initialPct),
    finalPct: str(log.finalPct),
    initialTemp: str(log.initialTemp),
    finalTemp: str(log.finalTemp),
    notes: log.notes ?? "",
    incident: log.incident ?? "No issues to report",
  };
}

interface Props {
  /** When provided, the form runs in edit mode. */
  initialLog?: FlightLog;
}

export default function FlightLogForm({ initialLog }: Props) {
  const navigate = useNavigate();
  const { drones, batteries, flightLogs, addFlightLog, updateFlightLog } =
    useData();
  const isEdit = !!initialLog;

  const [f, setF] = useState<FlightFormState>(() =>
    initialLog
      ? logToFormState(initialLog)
      : {
          date: "",
          location: "",
          reporting: "",
          leaving: "",
          start: "",
          end: "",
          purpose: "",
          drone: drones[0]?.name ?? "",
          pilot: currentUser.name,
          type: "",
          batterySerial: batteries[0]?.serial ?? "",
          cycles: "",
          initialPct: "",
          finalPct: "",
          initialTemp: "",
          finalTemp: "",
          notes: "",
          incident: "No issues to report",
        },
  );

  const set: FlightFormChange = (k) => (e) =>
    setF({ ...f, [k]: e.target.value });

  const endInvalid =
    f.start !== "" && f.end !== "" && toMin(f.end) <= toMin(f.start);

  const duration =
    f.start !== "" && f.end !== "" && !endInvalid
      ? toMin(f.end) - toMin(f.start)
      : null;

  const tempDelta =
    f.initialTemp !== "" && f.finalTemp !== ""
      ? Number(f.finalTemp) - Number(f.initialTemp)
      : null;

  const batteryUsed =
    f.initialPct !== "" && f.finalPct !== ""
      ? Number(f.initialPct) - Number(f.finalPct)
      : null;

  const checks = [
    { label: "Airspace authorization verified", done: true },
    {
      label: "Battery temp within limits",
      done: tempDelta !== null && tempDelta <= 20,
    },
    { label: "End time entered", done: !!f.end && !endInvalid },
    { label: "Imagery attached (4 files)", done: true },
  ];

  const canSave =
    !!f.date && !!f.location && !!f.start && !!f.end && !endInvalid;

  const save = () => {
    if (!canSave) return;

    // Parse yyyy-mm-dd as local time, then format like the rest of the app
    const [y, m, d] = f.date.split("-").map(Number);
    const formatted = new Date(y, m - 1, d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const status: FlightLog["status"] =
      f.incident === "No issues to report" ? "Completed" : "Review";

    const num = (v: string) => (v === "" ? undefined : Number(v));

    if (isEdit && initialLog) {
      // Update only the mutable fields; keep id stable.
      updateFlightLog(initialLog.id, {
        date: formatted,
        pilot: f.pilot,
        drone: f.drone,
        location: f.location,
        start: f.start,
        end: f.end,
        durationMin: duration ?? 0,
        battery: f.batterySerial,
        status,
        reporting: f.reporting || undefined,
        leaving: f.leaving || undefined,
        purpose: f.purpose || undefined,
        flightType: f.type || undefined,
        initialPct: num(f.initialPct),
        finalPct: num(f.finalPct),
        initialTemp: num(f.initialTemp),
        finalTemp: num(f.finalTemp),
        notes: f.notes || undefined,
        incident: f.incident || undefined,
      });
      navigate(`/flight-logs/${initialLog.id}`);
    } else {
      // Next FL-XXXX from existing logs
      const highest = flightLogs.reduce((max, l) => {
        const n = Number(l.id.replace("FL-", ""));
        return Number.isFinite(n) && n > max ? n : max;
      }, 2474);

      const newLog: FlightLog = {
        id: `FL-${highest + 1}`,
        date: formatted,
        pilot: f.pilot,
        drone: f.drone,
        location: f.location,
        start: f.start,
        end: f.end,
        durationMin: duration ?? 0,
        battery: f.batterySerial,
        status,
        reporting: f.reporting || undefined,
        leaving: f.leaving || undefined,
        purpose: f.purpose || undefined,
        flightType: f.type || undefined,
        initialPct: num(f.initialPct),
        finalPct: num(f.finalPct),
        initialTemp: num(f.initialTemp),
        finalTemp: num(f.finalTemp),
        notes: f.notes || undefined,
        incident: f.incident || undefined,
      };

      addFlightLog(newLog);
      navigate("/flight-logs");
    }
  };

  return (
    <>
      <header className="border-b border-slate-200/70 bg-white px-4 py-4 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-semibold sm:text-xl">
                {isEdit ? `Edit ${initialLog?.id}` : "Add flight log"}
              </h1>
              <p className="truncate text-sm text-slate-500">
                {isEdit
                  ? "Update the details and save"
                  : "Fill in the details below"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                isEdit && initialLog
                  ? navigate(`/flight-logs/${initialLog.id}`)
                  : navigate("/flight-logs")
              }
              className="btn-outline flex-1 sm:flex-none"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!canSave}
              className="btn-primary flex-1 sm:flex-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {isEdit ? "Save changes" : "Save Flight Log"}
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-4 sm:p-8 xl:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <FlightInfoSection f={f} set={set} endInvalid={endInvalid} />
          <DroneInfoSection f={f} set={set} />
          <BatteryInfoSection f={f} set={set} tempDelta={tempDelta} />
          <AdditionalInfoSection f={f} set={set} />
        </div>

        <aside className="space-y-4">
          <FlightLogChecklist checks={checks} />

          <div className="rounded-2xl bg-ink p-5 text-white">
            <p className="flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4" />
              Computed duration
            </p>
            <p className="mt-3 font-display text-3xl font-semibold">
              {duration !== null ? `${duration} min` : "—"}
            </p>
            {duration === null && (
              <p className="mt-2 text-xs text-slate-400">
                Enter start and end times to calculate duration.
              </p>
            )}
            {duration !== null && batteryUsed !== null && (
              <p className="mt-2 text-xs text-slate-400">
                Battery used: {batteryUsed}%
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {isEdit
              ? "Changes are saved to the ops cloud."
              : "Autosave on. Your draft is synced to the ops cloud."}
          </div>
        </aside>
      </div>
    </>
  );
}

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BatteryCharging,
  Command,
  Pencil,
  Plane,
  Thermometer,
  Timer,
  Trash2,
} from "lucide-react";
import StatusBadge from "../components/ui/StatusBadge";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import FlightLogMetric from "../components/flight-logs/FlightLogMetric";
import FlightLogPanel, {
  FlightLogRow as Row,
} from "../components/flight-logs/FlightLogPanel";
import { useData } from "../data/DataContext";

const dash = (v?: string | number) =>
  v === undefined || v === "" ? "—" : String(v);

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { flightLogs, drones, batteries, deleteFlightLog } = useData();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const log = flightLogs.find((f) => f.id === id);

  if (!log) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Flight log {id} was not found.</p>
        <Link to="/flight-logs" className="mt-3 inline-block text-brand">
          Back to flight logs
        </Link>
      </div>
    );
  }

  const drone = drones.find((d) => d.name === log.drone);
  const battery = batteries.find((b) => b.serial === log.battery);

  const handleDelete = () => {
    deleteFlightLog(log.id);
    setConfirmDelete(false);
    navigate("/flight-logs");
  };

  // Derived values that only exist if both ends are present
  const hasBatteryRange =
    log.initialPct !== undefined && log.finalPct !== undefined;
  const batteryUsed = hasBatteryRange
    ? (log.initialPct as number) - (log.finalPct as number)
    : null;

  const hasTempRange =
    log.initialTemp !== undefined && log.finalTemp !== undefined;
  const tempDelta = hasTempRange
    ? (log.finalTemp as number) - (log.initialTemp as number)
    : null;

  const flagged = log.incident && log.incident !== "No issues to report";

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/flight-logs")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200"
              aria-label="Back to flight logs"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="truncate font-display text-lg font-semibold sm:text-2xl">
                  {log.id}
                </h1>
                <StatusBadge label={log.status} />
              </div>
              <p className="truncate text-xs text-slate-500 sm:text-sm">
                {log.location} · {log.date}
              </p>
              <p className="text-xs text-slate-500 sm:hidden">
                Logged by{" "}
                <span className="font-medium text-ink">{log.pilot}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmDelete(true)}
              className="btn flex-1 border border-red-300 bg-white text-red-700 hover:bg-red-50 sm:flex-none"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <Link
              to={`/flight-logs/${log.id}/edit`}
              className="btn-dark flex-1 sm:flex-none"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </div>
        </div>
      </header>

      <div className="space-y-5 p-4 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FlightLogMetric
            icon={<Timer className="h-4 w-4" />}
            label="Duration"
            value={`${log.durationMin} min`}
            sub={`${log.start} → ${log.end}`}
          />
          <FlightLogMetric
            icon={<BatteryCharging className="h-4 w-4" />}
            label="Battery used"
            value={batteryUsed !== null ? `${batteryUsed}%` : "—"}
            sub={
              hasBatteryRange
                ? `${log.initialPct}% → ${log.finalPct}% · ${log.battery}`
                : `Battery ${dash(log.battery)}`
            }
          />
          <FlightLogMetric
            icon={<Thermometer className="h-4 w-4" />}
            label="Temp delta"
            value={
              tempDelta !== null
                ? `${tempDelta > 0 ? "+" : ""}${tempDelta}°C`
                : "—"
            }
            sub={
              hasTempRange
                ? `${log.initialTemp}°C → ${log.finalTemp}°C`
                : "No temperature log"
            }
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <FlightLogPanel
            icon={<Plane className="h-4 w-4" />}
            title="Flight information"
          >
            <Row k="Flight date" v={log.date} />
            <Row k="Reporting time" v={dash(log.reporting)} />
            <Row k="Leaving time" v={dash(log.leaving)} />
            <Row k="Location" v={log.location} />
            <Row k="Purpose" v={dash(log.purpose)} />
            <Row k="Flight type" v={dash(log.flightType)} />
          </FlightLogPanel>

          <FlightLogPanel
            icon={<Command className="h-4 w-4" />}
            title="Drone & pilot"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white">
                <Command className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{log.drone}</p>
                <p className="font-mono text-xs text-slate-400">
                  {drone?.serial ?? "—"}
                </p>
              </div>
              {drone && <StatusBadge label={drone.status} />}
            </div>
            <Row k="Pilot" v={log.pilot} />
            <Row
              k="Airframe hours"
              v={
                drone
                  ? `${drone.airTimeHours} h · ${drone.flights} flights`
                  : "—"
              }
            />
          </FlightLogPanel>

          <FlightLogPanel
            icon={<BatteryCharging className="h-4 w-4" />}
            title="Battery"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">{dash(log.battery)}</span>
              {battery && <StatusBadge label={battery.condition} />}
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-brand"
                style={{ width: `${log.finalPct ?? 0}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              {log.finalPct !== undefined
                ? `Landed at ${log.finalPct}%`
                : "Landed percentage not recorded"}
              {battery &&
                ` · health ${battery.health}% · ${battery.cycles} cycles`}
            </p>
            <div className="mt-4">
              <Row k="Model" v={battery?.model ?? "—"} />
              <Row
                k="Temp"
                v={
                  hasTempRange
                    ? `${log.initialTemp}°C → ${log.finalTemp}°C`
                    : "—"
                }
              />
              <Row k="Condition" v={battery?.condition ?? "—"} />
            </div>
          </FlightLogPanel>
        </div>

        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <section className="card p-4 sm:p-6">
            <h3 className="font-display font-semibold">Notes</h3>
            {log.notes ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {log.notes}
              </p>
            ) : (
              <p className="mt-3 text-sm italic text-slate-400">
                No notes were recorded for this flight.
              </p>
            )}
            {flagged && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <Thermometer className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="font-medium">Incident reported:</span>{" "}
                  {log.incident}
                </span>
              </div>
            )}
          </section>

          <section className="card p-4 sm:p-6">
            <h3 className="font-display font-semibold">Record</h3>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-brand" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-xs text-slate-500">
                    {log.pilot} · {log.date}
                  </p>
                </div>
              </li>
              {flagged && (
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-500" />
                  <div>
                    <p className="font-medium">Flagged for review</p>
                    <p className="text-xs text-slate-500">{log.incident}</p>
                  </div>
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${log.id}?`}
        description="This flight log will be removed permanently. This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}

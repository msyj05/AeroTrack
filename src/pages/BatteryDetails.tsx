import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BatteryCharging,
  Clock,
  Pencil,
  Plane,
  RefreshCw,
  Trash2,
} from "lucide-react";
import StatusBadge from "../components/ui/StatusBadge";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import AddBatteryDialog from "../components/batteries/AddBatteryDialog";
import { useData } from "../data/DataContext";

const barColor = (health: number) =>
  health >= 80 ? "bg-emerald-600" : health >= 65 ? "bg-brand" : "bg-red-600";

export default function BatteryDetails() {
  const { serial } = useParams();
  const navigate = useNavigate();
  const { batteries, flightLogs, deleteBattery } = useData();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const battery = batteries.find((b) => b.serial === serial);

  if (!battery) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Battery was not found.</p>
        <Link to="/batteries" className="mt-3 inline-block text-brand">
          Back to batteries
        </Link>
      </div>
    );
  }

  // Flights that reference this battery by serial
  const recentFlights = flightLogs
    .filter((f) => f.battery === battery.serial)
    .slice(0, 5);

  const handleDelete = () => {
    deleteBattery(battery.serial);
    setConfirmDelete(false);
    navigate("/batteries");
  };

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/batteries")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200"
              aria-label="Back to batteries"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="truncate font-mono text-lg font-semibold sm:text-2xl">
                  {battery.serial}
                </h1>
                <StatusBadge label={battery.condition} />
              </div>
              <p className="truncate text-xs text-slate-500 sm:text-sm">
                {battery.model}
              </p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setConfirmDelete(true)}
              className="btn flex-1 border border-red-300 bg-white text-red-700 hover:bg-red-50 sm:flex-none"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="btn-dark flex-1 sm:flex-none"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-5 p-4 sm:p-8">
        {/* Metric cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            icon={<RefreshCw className="h-4 w-4" />}
            label="Cycles"
            value={String(battery.cycles)}
          />
          <Metric
            icon={<BatteryCharging className="h-4 w-4" />}
            label="Health"
            value={`${battery.health}%`}
          />
          <Metric
            icon={<Plane className="h-4 w-4" />}
            label="Flights"
            value={String(battery.flights)}
          />
          <Metric
            icon={<Clock className="h-4 w-4" />}
            label="Last used"
            value={battery.lastUsed}
          />
        </div>

        {/* Health bar */}
        <section className="card p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Health</h3>
            <span className="font-mono text-sm text-slate-500">
              {battery.health}%
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div
              className={`h-2 rounded-full ${barColor(battery.health)}`}
              style={{ width: `${battery.health}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {battery.health >= 80
              ? "Healthy — safe for regular use."
              : battery.health >= 65
                ? "Fair — continue monitoring cycles."
                : "Degraded — schedule replacement."}
          </p>
        </section>

        {/* Recent flights */}
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <h3 className="font-display text-lg font-semibold">
              Recent flights
            </h3>
            <Link to="/flight-logs" className="text-sm font-medium text-brand">
              View all
            </Link>
          </div>

          {recentFlights.length === 0 ? (
            <p className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-500">
              No flight logs recorded for this battery yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 border-t border-slate-100">
              {recentFlights.map((f) => (
                <li key={f.id}>
                  <Link
                    to={`/flight-logs/${f.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50/60"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{f.id}</p>
                        <StatusBadge label={f.status} />
                      </div>
                      <p className="mt-0.5 truncate text-sm text-slate-500">
                        {f.location} · {f.date}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-slate-500">
                      <p className="font-mono">{f.durationMin}m</p>
                      <p className="font-mono">{f.drone}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <AddBatteryDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialBattery={battery}
      />

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${battery.serial}?`}
        description="This battery will be removed from your fleet. This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4 sm:p-5">
      <p className="flex items-center gap-2 text-xs text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

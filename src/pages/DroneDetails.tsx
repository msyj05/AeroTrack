import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Command,
  Pencil,
  Plane,
  Trash2,
  Wrench,
} from "lucide-react";
import StatusBadge from "../components/ui/StatusBadge";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DroneDialog from "../components/drones/DroneDialog";
import { useData } from "../data/DataContext";
import type { DroneStatus } from "../types";

export default function DroneDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { drones, flightLogs, updateDrone, deleteDrone } = useData();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const drone = drones.find((d) => d.id === id);

  if (!drone) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Drone was not found.</p>
        <Link to="/drones" className="mt-3 inline-block text-brand">
          Back to drones
        </Link>
      </div>
    );
  }

  // Flights that reference this drone by name
  const recentFlights = flightLogs
    .filter((f) => f.drone === drone.name)
    .slice(0, 5);

  const handleDelete = () => {
    deleteDrone(drone.id);
    setConfirmDelete(false);
    navigate("/drones");
  };

  const toggleStatus = () => {
    const nextStatus: DroneStatus =
      drone.status === "Ready" ? "In Maintenance" : "Ready";
    updateDrone(drone.id, { status: nextStatus });
  };

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="flex flex-col gap-4">
          {/* Title row */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/drones")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200"
              aria-label="Back to drones"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate font-display text-lg font-semibold sm:text-2xl">
                  {drone.name}
                </h1>
                <StatusBadge label={drone.status} />
              </div>
              <p className="truncate font-mono text-xs text-slate-500 sm:text-sm">
                {drone.serial}
              </p>
            </div>
          </div>

          {/* Actions row — full width on mobile, right-aligned on desktop */}
          <div className="flex flex-wrap gap-2 sm:justify-end sm:gap-3">
            <button
              onClick={toggleStatus}
              className={
                drone.status === "Ready"
                  ? "btn-outline flex-1 sm:flex-none"
                  : "btn-primary flex-1 sm:flex-none"
              }
            >
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">
                {drone.status === "Ready"
                  ? "Send to maintenance"
                  : "Mark ready"}
              </span>
              <span className="sm:hidden">
                {drone.status === "Ready" ? "Maintenance" : "Mark ready"}
              </span>
            </button>
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
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric
            icon={<Plane className="h-4 w-4" />}
            label="Total flights"
            value={String(drone.flights)}
          />
          <Metric
            icon={<Clock className="h-4 w-4" />}
            label="Air time"
            value={`${drone.airTimeHours} h`}
          />
          <Metric
            icon={<Command className="h-4 w-4" />}
            label="Last flight"
            value={drone.lastFlight}
          />
        </div>

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
              No flight logs recorded for this drone yet.
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
                      <p className="font-mono">{f.pilot.split(" ")[0]}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <DroneDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialDrone={drone}
      />

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${drone.name}?`}
        description="This drone will be removed from your fleet. This cannot be undone."
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

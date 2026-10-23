import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Command, Plus, Search } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import StatusBadge from "../components/ui/StatusBadge";
import { useData } from "../contexts/DataContext";
import DroneDialog from "../components/drones/DroneDialog";
import EmptyState from "../components/ui/EmptyState";

export default function Drones() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [addOpen, setAddOpen] = useState(false);

  const { drones } = useData();

  const list = drones.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) &&
      (status === "All statuses" || d.status === status),
  );

  return (
    <>
      <Topbar title="Drones" />
      <div className="space-y-5 p-4 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search — full width on mobile, fixed width on desktop */}
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 sm:w-64 sm:shrink-0">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search drones..."
              className="w-full min-w-0 bg-transparent text-sm outline-none"
            />
          </label>

          {/* Filter + Add — filter grows on mobile, fits content on desktop */}
          <div className="flex items-center gap-3 sm:flex-1">
            <label className="relative flex flex-1 items-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm sm:max-w-48">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none bg-transparent pr-6 outline-none"
              >
                {["All statuses", "Ready", "In Maintenance", "Grounded"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  ),
                )}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4" />
            </label>

            <button
              onClick={() => setAddOpen(true)}
              className="btn-primary shrink-0 sm:ml-auto"
              aria-label="Add drone"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Drone</span>
              <span className="sm:hidden">Drone</span>
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {list.map((d) => (
            <Link
              key={d.serial}
              to={`/drones/${encodeURIComponent(d.serial)}`}
              className="card block p-4 transition hover:border-brand/40 hover:shadow-md sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white">
                  <Command className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold">
                    {d.name}
                  </h3>
                  <p className="font-mono text-xs text-slate-400">{d.serial}</p>
                </div>
                <StatusBadge label={d.status} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
                <Stat value={String(d.flights)} label="Flights" />
                <Stat value={`${d.airTimeHours}h`} label="Air time" />
                <Stat value={d.lastFlight} label="Last flight" />
              </div>
            </Link>
          ))}
        </div>

        {list.length === 0 &&
          (drones.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={Command}
                title="No drones yet"
                description="Add your first drone to start tracking flights, maintenance, and air time."
                action={
                  <button
                    onClick={() => setAddOpen(true)}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4" />
                    Add Drone
                  </button>
                }
              />
            </div>
          ) : (
            <div className="card">
              <EmptyState
                icon={Search}
                title="No drones match"
                description="Try a different search term or clear the status filter."
                compact
              />
            </div>
          ))}
      </div>

      <DroneDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-3 text-center">
      <p className="font-display text-sm font-semibold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

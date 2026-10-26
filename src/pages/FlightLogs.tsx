import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Command,
  Download,
  Plane,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import StatusBadge from "../components/ui/StatusBadge";
import { useData } from "../contexts/DataContext";
import { downloadFlightLogsCsv } from "../utils/exportCsv";
import EmptyState from "../components/ui/EmptyState";

type Filter = "All" | "Incident" | "Review";
type Range = "all" | "7d" | "30d" | "90d";

export default function FlightLogs() {
  const [query, setQuery] = useState("");
  const [pilot, setPilot] = useState("All pilots");
  const [drone, setDrone] = useState("All drones");
  const [status, setStatus] = useState<Filter>("All");
  const { flightLogs, drones } = useData();
  const [range, setRange] = useState<Range>("all");

  const pilots = useMemo(
    () => Array.from(new Set(flightLogs.map((f) => f.pilot))),
    [],
  );

  const rows = flightLogs.filter((f) => {
    const q = query.toLowerCase();
    const matchesQuery = [f.pilot, f.drone, f.location, f.id].some((v) =>
      v.toLowerCase().includes(q),
    );

    if (!matchesQuery) return false;
    if (pilot !== "All pilots" && f.pilot !== pilot) return false;
    if (drone !== "All drones" && f.drone !== drone) return false;
    if (status !== "All" && f.status !== status) return false;

    if (range !== "all") {
      const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      cutoff.setHours(0, 0, 0, 0);
      const logDate = new Date(f.date);
      if (Number.isNaN(logDate.getTime()) || logDate < cutoff) return false;
    }

    return true;
  });

  const chip = (value: Filter, label: string) => (
    <button
      onClick={() => setStatus(value)}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
        status === value
          ? "border-ink bg-ink text-white"
          : "border-slate-200 bg-white text-ink"
      }`}
    >
      {label}
      {value === "All" && status === "All" && <X className="h-3 w-3" />}
    </button>
  );

  return (
    <>
      <Topbar title="Flight Logs" />
      <div className="p-4 sm:p-8">
        <div className="card">
          {/* Filters */}
          <div className="space-y-3 p-4 sm:p-5">
            {/* Search — full width */}
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pilot, drone, location, ID..."
                className="w-full min-w-0 bg-transparent text-sm outline-none"
              />
            </label>

            {/* Filter row: date + pilots + drones + add button */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              {/* Filters — 3-col grid at all widths */}
              <div className="grid grid-cols-3 gap-2 md:flex-1">
                <label className="relative flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2.5 text-sm sm:px-3">
                  <Calendar className="hidden h-4 w-4 shrink-0 text-slate-500 sm:block" />
                  <select
                    value={range}
                    onChange={(e) => setRange(e.target.value as Range)}
                    className="w-full appearance-none bg-transparent pr-5 text-xs outline-none sm:text-sm"
                  >
                    <option value="all">All time</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 sm:right-3" />
                </label>

                <Select
                  icon={<User className="h-4 w-4" />}
                  value={pilot}
                  onChange={setPilot}
                  options={["All pilots", ...pilots]}
                  compact
                />
                <Select
                  icon={<Command className="h-4 w-4" />}
                  value={drone}
                  onChange={setDrone}
                  options={["All drones", ...drones.map((d) => d.name)]}
                  compact
                />
              </div>

              <div className="flex w-full gap-2 md:w-auto">
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split("T")[0];
                    downloadFlightLogsCsv(rows, `flight-logs-${today}.csv`);
                  }}
                  disabled={rows.length === 0}
                  className="btn-outline flex-1 md:flex-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Export to CSV"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </button>
                <Link
                  to="/flight-logs/new"
                  className="btn-primary flex-1 md:flex-none"
                  aria-label="Add flight log"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Flight Log</span>
                  <span className="sm:hidden">Add</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Status chips */}
          <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 sm:px-5">
            {chip("All", "Status: All")}
            {chip("Incident", "Incident only")}
            {chip("Review", "Needs review")}
            <span className="ml-auto shrink-0 text-xs text-slate-500">
              {rows.length} of {flightLogs.length}
            </span>
          </div>

          {rows.length === 0 ? (
            <div className="border-t border-slate-100">
              {flightLogs.length === 0 ? (
                <EmptyState
                  icon={Plane}
                  title="No flight logs yet"
                  description="Record your first flight to start building your logbook."
                  action={
                    <Link to="/flight-logs/new" className="btn-primary">
                      <Plus className="h-4 w-4" />
                      Add Flight Log
                    </Link>
                  }
                />
              ) : (
                <EmptyState
                  icon={Search}
                  title="No flight logs match"
                  description="Try adjusting your search or clearing the filters."
                  compact
                />
              )}
            </div>
          ) : (
            <>
              {/* Mobile: card list */}
              <ul className="divide-y divide-slate-100 border-t border-slate-100 md:hidden">
                {rows.map((f) => (
                  <li key={f.id}>
                    <Link
                      to={`/flight-logs/${f.id}`}
                      className="block px-4 py-4 active:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold">{f.id}</p>
                          <p className="mt-0.5 truncate text-sm text-slate-500">
                            {f.location}
                          </p>
                        </div>
                        <StatusBadge label={f.status} />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <Meta k="Date" v={f.date} />
                        <Meta k="Duration" v={`${f.durationMin} min`} />
                        <Meta k="Pilot" v={f.pilot} />
                        <Meta k="Battery" v={f.battery} />
                        <div className="col-span-2">
                          <Meta k="Drone" v={f.drone} />
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
                {rows.length === 0 && (
                  <li className="px-4 py-10 text-center text-slate-500">
                    No flight logs match these filters.
                  </li>
                )}
              </ul>

              {/* Desktop: table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-y border-slate-100 bg-slate-50/60 text-xs uppercase text-slate-500">
                    <tr>
                      {[
                        "Date",
                        "Pilot",
                        "Drone",
                        "Location",
                        "Start",
                        "End",
                        "Dur.",
                        "Battery",
                      ].map((h) => (
                        <th key={h} className="px-5 py-3 font-medium">
                          {h}
                        </th>
                      ))}
                      <th className="px-5 py-3 text-right font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((f) => (
                      <tr
                        key={f.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-3.5">
                          <Link
                            to={`/flight-logs/${f.id}`}
                            className="block font-medium hover:text-brand"
                          >
                            {f.date}
                          </Link>
                          <span className="text-xs text-slate-400">{f.id}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{f.pilot}</td>
                        <td className="px-5 py-3.5 text-slate-500">
                          {f.drone}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          {f.location}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs">
                          {f.start}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs">
                          {f.end}
                        </td>
                        <td className="px-5 py-3.5 font-medium">
                          {f.durationMin} min
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          {f.battery}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <StatusBadge label={f.status} />
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-5 py-10 text-center text-slate-500"
                        >
                          No flight logs match these filters. Clear a filter to
                          see more.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
          {rows.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <span className="text-xs text-slate-500 sm:text-sm">
                Showing 1–{rows.length} of {flightLogs.length} flight logs
              </span>
              <div className="flex items-center gap-2 text-sm">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="h-9 w-9 rounded-lg bg-ink text-white">
                  1
                </button>
                <button className="h-9 w-9 rounded-lg border border-slate-200">
                  2
                </button>
                <button className="h-9 w-9 rounded-lg border border-slate-200">
                  3
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="h-9 w-9 rounded-lg border border-slate-200">
                  36
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Select({
  icon,
  value,
  onChange,
  options,
  compact = false,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  compact?: boolean;
}) {
  return (
    <label
      className={`relative flex items-center gap-2 rounded-lg border border-slate-200 bg-white ${
        compact ? "px-2.5 py-2.5 sm:px-3" : "px-3 py-2.5"
      } text-sm`}
    >
      <span className={compact ? "hidden shrink-0 sm:block" : ""}>{icon}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-w-0 appearance-none bg-transparent pr-5 outline-none ${
          compact ? "truncate text-xs sm:text-sm" : ""
        }`}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown
        className={`pointer-events-none absolute h-4 w-4 ${
          compact ? "right-2 sm:right-3" : "right-3"
        }`}
      />
    </label>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-0">
      <p className="text-slate-400">{k}</p>
      <p className="truncate font-medium text-ink">{v}</p>
    </div>
  );
}

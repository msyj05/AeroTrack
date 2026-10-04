import { useState } from "react";
import {
  AlertTriangle,
  BatteryCharging,
  ChevronDown,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import Topbar from "../components/Topbar";
import StatusBadge from "../components/StatusBadge";
import { batteries } from "../data/mock";

const barColor = (health: number) =>
  health >= 80 ? "bg-emerald-600" : health >= 65 ? "bg-brand" : "bg-red-600";

export default function Batteries() {
  const [query, setQuery] = useState("");
  const [condition, setCondition] = useState("All conditions");

  const rows = batteries.filter(
    (b) =>
      `${b.serial} ${b.model}`.toLowerCase().includes(query.toLowerCase()) &&
      (condition === "All conditions" || b.condition === condition),
  );

  return (
    <>
      <Topbar title="Batteries" />
      <div className="space-y-5 p-4 sm:p-8">
        {/* Summary strip */}
        <div className="card grid grid-cols-3 divide-x divide-slate-100">
          <Summary
            icon={
              <BatteryCharging className="h-4 w-4 text-brand sm:h-5 sm:w-5" />
            }
            label="Avg Health"
            value="84%"
          />
          <Summary
            icon={<RefreshCw className="h-4 w-4 text-brand sm:h-5 sm:w-5" />}
            label="Avg Cycles"
            value="112"
          />
          <Summary
            icon={
              <AlertTriangle className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
            }
            label="Needs Attention"
            value="1"
          />
        </div>

        <div className="card">
          {/* Filters */}
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 sm:w-72">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search serial or model..."
                className="w-full min-w-0 bg-transparent text-sm outline-none"
              />
            </label>

            <div className="flex items-center gap-3">
              <label className="relative flex flex-1 items-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm sm:flex-none">
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full appearance-none bg-transparent pr-6 outline-none"
                >
                  {[
                    "All conditions",
                    "Excellent",
                    "Good",
                    "Monitor",
                    "Degraded",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4" />
              </label>

              <button className="btn-primary shrink-0 sm:ml-auto" aria-label="Add battery">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Battery</span>
                <span className="sm:hidden">Battery</span>
              </button>
            </div>
          </div>

          {/* Mobile: card list */}
          <ul className="divide-y divide-slate-100 border-t border-slate-100 md:hidden">
            {rows.map((b) => (
              <li key={b.serial} className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono font-medium">{b.serial}</p>
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {b.model}
                    </p>
                  </div>
                  <StatusBadge label={b.condition} />
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex justify-between font-mono text-xs text-slate-500">
                    <span>{b.cycles} cycles</span>
                    <span>{b.health}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div
                      className={`h-1.5 rounded-full ${barColor(b.health)}`}
                      style={{ width: `${b.health}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    Last used:{" "}
                    <span className="font-medium text-ink">{b.lastUsed}</span>
                  </span>
                  <span>
                    Flights:{" "}
                    <span className="font-medium text-ink">{b.flights}</span>
                  </span>
                </div>
              </li>
            ))}
            {rows.length === 0 && (
              <li className="px-4 py-10 text-center text-slate-500">
                No batteries match. Clear the search or condition filter.
              </li>
            )}
          </ul>

          {/* Desktop: table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50/60 text-xs uppercase text-slate-500">
                <tr>
                  {[
                    "Serial",
                    "Model",
                    "Cycles / Health",
                    "Condition",
                    "Last used",
                  ].map((h) => (
                    <th key={h} className="px-5 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                  <th className="px-5 py-3 text-right font-medium">Flights</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr
                    key={b.serial}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-4 font-mono font-medium">
                      {b.serial}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{b.model}</td>
                    <td className="px-5 py-4">
                      <div className="w-40">
                        <div className="mb-1 flex justify-between font-mono text-xs">
                          <span>{b.cycles} cycles</span>
                          <span className="text-slate-500">{b.health}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100">
                          <div
                            className={`h-1.5 rounded-full ${barColor(b.health)}`}
                            style={{ width: `${b.health}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge label={b.condition} />
                    </td>
                    <td className="px-5 py-4 text-slate-500">{b.lastUsed}</td>
                    <td className="px-5 py-4 text-right font-medium">
                      {b.flights}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      No batteries match. Clear the search or condition filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function Summary({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center px-2 py-4 text-center sm:px-4 sm:py-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 sm:h-10 sm:w-10">
        {icon}
      </div>
      <p className="mt-2 font-display text-lg font-semibold sm:text-2xl">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] leading-tight text-slate-500 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

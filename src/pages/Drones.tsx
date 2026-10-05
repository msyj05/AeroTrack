import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Command, Plus, Search } from 'lucide-react'
import Topbar from '../components/Topbar'
import StatusBadge from '../components/StatusBadge'
import { useData } from "../data/DataContext";

export default function Drones() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')

  const { drones } = useData()
  const list = drones.filter(
    (d) => d.name.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || d.status === status),
  )

  return (
    <>
      <Topbar title="Drones" />
      <div className="space-y-5 p-4 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 sm:w-64">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search drones..."
              className="w-full min-w-0 bg-transparent text-sm outline-none"
            />
          </label>

          <div className="flex items-center gap-3">
            <label className="relative flex flex-1 items-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm sm:flex-none">
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
            <article key={d.id} className="card p-4 sm:p-6">
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
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link to="/flight-logs" className="btn-outline">
                  View logs
                </Link>
                <button className="btn-dark">Schedule check</button>
              </div>
            </article>
          ))}
        </div>

        {list.length === 0 && (
          <p className="py-10 text-center text-slate-500">
            No drones match. Clear the search or status filter.
          </p>
        )}
      </div>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-3 text-center">
      <p className="font-display text-sm font-semibold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

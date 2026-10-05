import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, BatteryCharging, Clock, Command, Plane } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import { activityByDay } from '../data/mock'
import { useData } from '../data/DataContext'

export default function Dashboard() {
  const [metric, setMetric] = useState<'flights' | 'hours'>('flights')
  const values = activityByDay.map((d) => d[metric])
  const max = Math.max(...values)

  const { flightLogs, drones, batteries } = useData()
  const readyDrones = drones.filter((d) => d.status === 'Ready').length
  const healthyPacks = batteries.filter((b) => b.condition === 'Good' || b.condition === 'Excellent').length

  return (
    <>
      <Topbar title="Dashboard" />

      <div className="space-y-6 p-8">
        <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {" "}
          <StatCard
            icon={Plane}
            tone="blue"
            value={String(flightLogs.length)}
            label="Total Flights"
            chip="+12"
          />
          <StatCard
            icon={Clock}
            tone="green"
            value={`${drones.reduce((sum, d) => sum + d.airTimeHours, 0).toFixed(1)}h`}
            label="Total Flight Hours"
            chip="+8.2h"
          />
          <StatCard
            icon={Command}
            tone="amber"
            value={String(drones.length)}
            label="Total Drones"
            chip={`${drones.filter((d) => d.status === "In Maintenance").length} in maint.`}
          />
          <StatCard
            icon={BatteryCharging}
            tone="blue"
            value={String(batteries.length)}
            label="Total Batteries"
            chip={`${batteries.filter((b) => b.condition === "Monitor" || b.condition === "Degraded").length} monitor`}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Flight activity
                </h3>
                <p className="text-sm text-slate-500">
                  {metric === "flights" ? "Flights" : "Hours"} per day · last 12
                  days
                </p>
              </div>
              <div className="flex gap-2">
                {(["flights", "hours"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                      metric === m
                        ? "border-blue-100 bg-blue-50 text-brand"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex h-52 items-end gap-3">
              {activityByDay.map((d, i) => (
                <div
                  key={d.label}
                  title={`${d.label}: ${values[i]}`}
                  className={`flex-1 rounded-t-lg ${values[i] === max ? "bg-brand" : "bg-blue-100"}`}
                  style={{ height: `${(values[i] / max) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>{activityByDay[0].label}</span>
              <span>{activityByDay[activityByDay.length - 1].label}</span>
            </div>
          </div>

          <div className="card flex flex-col p-6">
            <h3 className="font-display text-lg font-semibold">
              Fleet readiness
            </h3>
            <p className="text-sm text-slate-500">Drones &amp; batteries</p>

            <div className="mt-5 space-y-4">
              <Meter
                label="Drones ready"
                value={readyDrones}
                total={drones.length}
                color="bg-emerald-500"
              />
              <Meter
                label="Batteries healthy"
                value={healthyPacks}
                total={batteries.length}
                color="bg-brand"
              />
            </div>

            <div className="mt-auto flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              BAT-009 hit 189 cycles, schedule retirement check.
            </div>
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <h3 className="font-display text-lg font-semibold">
              Recent flight logs
            </h3>
            <Link
              to="/flight-logs"
              className="flex items-center gap-1 text-sm font-medium text-brand"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile: card list */}
          <ul className="divide-y divide-slate-100 border-t border-slate-100 md:hidden">
            {flightLogs.slice(0, 5).map((f) => (
              <li key={f.id}>
                <Link
                  to={`/flight-logs/${f.id}`}
                  className="block px-5 py-4 active:bg-slate-50"
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
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="font-medium text-ink">{f.pilot}</span>
                    <span className="truncate">{f.drone}</span>
                    <span className="font-mono">{f.durationMin}m</span>
                    <span className="font-mono">{f.battery}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50/60 text-xs uppercase text-slate-500">
                <tr>
                  {[
                    "Flight",
                    "Pilot",
                    "Drone",
                    "Location",
                    "Duration",
                    "Battery",
                  ].map((h) => (
                    <th key={h} className="px-6 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {flightLogs.slice(0, 5).map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-6 py-3.5 font-semibold">{f.id}</td>
                    <td className="px-6 py-3.5">{f.pilot}</td>
                    <td className="px-6 py-3.5 text-slate-500">{f.drone}</td>
                    <td className="px-6 py-3.5 text-slate-500">{f.location}</td>
                    <td className="px-6 py-3.5">{f.durationMin}m</td>
                    <td className="px-6 py-3.5 text-slate-500">{f.battery}</td>
                    <td className="px-6 py-3.5 text-right">
                      <StatusBadge label={f.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

function Meter({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-slate-500">{value} of {total}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${(value / total) * 100}%` }} />
      </div>
    </div>
  )
}

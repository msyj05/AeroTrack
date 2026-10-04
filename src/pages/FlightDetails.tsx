import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BatteryCharging, Command, Gauge, Map as MapIcon, Paperclip, Pencil, Plane, Thermometer, Timer, Trash2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { batteries, drones, flightLogs } from '../data/mock'

export default function FlightDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const log = flightLogs.find((f) => f.id === id)

  if (!log) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Flight log {id} was not found.</p>
        <Link to="/flight-logs" className="mt-3 inline-block text-brand">Back to flight logs</Link>
      </div>
    )
  }

  const drone = drones.find((d) => d.name === log.drone)
  const battery = batteries.find((b) => b.serial === log.battery)

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title row */}
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

          {/* Action row — stacks under title on mobile, inline on desktop */}
          <div className="flex gap-3">
            <button className="btn flex-1 border border-red-300 bg-white text-red-700 hover:bg-red-50 sm:flex-none">
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button className="btn-dark flex-1 sm:flex-none">
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-5 p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={<Timer className="h-4 w-4" />}
            label="Duration"
            value={`${log.durationMin} min`}
            sub={`${log.start} → ${log.end}`}
          />
          <Metric
            icon={<BatteryCharging className="h-4 w-4" />}
            label="Battery used"
            value="57%"
            sub={`98% → 41% · ${log.battery}`}
          />
          <Metric
            icon={<Thermometer className="h-4 w-4" />}
            label="Temp delta"
            value="+14°C"
            sub="24°C → 38°C"
          />
          <Metric
            icon={<Gauge className="h-4 w-4" />}
            label="Max altitude"
            value="118 m"
            sub="Below 120 m limit"
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Panel
            icon={<Plane className="h-4 w-4" />}
            title="Flight information"
          >
            <Row k="Flight date" v={log.date} />
            <Row k="Reporting time" v="08:50" />
            <Row k="Leaving time" v="09:55" />
            <Row k="Location" v={log.location} />
            <Row k="Purpose" v="Facade inspection B4–B9" />
            <Row k="Flight type" v="VLOS · Commercial" />
          </Panel>

          <Panel icon={<Command className="h-4 w-4" />} title="Drone & pilot">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white">
                <Command className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{log.drone}</p>
                <p className="font-mono text-xs text-slate-400">
                  {drone?.serial}
                </p>
              </div>
              {drone && <StatusBadge label={drone.status} />}
            </div>
            <Row k="Pilot" v={`${log.pilot} · Lic. GVC-2291`} />
            <Row k="Total pilot hours" v="86.5 h" />
            <Row
              k="Airframe hours"
              v={`${drone?.airTimeHours} h · ${drone?.flights} flights`}
            />
          </Panel>

          <Panel icon={<BatteryCharging className="h-4 w-4" />} title="Battery">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">{log.battery}</span>
              {battery && <StatusBadge label={battery.condition} />}
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-brand"
                style={{ width: "41%" }}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Landed at 41% · health {battery?.health}% · {battery?.cycles}{" "}
              cycles
            </p>
            <div className="mt-4">
              <Row k="Model" v={battery?.model ?? ""} />
              <Row k="Temp" v="24°C → 38°C" />
              <Row k="Condition" v="No swelling, nominal" />
            </div>
          </Panel>
        </div>

        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <section className="card p-6">
            <h3 className="font-display font-semibold">Notes</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Light crosswind (8 kt NW) on final approach. Facade grid B4–B9
              captured at 80% overlap. Imagery uploaded to job folder HB-091. No
              airspace conflicts; marina traffic held clear by spotter.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
                <Paperclip className="h-3.5 w-3.5" />
                facade-B4-B9.zip · 412 MB
              </span>
              <span className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
                <MapIcon className="h-3.5 w-3.5" />
                track-log.kml
              </span>
            </div>
          </section>

          <section className="card p-6">
            <h3 className="font-display font-semibold">Record history</h3>
            <ul className="mt-4 space-y-4">
              {[
                ["Created", "Maya Chen · Sep 26, 09:58"],
                ["Reviewed", "Ops Desk · Sep 26, 12:04"],
                ["Synced", "Cloud vault · Sep 26, 12:05"],
              ].map(([t, s]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-brand" />
                  <div>
                    <p className="text-sm font-medium">{t}</p>
                    <p className="text-xs text-slate-500">{s}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

function Metric({ icon, label, value, sub }: { icon: ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="card p-5">
      <p className="flex items-center gap-2 text-xs text-slate-500">{icon}{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
      <p className="mt-1 font-mono text-xs text-slate-500">{sub}</p>
    </div>
  )
}

function Panel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="card p-6">
      <h3 className="mb-4 flex items-center gap-2 font-display font-semibold">{icon}{title}</h3>
      {children}
    </section>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-slate-500">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  )
}

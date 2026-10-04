import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Check, CheckCircle2, ChevronDown, CircleDashed, Command, FileText, Plane, Thermometer, Timer, BatteryCharging } from 'lucide-react'
import { currentUser, drones } from '../data/mock'

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export default function AddFlightLog() {
  const navigate = useNavigate()
  const [f, setF] = useState({
    date: '2026-09-26', location: 'Harbor Yard — Pier 4', reporting: '08:30', leaving: '09:55',
    start: '09:12', end: '', purpose: 'Facade inspection — north elevation, grid B4–B9',
    drone: drones[0].name, pilot: currentUser.name, type: '',
    batterySerial: 'BAT-014', cycles: '86', initialPct: '98', finalPct: '41', initialTemp: '24', finalTemp: '38',
    notes: '', incident: 'No issues to report',
  })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value })

  const endInvalid = f.end !== '' && toMin(f.end) <= toMin(f.start)
  const duration = f.end && !endInvalid ? toMin(f.end) - toMin(f.start) : null
  const tempDelta = Number(f.finalTemp) - Number(f.initialTemp)
  const checks = [
    { label: 'Airspace authorization verified', done: true },
    { label: 'Battery temp within limits', done: tempDelta <= 20 },
    { label: 'End time entered', done: !!f.end && !endInvalid },
    { label: 'Imagery attached (4 files)', done: true },
  ]
  const complete = checks.filter((c) => c.done).length

  return (
    <>
      <header className="border-b border-slate-200/70 bg-white px-4 py-4 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title row */}
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
                Add flight log
              </h1>
              <p className="truncate text-sm text-slate-500">
                Draft autosaved 2 min ago · FL-2482
              </p>
            </div>
          </div>

          {/* Actions row — stacks under title on mobile, inline on desktop */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/flight-logs")}
              className="btn-outline flex-1 sm:flex-none"
            >
              Cancel
            </button>
            <button
              onClick={() => navigate("/flight-logs")}
              className="btn-primary flex-1 sm:flex-none"
            >
              <Check className="h-4 w-4" />
              Save Flight Log
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-4 sm:p-8 xl:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Section
            icon={<Plane className="h-4 w-4 text-brand" />}
            title="Flight information"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Flight date">
                <input
                  type="date"
                  value={f.date}
                  onChange={set("date")}
                  className="input"
                />
              </Field>
              <Field label="Location">
                <input
                  value={f.location}
                  onChange={set("location")}
                  className="input"
                />
              </Field>
              <Field label="Reporting time">
                <input
                  type="time"
                  value={f.reporting}
                  onChange={set("reporting")}
                  className="input"
                />
              </Field>
              <Field label="Leaving time">
                <input
                  type="time"
                  value={f.leaving}
                  onChange={set("leaving")}
                  className="input"
                />
              </Field>
              <Field label="Flight start time">
                <input
                  type="time"
                  value={f.start}
                  onChange={set("start")}
                  className="input"
                />
              </Field>
              <Field label="Flight end time">
                <input
                  type="time"
                  value={f.end}
                  onChange={set("end")}
                  className={`input ${endInvalid ? "border-red-500" : ""}`}
                />
                {endInvalid && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    End time must be after start time
                  </p>
                )}
              </Field>
            </div>
            <Field label="Flight purpose" className="mt-4">
              <input
                value={f.purpose}
                onChange={set("purpose")}
                className="input"
              />
            </Field>
          </Section>

          <Section
            icon={<Command className="h-4 w-4 text-brand" />}
            title="Drone information"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Drone">
                <select
                  value={f.drone}
                  onChange={set("drone")}
                  className="input"
                >
                  {drones.map((d) => (
                    <option key={d.id}>{d.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Pilot">
                <input
                  value={f.pilot}
                  onChange={set("pilot")}
                  className="input"
                />
              </Field>
              <Field label="Flight type">
                <div className="relative">
                  <select
                    value={f.type}
                    onChange={set("type")}
                    className="input appearance-none"
                  >
                    <option value="">Select...</option>
                    <option>VLOS · Commercial</option>
                    <option>BVLOS · Commercial</option>
                    <option>Recreational</option>
                    <option>Training</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-500" />
                </div>
              </Field>
            </div>
          </Section>

          <Section
            icon={<BatteryCharging className="h-4 w-4 text-emerald-600" />}
            title="Battery information"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Battery serial">
                <input
                  value={f.batterySerial}
                  onChange={set("batterySerial")}
                  className="input"
                />
              </Field>
              <Field label="Cycle count">
                <input
                  value={f.cycles}
                  readOnly
                  className="input bg-slate-50 text-slate-500"
                />
              </Field>
              <div className="hidden sm:block" />
              <Field label="Initial battery %">
                <input
                  value={f.initialPct}
                  onChange={set("initialPct")}
                  className="input"
                />
              </Field>
              <Field label="Final battery %">
                <input
                  value={f.finalPct}
                  onChange={set("finalPct")}
                  className="input"
                />
              </Field>
              <div className="hidden sm:block" />
              <Field label="Initial temp">
                <input
                  value={f.initialTemp}
                  onChange={set("initialTemp")}
                  className="input"
                />
              </Field>
              <Field label="Final temp">
                <input
                  value={f.finalTemp}
                  onChange={set("finalTemp")}
                  className="input"
                />
              </Field>
              <div className="flex items-center gap-2 self-end rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Thermometer className="h-4 w-4 shrink-0" />Δ {tempDelta}°C{" "}
                {tempDelta <= 20
                  ? "· within limit, watch on next cycle."
                  : "· above limit, review battery."}
              </div>
            </div>
          </Section>

          <Section
            icon={<FileText className="h-4 w-4 text-slate-600" />}
            title="Additional information"
          >
            <Field label="Notes (optional)">
              <textarea
                rows={3}
                value={f.notes}
                onChange={set("notes")}
                placeholder="Light crosswind on final approach. Imagery uploaded to job folder HB-091."
                className="input resize-none"
              />
            </Field>
            <Field label="Incident / issue (optional)" className="mt-4">
              <select
                value={f.incident}
                onChange={set("incident")}
                className="input"
              >
                <option>No issues to report</option>
                <option>Near miss</option>
                <option>Equipment fault</option>
                <option>Airspace conflict</option>
              </select>
            </Field>
          </Section>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-semibold">Pre-save checklist</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {checks.map((c) => (
                <li
                  key={c.label}
                  className={`flex items-center gap-2 ${c.done ? "" : "text-red-700"}`}
                >
                  {c.done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <CircleDashed className="h-5 w-5 text-red-600" />
                  )}
                  {c.label}
                </li>
              ))}
            </ul>
            <div className="mt-4 h-1.5 rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-emerald-600"
                style={{ width: `${(complete / checks.length) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {complete} of {checks.length} checks complete
            </p>
          </div>

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
                Enter end time to calculate duration, energy used and compliance
                flags.
              </p>
            )}
            {duration !== null && (
              <p className="mt-2 text-xs text-slate-400">
                Battery used: {Number(f.initialPct) - Number(f.finalPct)}%
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Autosave on. Your draft is synced to the ops cloud.
          </div>
        </aside>
      </div>
    </>
  );
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="card p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">{icon}</span>
        <h2 className="font-display text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm text-slate-600">{label}</label>
      {children}
    </div>
  )
}

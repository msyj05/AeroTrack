import type { BatteryCondition, DroneStatus, FlightStatus } from '../../types'

type Label = FlightStatus | DroneStatus | BatteryCondition

const styles: Record<Label, string> = {
  Completed: 'bg-emerald-50 text-emerald-700',
  Ready: 'bg-emerald-50 text-emerald-700',
  Good: 'bg-emerald-50 text-emerald-700',
  Excellent: 'bg-emerald-50 text-emerald-700',
  Incident: 'bg-red-50 text-red-700',
  Grounded: 'bg-red-50 text-red-700',
  Degraded: 'bg-red-50 text-red-700',
  Review: 'bg-amber-50 text-amber-700',
  Monitor: 'bg-amber-50 text-amber-700',
  'In Maintenance': 'bg-amber-50 text-amber-700',
}

export default function StatusBadge({ label }: { label: Label }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[label]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

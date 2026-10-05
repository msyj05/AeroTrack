import DroneMark from './DroneMark'

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
        <DroneMark className="h-6 w-6" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-xl font-semibold text-white">AeroTrack</p>
        <p className="text-xs text-slate-400">Flight Operations</p>
      </div>
    </div>
  )
}
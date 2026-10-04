import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  value: string
  label: string
  chip?: string
  tone: 'blue' | 'green' | 'amber'
}

const tones = {
  blue: 'bg-blue-50 text-brand',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
}

export default function StatCard({ icon: Icon, value, label, chip, tone }: Props) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        {chip && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {chip}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
        {value}
      </p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

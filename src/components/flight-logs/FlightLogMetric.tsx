import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
}

export default function FlightLogMetric({ icon, label, value, sub }: Props) {
  return (
    <div className="card p-4 sm:p-5">
      <p className="flex items-center gap-2 text-xs text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
      <p className="mt-1 font-mono text-xs text-slate-500">{sub}</p>
    </div>
  );
}

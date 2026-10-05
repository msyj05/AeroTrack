import type { ReactNode } from "react";

interface PanelProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function FlightLogPanel({ icon, title, children }: PanelProps) {
  return (
    <section className="card p-4 sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 font-display font-semibold">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Label and value row used inside a FlightLogPanel. */
export function FlightLogRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-slate-500">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}

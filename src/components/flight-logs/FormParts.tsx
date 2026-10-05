import type { ChangeEvent, ReactNode } from "react";
import type { FlightFormState } from "../../types";

/** Shared change handler factory used by every form section. */
export type FlightFormChange = (
  key: keyof FlightFormState,
) => (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
) => void;

export function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="card p-4 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
          {icon}
        </span>
        <h2 className="font-display text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm text-slate-600">{label}</label>
      {children}
    </div>
  );
}

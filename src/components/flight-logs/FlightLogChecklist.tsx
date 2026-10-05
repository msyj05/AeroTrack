import { CheckCircle2, CircleDashed } from "lucide-react";

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export default function FlightLogChecklist({ checks }: { checks: ChecklistItem[] }) {
  const complete = checks.filter((c) => c.done).length;

  return (
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
  );
}

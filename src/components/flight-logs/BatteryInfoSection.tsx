import { BatteryCharging, ChevronDown, Thermometer } from "lucide-react";
import { useData } from "../../data/DataContext";
import type { FlightFormState } from "../../types";
import { Field, Section, type FlightFormChange } from "./FormParts";

interface Props {
  f: FlightFormState;
  set: FlightFormChange;
  tempDelta: number | null;
}

export default function BatteryInfoSection({ f, set, tempDelta }: Props) {
  const { batteries } = useData();

  return (
    <Section
      icon={<BatteryCharging className="h-4 w-4 text-emerald-600" />}
      title="Battery information"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Battery serial">
          <div className="relative">
            <select
              value={f.batterySerial}
              onChange={set("batterySerial")}
              className="input appearance-none"
            >
              {batteries.map((b) => (
                <option key={b.serial} value={b.serial}>
                  {b.serial} — {b.model}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-500" />
          </div>
        </Field>
        <Field label="Cycle count">
          <input
            value={f.cycles}
            readOnly
            placeholder="Auto from battery"
            className="input bg-slate-50 text-slate-500 placeholder:text-slate-400"
          />
        </Field>
        <Field label="Initial battery %">
          <input value={f.initialPct} onChange={set("initialPct")} placeholder="e.g. 98" className="input" />
        </Field>
        <Field label="Final battery %">
          <input value={f.finalPct} onChange={set("finalPct")} placeholder="e.g. 41" className="input" />
        </Field>
        <Field label="Initial temp (°C)">
          <input value={f.initialTemp} onChange={set("initialTemp")} placeholder="e.g. 24" className="input" />
        </Field>
        <Field label="Final temp (°C)">
          <input value={f.finalTemp} onChange={set("finalTemp")} placeholder="e.g. 38" className="input" />
        </Field>
        {tempDelta !== null && (
          <div className="flex items-center gap-2 self-end rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <Thermometer className="h-4 w-4 shrink-0" />Δ {tempDelta}°C{" "}
            {tempDelta <= 20
              ? "· within limit, watch on next cycle."
              : "· above limit, review battery."}
          </div>
        )}
      </div>
    </Section>
  );
}

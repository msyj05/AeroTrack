import { ChevronDown, Command } from "lucide-react";
import { useData } from "../../data/DataContext";
import type { FlightFormState } from "../../types";
import { Field, Section, type FlightFormChange } from "./FormParts";

interface Props {
  f: FlightFormState;
  set: FlightFormChange;
}

export default function DroneInfoSection({ f, set }: Props) {
  const { drones } = useData();

  return (
    <Section
      icon={<Command className="h-4 w-4 text-brand" />}
      title="Drone information"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Drone">
          <select value={f.drone} onChange={set("drone")} className="input">
            {drones.map((d) => (
              <option key={d.id}>{d.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Pilot">
          <input value={f.pilot} onChange={set("pilot")} className="input" />
        </Field>
        <Field label="Flight type">
          <div className="relative">
            <select value={f.type} onChange={set("type")} className="input appearance-none">
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
  );
}

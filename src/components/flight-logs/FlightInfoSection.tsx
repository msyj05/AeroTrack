import { AlertCircle, Plane } from "lucide-react";
import type { FlightFormState } from "../../types";
import { Field, Section, type FlightFormChange } from "./FormParts";

interface Props {
  f: FlightFormState;
  set: FlightFormChange;
  endInvalid: boolean;
}

export default function FlightInfoSection({ f, set, endInvalid }: Props) {
  return (
    <Section
      icon={<Plane className="h-4 w-4 text-brand" />}
      title="Flight information"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Flight date">
          <input type="date" value={f.date} onChange={set("date")} className="input" />
        </Field>
        <Field label="Location">
          <input
            value={f.location}
            onChange={set("location")}
            placeholder="Burma Camp Training Grounds"
            className="input"
          />
        </Field>
        <Field label="Reporting time">
          <input type="time" value={f.reporting} onChange={set("reporting")} className="input" />
        </Field>
        <Field label="Leaving time">
          <input type="time" value={f.leaving} onChange={set("leaving")} className="input" />
        </Field>
        <Field label="Flight start time">
          <input type="time" value={f.start} onChange={set("start")} className="input" />
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
          placeholder="Private soldiers drone training"
          className="input"
        />
      </Field>
    </Section>
  );
}

import { FileText } from "lucide-react";
import type { FlightFormState } from "../../types";
import { Field, Section, type FlightFormChange } from "./FormParts";

interface Props {
  f: FlightFormState;
  set: FlightFormChange;
}

export default function AdditionalInfoSection({ f, set }: Props) {
  return (
    <Section
      icon={<FileText className="h-4 w-4 text-slate-600" />}
      title="Additional information"
    >
      <Field label="Notes (optional)">
        <textarea
          rows={3}
          value={f.notes}
          onChange={set("notes")}
          placeholder="Light crosswind on final approach. Imagery uploaded to job folder HB-091."
          className="input resize-none"
        />
      </Field>
      <Field label="Incident / issue (optional)" className="mt-4">
        <select value={f.incident} onChange={set("incident")} className="input">
          <option>No issues to report</option>
          <option>Near miss</option>
          <option>Equipment fault</option>
          <option>Airspace conflict</option>
        </select>
      </Field>
    </Section>
  );
}

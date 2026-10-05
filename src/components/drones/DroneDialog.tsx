import { useEffect, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { useData } from "../../data/DataContext";
import type { Drone, DroneStatus } from "../../types";
import Modal from "../ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  /** When provided, the dialog runs in edit mode. */
  initialDrone?: Drone;
}

const fullToday = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatLastFlight = (v: string) => {
  if (!v) return fullToday();
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const dateToInputValue = (formatted: string) => {
  const d = new Date(formatted);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function DroneDialog({ open, onClose, initialDrone }: Props) {
  const { drones, addDrone, updateDrone } = useData();
  const isEdit = !!initialDrone;

  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState<DroneStatus>("Ready");
  const [flights, setFlights] = useState("0");
  const [airTimeHours, setAirTimeHours] = useState("0");
  const [lastFlight, setLastFlight] = useState("");
  const [error, setError] = useState("");

  // Sync form state whenever the dialog opens
  useEffect(() => {
    if (!open) return;
    if (initialDrone) {
      setName(initialDrone.name);
      setSerial(initialDrone.serial);
      setStatus(initialDrone.status);
      setFlights(String(initialDrone.flights));
      setAirTimeHours(String(initialDrone.airTimeHours));
      setLastFlight(dateToInputValue(initialDrone.lastFlight));
    } else {
      setName("");
      setSerial("");
      setStatus("Ready");
      setFlights("0");
      setAirTimeHours("0");
      setLastFlight("");
    }
    setError("");
  }, [open, initialDrone]);

  const close = () => onClose();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedSerial = serial.trim();

    if (!trimmedName || !trimmedSerial) {
      setError("Name and serial are required.");
      return;
    }

    // Duplicate check, ignoring the current drone in edit mode
    if (
      drones.some(
        (d) =>
          d.id !== initialDrone?.id &&
          d.serial.toLowerCase() === trimmedSerial.toLowerCase(),
      )
    ) {
      setError("A drone with this serial already exists.");
      return;
    }

    const flightsNum = Number(flights);
    const hoursNum = Number(airTimeHours);

    if (
      !Number.isFinite(flightsNum) ||
      flightsNum < 0 ||
      !Number.isFinite(hoursNum) ||
      hoursNum < 0
    ) {
      setError("Flights and air time must be valid non-negative numbers.");
      return;
    }

    if (isEdit && initialDrone) {
      updateDrone(initialDrone.id, {
        name: trimmedName,
        serial: trimmedSerial,
        status,
        flights: flightsNum,
        airTimeHours: hoursNum,
        lastFlight: formatLastFlight(lastFlight),
      });
    } else {
      const highest = drones.reduce((max, d) => {
        const n = Number(d.id.replace("d", ""));
        return Number.isFinite(n) && n > max ? n : max;
      }, 0);

      const newDrone: Drone = {
        id: `d${highest + 1}`,
        name: trimmedName,
        serial: trimmedSerial,
        status,
        flights: flightsNum,
        airTimeHours: hoursNum,
        lastFlight: formatLastFlight(lastFlight),
      };

      addDrone(newDrone);
    }

    close();
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit drone" : "Add drone"}
      description={
        isEdit
          ? "Update the airframe details and save."
          : "Register a new or in-service airframe."
      }
      maxWidth="max-w-md"
      onClose={close}
      footer={
        <>
          <button onClick={close} className="btn-outline flex-1">
            Cancel
          </button>
          <button
            type="submit"
            form="drone-form"
            className="btn-primary flex-1"
          >
            {isEdit ? "Save changes" : "Add drone"}
          </button>
        </>
      }
    >
      <form id="drone-form" onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-slate-600">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mavic 3 Enterprise"
            className="input"
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-slate-600">Serial</label>
          <input
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="DJI-M3E-88412"
            className="input font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              Total flights
            </label>
            <input
              type="number"
              min="0"
              value={flights}
              onChange={(e) => setFlights(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              Air time (h)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={airTimeHours}
              onChange={(e) => setAirTimeHours(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-slate-600">
            Last flight <span className="text-slate-400">(optional)</span>
          </label>
          <input
            type="date"
            value={lastFlight}
            onChange={(e) => setLastFlight(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-slate-600">Status</label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DroneStatus)}
              className="input appearance-none pr-10"
            >
              <option>Ready</option>
              <option>In Maintenance</option>
              <option>Grounded</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </Modal>
  );
}

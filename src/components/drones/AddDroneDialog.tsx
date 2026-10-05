import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { useData } from "../../data/DataContext";
import type { Drone, DroneStatus } from "../../types";
import Modal from "../ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const fullToday = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/** Convert a yyyy-mm-dd string to "Mon DD, YYYY", or today if empty. */
const formatLastFlight = (v: string) => {
  if (!v) return fullToday();
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function AddDroneDialog({ open, onClose }: Props) {
  const { drones, addDrone } = useData();

  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState<DroneStatus>("Ready");
  const [flights, setFlights] = useState("0");
  const [airTimeHours, setAirTimeHours] = useState("0");
  const [lastFlight, setLastFlight] = useState("");
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setSerial("");
    setStatus("Ready");
    setFlights("0");
    setAirTimeHours("0");
    setLastFlight("");
    setError("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedSerial = serial.trim();

    if (!trimmedName || !trimmedSerial) {
      setError("Name and serial are required.");
      return;
    }

    if (
      drones.some((d) => d.serial.toLowerCase() === trimmedSerial.toLowerCase())
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

    // Next sequential id (d5, d6, ...)
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
    close();
  };

  return (
    <Modal
      open={open}
      title="Add drone"
      description="Register a new or in-service airframe."
      maxWidth="max-w-md"
      onClose={close}
      footer={
        <>
          <button onClick={close} className="btn-outline flex-1">
            Cancel
          </button>
          <button
            type="submit"
            form="add-drone-form"
            className="btn-primary flex-1"
          >
            Add drone
          </button>
        </>
      }
    >
      <form id="add-drone-form" onSubmit={submit} className="space-y-4">
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

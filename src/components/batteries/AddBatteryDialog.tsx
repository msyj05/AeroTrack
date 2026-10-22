import { useEffect, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { useData } from "../../data/DataContext";
import type { Battery, BatteryCondition } from "../../types";
import Modal from "../ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  /** When provided, the dialog runs in edit mode. */
  initialBattery?: Battery;
}

const shortToday = () =>
  new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

const formatLastUsed = (v: string) => {
  if (!v) return shortToday();
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const dateToInputValue = (formatted: string) => {
  const d = new Date(formatted);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function AddBatteryDialog({
  open,
  onClose,
  initialBattery,
}: Props) {
  const { batteries, addBattery, updateBattery } = useData();
  const isEdit = !!initialBattery;

  const [serial, setSerial] = useState("");
  const [model, setModel] = useState("");
  const [cycles, setCycles] = useState("0");
  const [health, setHealth] = useState("100");
  const [flights, setFlights] = useState("0");
  const [condition, setCondition] = useState<BatteryCondition>("Excellent");
  const [lastUsed, setLastUsed] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initialBattery) {
      setSerial(initialBattery.serial);
      setModel(initialBattery.model);
      setCycles(String(initialBattery.cycles));
      setHealth(String(initialBattery.health));
      setFlights(String(initialBattery.flights));
      setCondition(initialBattery.condition);
      setLastUsed(dateToInputValue(initialBattery.lastUsed));
    } else {
      setSerial("");
      setModel("");
      setCycles("0");
      setHealth("100");
      setFlights("0");
      setCondition("Excellent");
      setLastUsed("");
    }
    setError("");
  }, [open, initialBattery]);

  const close = () => onClose();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedSerial = serial.trim();
    const trimmedModel = model.trim();

    if (!trimmedSerial || !trimmedModel) {
      setError("Serial and model are required.");
      return;
    }

    if (
      batteries.some(
        (b) =>
          b.serial !== initialBattery?.serial &&
          b.serial.toLowerCase() === trimmedSerial.toLowerCase(),
      )
    ) {
      setError("A battery with this serial already exists.");
      return;
    }

    const cyclesNum = Number(cycles);
    const healthNum = Number(health);
    const flightsNum = Number(flights);

    if (
      !Number.isFinite(cyclesNum) ||
      cyclesNum < 0 ||
      !Number.isFinite(healthNum) ||
      healthNum < 0 ||
      healthNum > 100 ||
      !Number.isFinite(flightsNum) ||
      flightsNum < 0
    ) {
      setError(
        "Cycles, health and flights must be valid non-negative numbers (health ≤ 100).",
      );
      return;
    }

    const payload = {
      serial: trimmedSerial,
      model: trimmedModel,
      cycles: cyclesNum,
      health: healthNum,
      condition,
      lastUsed: formatLastUsed(lastUsed),
      flights: flightsNum,
    };

    if (isEdit && initialBattery) {
      updateBattery(initialBattery.serial, payload);
    } else {
      addBattery(payload as Battery);
    }

    close();
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit battery" : "Add battery"}
      description={
        isEdit
          ? "Update the battery details and save."
          : "Register a new or in-service battery pack."
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
            form="battery-form"
            className="btn-primary flex-1"
          >
            {isEdit ? "Save changes" : "Add battery"}
          </button>
        </>
      }
    >
      <form id="battery-form" onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-slate-600">Serial</label>
          <input
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="BAT-022"
            className="input font-mono"
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-slate-600">Model</label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="M3E Intelligent"
            className="input"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              Cycles
            </label>
            <input
              type="number"
              min="0"
              value={cycles}
              onChange={(e) => setCycles(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              Health (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={health}
              onChange={(e) => setHealth(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              Flights
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
              Last used <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="date"
              value={lastUsed}
              onChange={(e) => setLastUsed(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-slate-600">
            Condition
          </label>
          <div className="relative">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as BatteryCondition)}
              className="input appearance-none pr-10"
            >
              <option>Excellent</option>
              <option>Good</option>
              <option>Monitor</option>
              <option>Degraded</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </Modal>
  );
}

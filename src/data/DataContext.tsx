import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Battery, Drone, FlightLog } from "../types";
import {
  batteries as seedBatteries,
  drones as seedDrones,
  flightLogs as seedFlightLogs,
} from "./mock";

const STORAGE_KEY = "aerotrack:v1";

interface Store {
  flightLogs: FlightLog[];
  drones: Drone[];
  batteries: Battery[];
}

interface DataCtx extends Store {
  addFlightLog: (log: FlightLog) => void;
  updateFlightLog: (id: string, patch: Partial<FlightLog>) => void;
  deleteFlightLog: (id: string) => void;
  addDrone: (drone: Drone) => void;
  updateDrone: (id: string, patch: Partial<Drone>) => void;
  deleteDrone: (id: string) => void;
  addBattery: (battery: Battery) => void;
  updateBattery: (serial: string, patch: Partial<Battery>) => void;
  deleteBattery: (serial: string) => void;
  reset: () => void;
}

const seed: Store = {
  flightLogs: seedFlightLogs,
  drones: seedDrones,
  batteries: seedBatteries,
};

function loadStore(): Store {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    // Minimal shape check — if anything looks wrong, fall back to seed
    if (
      !Array.isArray(parsed?.flightLogs) ||
      !Array.isArray(parsed?.drones) ||
      !Array.isArray(parsed?.batteries)
    ) {
      return seed;
    }
    return parsed as Store;
  } catch {
    return seed;
  }
}

const DataContext = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(() => loadStore());

  // Persist on every change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Storage full or blocked — silently ignore for now
    }
  }, [store]);

  const addFlightLog = useCallback((log: FlightLog) => {
    setStore((s) => ({ ...s, flightLogs: [log, ...s.flightLogs] }));
  }, []);

  const updateFlightLog = useCallback((id: string, patch: Partial<FlightLog>) => {
    setStore((s) => ({
      ...s,
      flightLogs: s.flightLogs.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  }, []);

  const deleteFlightLog = useCallback((id: string) => {
    setStore((s) => ({
      ...s,
      flightLogs: s.flightLogs.filter((f) => f.id !== id),
    }));
  }, []);

  const addDrone = useCallback((drone: Drone) => {
    setStore((s) => ({ ...s, drones: [drone, ...s.drones] }));
  }, []);

  const updateDrone = useCallback((id: string, patch: Partial<Drone>) => {
    setStore((s) => ({
      ...s,
      drones: s.drones.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  }, []);

  const deleteDrone = useCallback((id: string) => {
    setStore((s) => ({ ...s, drones: s.drones.filter((d) => d.id !== id) }));
  }, []);

  const addBattery = useCallback((battery: Battery) => {
    setStore((s) => ({ ...s, batteries: [battery, ...s.batteries] }));
  }, []);

  const updateBattery = useCallback((serial: string, patch: Partial<Battery>) => {
    setStore((s) => ({
      ...s,
      batteries: s.batteries.map((b) =>
        b.serial === serial ? { ...b, ...patch } : b,
      ),
    }));
  }, []);

  const deleteBattery = useCallback((serial: string) => {
    setStore((s) => ({
      ...s,
      batteries: s.batteries.filter((b) => b.serial !== serial),
    }));
  }, []);

  const reset = useCallback(() => {
    setStore(seed);
  }, []);

  return (
    <DataContext.Provider
      value={{
        ...store,
        addFlightLog,
        updateFlightLog,
        deleteFlightLog,
        addDrone,
        updateDrone,
        deleteDrone,
        addBattery,
        updateBattery,
        deleteBattery,
        reset,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
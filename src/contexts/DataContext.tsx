import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import type { Battery, Drone, FlightLog, User } from "../types";
import { toast } from "sonner";

interface Store {
  flightLogs: FlightLog[];
  drones: Drone[];
  batteries: Battery[];
  loading: boolean;
}

interface DataCtx extends Store {
  user: User;
  addFlightLog: (log: FlightLog) => Promise<boolean>;
  updateFlightLog: (id: string, patch: Partial<FlightLog>) => Promise<void>;
  deleteFlightLog: (id: string) => Promise<void>;
  addDrone: (drone: Drone) => Promise<void>;
  updateDrone: (id: string, patch: Partial<Drone>) => Promise<void>;
  deleteDrone: (id: string) => Promise<void>;
  addBattery: (battery: Battery) => Promise<void>;
  updateBattery: (serial: string, patch: Partial<Battery>) => Promise<void>;
  deleteBattery: (serial: string) => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
  reset: () => void;
}

const DataContext = createContext<DataCtx | null>(null);

function deriveInitials(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const userId = session?.user?.id;

  // Derived user, sourced from the Supabase session (not from the store)
  const user: User = {
    name: (session?.user?.user_metadata?.full_name as string) ?? "",
    email: session?.user?.email ?? "",
    phone: (session?.user?.user_metadata?.phone as string) ?? "",
    photo: session?.user?.user_metadata?.photo as string | undefined,
    initials: deriveInitials(
      (session?.user?.user_metadata?.full_name as string) ??
        session?.user?.email ??
        "?",
    ),
  };

  const [store, setStore] = useState<Store>({
    flightLogs: [],
    drones: [],
    batteries: [],
    loading: true,
  });

  const fetchData = useCallback(async () => {
    if (authLoading) return;

    if (!userId) {
      setStore((s) => ({ ...s, loading: false }));
      return;
    }

    setStore((s) => ({ ...s, loading: true }));

    const [logsRes, dronesRes, batteriesRes] = await Promise.all([
      supabase
        .from("flight_logs")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("drones")
        .select("*")
        .order("created_at", { ascending: true }),
      supabase
        .from("batteries")
        .select("*")
        .order("created_at", { ascending: true }),
    ]);

    const formattedLogs = (logsRes.data || []).map((db) => ({
      ...db,
      id: db.flightId,
      dbId: db.id,
    })) as FlightLog[];

    setStore({
      flightLogs: formattedLogs,
      drones: (dronesRes.data || []) as Drone[],
      batteries: (batteriesRes.data || []) as Battery[],
      loading: false,
    });
  }, [authLoading, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- FLIGHT LOGS ---
  const addFlightLog = async (log: FlightLog) => {
    const { data, error } = await supabase
      .from("flight_logs")
      .insert([
        {
          user_id: userId,
          date: log.date,
          pilot: log.pilot,
          drone: log.drone,
          location: log.location,
          start: log.start,
          end: log.end,
          durationMin: log.durationMin,
          battery: log.battery,
          status: log.status,
          reporting: log.reporting,
          leaving: log.leaving,
          purpose: log.purpose,
          flightType: log.flightType,
          initialPct: log.initialPct,
          finalPct: log.finalPct,
          initialTemp: log.initialTemp,
          finalTemp: log.finalTemp,
          notes: log.notes,
          incident: log.incident,
        },
      ])
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return false;
    }

    if (data) {
      const newLog: FlightLog = { ...log, id: data.flightId, dbId: data.id };
      setStore((s) => ({ ...s, flightLogs: [newLog, ...s.flightLogs] }));
      toast.success("Flight log saved.");
      return true;
    }
    return false;
  };

  const deleteFlightLog = async (id: string) => {
    const log = store.flightLogs.find((l) => l.id === id);
    if (!log || !log.dbId) return;

    const { error } = await supabase
      .from("flight_logs")
      .delete()
      .eq("id", log.dbId);
    if (error) {
      toast.error(error.message);
      return;
    }

    setStore((s) => ({
      ...s,
      flightLogs: s.flightLogs.filter((l) => l.id !== id),
    }));
    toast.success("Flight log deleted.");
  };

  const updateFlightLog = async (id: string, patch: Partial<FlightLog>) => {
    const log = store.flightLogs.find((l) => l.id === id);
    if (!log || !log.dbId) return;

    const { error } = await supabase
      .from("flight_logs")
      .update(patch)
      .eq("id", log.dbId);
    if (error) {
      toast.error(error.message);
      return;
    }

    setStore((s) => ({
      ...s,
      flightLogs: s.flightLogs.map((l) =>
        l.id === id ? { ...l, ...patch } : l,
      ),
    }));
    toast.success("Flight log updated.");
  };

  // --- DRONES ---
  const addDrone = async (drone: Drone) => {
    const { id, ...droneWithoutId } = drone;

    const { data, error } = await supabase
      .from("drones")
      .insert([{ ...droneWithoutId, user_id: userId }])
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      setStore((s) => ({ ...s, drones: [...s.drones, data as Drone] }));
      toast.success("Drone added");
    }
  };

  const deleteDrone = async (id: string) => {
    const { error } = await supabase.from("drones").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }

    setStore((s) => ({ ...s, drones: s.drones.filter((d) => d.id !== id) }));
    toast.success("Drone deleted.");
  };

  const updateDrone = async (id: string, patch: Partial<Drone>) => {
    const { error } = await supabase.from("drones").update(patch).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }

    setStore((s) => ({
      ...s,
      drones: s.drones.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
    toast.success("Drone updated.");
  };

  // --- BATTERIES ---
  const addBattery = async (battery: Battery) => {
    const { data, error } = await supabase
      .from("batteries")
      .insert([{ ...battery, user_id: userId }])
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      setStore((s) => ({ ...s, batteries: [...s.batteries, data as Battery] }));
      toast.success("Battery added successfully.");
    }
  };

  const deleteBattery = async (serial: string) => {
    const { error } = await supabase
      .from("batteries")
      .delete()
      .eq("serial", serial);
    if (error) {
      toast.error(error.message);
      return;
    }

    setStore((s) => ({
      ...s,
      batteries: s.batteries.filter((b) => b.serial !== serial),
    }));
    toast.success("Battery deleted.");
  };

  const updateBattery = async (serial: string, patch: Partial<Battery>) => {
    const { error } = await supabase
      .from("batteries")
      .update(patch)
      .eq("serial", serial);
    if (error) {
      toast.error(error.message);
      return;
    }

    setStore((s) => ({
      ...s,
      batteries: s.batteries.map((b) =>
        b.serial === serial ? { ...b, ...patch } : b,
      ),
    }));
    toast.success("Battery updated.");
  };

  // --- USER ---
  
const updateUser = useCallback(async (patch: Partial<User>) => {
  const metadata: Record<string, unknown> = {};

  if (patch.name !== undefined) metadata.full_name = patch.name;
  if (patch.phone !== undefined) metadata.phone = patch.phone;
  if (patch.photo !== undefined) metadata.photo = patch.photo;

  const { error } = await supabase.auth.updateUser({
    data: metadata,
  });

  if (error) {
    throw error;
  }
}, []);


  const reset = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider
      value={{
        ...store,
        user,
        addFlightLog,
        updateFlightLog,
        deleteFlightLog,
        addDrone,
        updateDrone,
        deleteDrone,
        addBattery,
        updateBattery,
        deleteBattery,
        updateUser,
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

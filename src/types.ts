export type FlightStatus = 'Completed' | 'Incident' | 'Review'
export type DroneStatus = 'Ready' | 'In Maintenance' | 'Grounded'
export type BatteryCondition = 'Excellent' | 'Good' | 'Monitor' | 'Degraded'

export interface FlightLog {
  id: string;
  date: string;
  pilot: string;
  drone: string;
  location: string;
  start: string;
  end: string;
  durationMin: number;
  battery: string;
  status: FlightStatus;
  // new fields
  reporting?: string;
  leaving?: string;
  purpose?: string;
  flightType?: string;
  initialPct?: number;
  finalPct?: number;
  initialTemp?: number;
  finalTemp?: number;
  notes?: string;
  incident?: string;
}

export interface Drone {
  id: string
  name: string
  serial: string
  status: DroneStatus
  flights: number
  airTimeHours: number
  lastFlight: string
}

export interface Battery {
  serial: string
  model: string
  cycles: number
  health: number
  condition: BatteryCondition
  lastUsed: string
  flights: number
}

export interface User {
  name: string
  initials: string
  role: string
  email: string
  phone: string
  license: string
}

/** Raw string values held by the add flight log form */
export interface FlightFormState {
  date: string
  location: string
  reporting: string
  leaving: string
  start: string
  end: string
  purpose: string
  drone: string
  pilot: string
  type: string
  batterySerial: string
  cycles: string
  initialPct: string
  finalPct: string
  initialTemp: string
  finalTemp: string
  notes: string
  incident: string
}

import type { Battery, Drone, FlightLog, User } from '../types'

// --- Date helpers -----------------------------------------------------------
// All mock dates are generated relative to "today" so the seed data always
// looks fresh, whether the user opens the app this week or next year.

const today = new Date()

/** Returns a "Mon DD, YYYY" formatted date N days ago. */
function dayOffset(days: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() - days)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Returns a short "Mon DD" label N days ago (for chart axes). */
function shortDate(days: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() - days)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// --- User -------------------------------------------------------------------

export const currentUser: User = {
  name: 'Maya Chen',
  initials: 'MC',
  role: 'Ops Pilot · Admin',
  email: 'maya.chen@skyops.io',
  phone: '+1 (415) 555-0132',
  license: 'GVC-2291',
}

// --- Flight logs ------------------------------------------------------------
// Spread across the last 6 days, most recent first.

export const flightLogs: FlightLog[] = [
  { id: 'FL-2481', date: dayOffset(0), pilot: 'Maya Chen', drone: 'Mavic 3 Enterprise', location: 'Burma Camp Training Grounds', start: '09:12', end: '09:47', durationMin: 35, battery: 'BAT-014', status: 'Completed' },
  { id: 'FL-2480', date: dayOffset(0), pilot: 'Jonas Weber', drone: 'Matrice 350 RTK', location: 'North Ridge Survey', start: '08:05', end: '08:52', durationMin: 47, battery: 'BAT-007', status: 'Completed' },
  { id: 'FL-2479', date: dayOffset(1), pilot: 'Amara Okafor', drone: 'Mini 4 Pro — Scout 2', location: 'Solar Farm Block C', start: '14:20', end: '14:44', durationMin: 24, battery: 'BAT-021', status: 'Completed' },
  { id: 'FL-2478', date: dayOffset(1), pilot: 'Maya Chen', drone: 'Avata 2 — Indoor 1', location: 'Warehouse Interior', start: '11:02', end: '11:16', durationMin: 14, battery: 'BAT-003', status: 'Incident' },
  { id: 'FL-2477', date: dayOffset(2), pilot: 'Diego Ramos', drone: 'Mavic 3 Enterprise', location: 'Coastal Cliff Path', start: '16:40', end: '17:08', durationMin: 28, battery: 'BAT-014', status: 'Completed' },
  { id: 'FL-2476', date: dayOffset(2), pilot: 'Jonas Weber', drone: 'Matrice 350 RTK', location: 'Quarry East Wall', start: '10:15', end: '10:58', durationMin: 43, battery: 'BAT-009', status: 'Review' },
  { id: 'FL-2475', date: dayOffset(3), pilot: 'Amara Okafor', drone: 'Mini 4 Pro — Scout 2', location: 'Riverbend Bridge', start: '09:30', end: '09:51', durationMin: 21, battery: 'BAT-021', status: 'Completed' },
]

// --- Drones -----------------------------------------------------------------
// Drones don't carry dates in mock form, but lastFlight is relative to today.

export const drones: Drone[] = [
  { id: 'd1', name: 'Mavic 3 Enterprise', serial: 'DJI-M3E-88412', status: 'Ready', flights: 142, airTimeHours: 68.4, lastFlight: dayOffset(0) },
  { id: 'd2', name: 'Matrice 350 RTK', serial: 'DJI-M350-20177', status: 'In Maintenance', flights: 89, airTimeHours: 74.1, lastFlight: dayOffset(0) },
  { id: 'd3', name: 'Mini 4 Pro — Scout 2', serial: 'DJI-MN4-55201', status: 'Ready', flights: 211, airTimeHours: 52.6, lastFlight: dayOffset(1) },
  { id: 'd4', name: 'Avata 2 — Indoor 1', serial: 'DJI-AV2-31045', status: 'Grounded', flights: 64, airTimeHours: 18.2, lastFlight: dayOffset(1) },
]

// --- Batteries --------------------------------------------------------------
// lastUsed is a short label ("Mon DD"), generated from the same offset helper.

export const batteries: Battery[] = [
  { serial: 'BAT-014', model: 'M3E Intelligent', cycles: 86, health: 92, condition: 'Good', lastUsed: shortDate(0), flights: 118 },
  { serial: 'BAT-007', model: 'TB65 Intelligent', cycles: 143, health: 84, condition: 'Good', lastUsed: shortDate(0), flights: 132 },
  { serial: 'BAT-021', model: 'Mini 4 Plus', cycles: 54, health: 96, condition: 'Excellent', lastUsed: shortDate(1), flights: 61 },
  { serial: 'BAT-009', model: 'TB65 Intelligent', cycles: 189, health: 71, condition: 'Monitor', lastUsed: shortDate(2), flights: 176 },
  { serial: 'BAT-003', model: 'Avata 2 Pack', cycles: 112, health: 62, condition: 'Degraded', lastUsed: shortDate(1), flights: 98 },
]

// --- Flight activity (dashboard chart) --------------------------------------
// Last 12 days, oldest → newest. `days` counts backwards from today.

export const activityByDay = Array.from({ length: 12 }, (_, i) => {
  const daysAgo = 11 - i
  // Deterministic pseudo-random so the chart is stable across reloads
  const seed = daysAgo * 7 + 3
  const flights = 9 + (seed % 15)
  const hours = Math.round((flights * 0.78) * 10) / 10
  return { label: shortDate(daysAgo), flights, hours }
})
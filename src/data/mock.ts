import type { Battery, Drone, FlightLog, User } from '../types'

export const currentUser: User = {
  name: 'Maya Chen',
  initials: 'MC',
  role: 'Ops Pilot · Admin',
  email: 'maya.chen@skyops.io',
  phone: '+1 (415) 555-0132',
  license: 'GVC-2291',
}

export const flightLogs: FlightLog[] = [
  { id: 'FL-2481', date: 'Sep 26, 2026', pilot: 'Maya Chen', drone: 'Mavic 3 Enterprise', location: 'Harbor Yard — Pier 4', start: '09:12', end: '09:47', durationMin: 35, battery: 'BAT-014', status: 'Completed' },
  { id: 'FL-2480', date: 'Sep 26, 2026', pilot: 'Jonas Weber', drone: 'Matrice 350 RTK', location: 'North Ridge Survey', start: '08:05', end: '08:52', durationMin: 47, battery: 'BAT-007', status: 'Completed' },
  { id: 'FL-2479', date: 'Sep 25, 2026', pilot: 'Amara Okafor', drone: 'Mini 4 Pro — Scout 2', location: 'Solar Farm Block C', start: '14:20', end: '14:44', durationMin: 24, battery: 'BAT-021', status: 'Completed' },
  { id: 'FL-2478', date: 'Sep 25, 2026', pilot: 'Maya Chen', drone: 'Avata 2 — Indoor 1', location: 'Warehouse Interior', start: '11:02', end: '11:16', durationMin: 14, battery: 'BAT-003', status: 'Incident' },
  { id: 'FL-2477', date: 'Sep 24, 2026', pilot: 'Diego Ramos', drone: 'Mavic 3 Enterprise', location: 'Coastal Cliff Path', start: '16:40', end: '17:08', durationMin: 28, battery: 'BAT-014', status: 'Completed' },
  { id: 'FL-2476', date: 'Sep 24, 2026', pilot: 'Jonas Weber', drone: 'Matrice 350 RTK', location: 'Quarry East Wall', start: '10:15', end: '10:58', durationMin: 43, battery: 'BAT-009', status: 'Review' },
  { id: 'FL-2475', date: 'Sep 23, 2026', pilot: 'Amara Okafor', drone: 'Mini 4 Pro — Scout 2', location: 'Riverbend Bridge', start: '09:30', end: '09:51', durationMin: 21, battery: 'BAT-021', status: 'Completed' },
]

export const drones: Drone[] = [
  { id: 'd1', name: 'Mavic 3 Enterprise', serial: 'DJI-M3E-88412', status: 'Ready', flights: 142, airTimeHours: 68.4, lastFlight: 'Sep 26, 2026' },
  { id: 'd2', name: 'Matrice 350 RTK', serial: 'DJI-M350-20177', status: 'In Maintenance', flights: 89, airTimeHours: 74.1, lastFlight: 'Sep 26, 2026' },
  { id: 'd3', name: 'Mini 4 Pro — Scout 2', serial: 'DJI-MN4-55201', status: 'Ready', flights: 211, airTimeHours: 52.6, lastFlight: 'Sep 25, 2026' },
  { id: 'd4', name: 'Avata 2 — Indoor 1', serial: 'DJI-AV2-31045', status: 'Grounded', flights: 64, airTimeHours: 18.2, lastFlight: 'Sep 25, 2026' },
]

export const batteries: Battery[] = [
  { serial: 'BAT-014', model: 'M3E Intelligent', cycles: 86, health: 92, condition: 'Good', lastUsed: 'Sep 26', flights: 118 },
  { serial: 'BAT-007', model: 'TB65 Intelligent', cycles: 143, health: 84, condition: 'Good', lastUsed: 'Sep 26', flights: 132 },
  { serial: 'BAT-021', model: 'Mini 4 Plus', cycles: 54, health: 96, condition: 'Excellent', lastUsed: 'Sep 25', flights: 61 },
  { serial: 'BAT-009', model: 'TB65 Intelligent', cycles: 189, health: 71, condition: 'Monitor', lastUsed: 'Sep 24', flights: 176 },
  { serial: 'BAT-003', model: 'Avata 2 Pack', cycles: 112, health: 62, condition: 'Degraded', lastUsed: 'Sep 25', flights: 98 },
]

export const activityByDay = [
  { label: 'Sep 15', flights: 9, hours: 7.1 },
  { label: 'Sep 16', flights: 14, hours: 11.4 },
  { label: 'Sep 17', flights: 11, hours: 8.2 },
  { label: 'Sep 18', flights: 17, hours: 14.0 },
  { label: 'Sep 19', flights: 15, hours: 12.3 },
  { label: 'Sep 20', flights: 20, hours: 16.8 },
  { label: 'Sep 21', flights: 10, hours: 7.9 },
  { label: 'Sep 22', flights: 19, hours: 15.2 },
  { label: 'Sep 23', flights: 16, hours: 12.6 },
  { label: 'Sep 24', flights: 23, hours: 18.9 },
  { label: 'Sep 25', flights: 18, hours: 14.5 },
  { label: 'Sep 26', flights: 14, hours: 11.0 },
]

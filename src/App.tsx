import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import FlightLogs from './pages/FlightLogs'
import AddFlightLog from './pages/AddFlightLog'
import FlightDetails from './pages/FlightDetails'
import Drones from './pages/Drones'
import Batteries from './pages/Batteries'
import Settings from './pages/Settings'
import EditFlightLog from "./pages/EditFlightLog";
import DroneDetails from "./pages/DroneDetails";
import BatteryDetails from './pages/BatteryDetails'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flight-logs" element={<FlightLogs />} />
        <Route path="/flight-logs/new" element={<AddFlightLog />} />
        <Route path="/flight-logs/:id/edit" element={<EditFlightLog />} />
        <Route path="/flight-logs/:id" element={<FlightDetails />} />
        <Route path="/drones" element={<Drones />} />
        <Route path="/drones/:id" element={<DroneDetails />} />
        <Route path="/batteries" element={<Batteries />} />
        <Route path="/batteries/:serial" element={<BatteryDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

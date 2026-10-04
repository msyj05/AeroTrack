import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import FlightLogs from './pages/FlightLogs'
import AddFlightLog from './pages/AddFlightLog'
import FlightDetails from './pages/FlightDetails'
import Drones from './pages/Drones'
import Batteries from './pages/Batteries'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flight-logs" element={<FlightLogs />} />
        <Route path="/flight-logs/new" element={<AddFlightLog />} />
        <Route path="/flight-logs/:id" element={<FlightDetails />} />
        <Route path="/drones" element={<Drones />} />
        <Route path="/batteries" element={<Batteries />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

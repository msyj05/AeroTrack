import { Link, useParams } from "react-router-dom";
import { useData } from "../data/DataContext";
import FlightLogForm from "../components/flight-logs/FlightLogForm";

export default function EditFlightLog() {
  const { id } = useParams();
  const { flightLogs } = useData();
  const log = flightLogs.find((f) => f.id === id);

  if (!log) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Flight log {id} was not found.</p>
        <Link to="/flight-logs" className="mt-3 inline-block text-brand">
          Back to flight logs
        </Link>
      </div>
    );
  }

  return <FlightLogForm initialLog={log} />;
}
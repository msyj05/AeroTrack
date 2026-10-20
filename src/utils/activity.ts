import type { FlightLog } from "../types";

export function computeActivityByDay(flightLogs: FlightLog[], days = 12) {
  return Array.from({ length: days }, (_, i) => {
    const daysAgo = days - 1 - i;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(0, 0, 0, 0);

    const next = new Date(d);
    next.setDate(next.getDate() + 1);

    const logsThatDay = flightLogs.filter((f) => {
      const logDate = new Date(f.date);
      if (Number.isNaN(logDate.getTime())) return false;
      return logDate >= d && logDate < next;
    });

    const flights = logsThatDay.length;
    const hours = logsThatDay.reduce((sum, f) => sum + f.durationMin, 0) / 60;

    return {
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      flights,
      hours: Math.round(hours * 10) / 10,
    };
  });
}

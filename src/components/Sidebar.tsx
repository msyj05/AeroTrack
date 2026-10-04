
import { NavLink } from "react-router-dom";
import {
  BatteryCharging,
  Command,
  LayoutDashboard,
  LogOut,
  Plane,
  Settings,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { currentUser } from "../data/mock";
import { useSidebar } from "./SidebarContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/flight-logs", label: "Flight Logs", icon: Plane, badge: 248 },
  { to: "/drones", label: "Drones", icon: Command },
  { to: "/batteries", label: "Batteries", icon: BatteryCharging },
  { to: "/settings", label: "Profile / Settings", icon: Settings },
];

export default function Sidebar() {
  const { open, setOpen, setConfirmLogout } = useSidebar();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-dvh w-60 shrink-0 flex-col bg-navy px-3 py-5 transition-transform duration-200 ease-out
    lg:sticky lg:top-0 lg:translate-x-0
    ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between px-2">
        <Logo />
        <button
          onClick={() => setOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-navy-light hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-navy-line bg-navy-light px-3 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-brand">
          {currentUser.initials}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium text-white">{currentUser.name}</p>
          <p className="text-xs text-slate-400">{currentUser.role}</p>
        </div>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-brand font-medium text-white"
                  : "text-slate-400 hover:bg-navy-light hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{label}</span>
            {badge !== undefined && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setConfirmLogout(true)}
        className="mt-3 flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-navy-light hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}

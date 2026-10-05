import type { ReactNode } from "react";
import DroneMark from "../ui/DroneMark";

/** Split layout used by Login and SignUp. Drop your hero photo at public/auth-bg.jpg */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Desktop left panel — unchanged */}
      <div
        className="relative hidden flex-col justify-between bg-navy bg-cover bg-center p-10 text-white lg:flex"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(11,20,36,0.55), rgba(11,20,36,0.85)), url('/auth-bg.jpg')",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand">
            <DroneMark className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-2xl font-semibold">AeroTrack</p>
            <p className="text-sm text-slate-300">Flight Operations System</p>
          </div>
        </div>

        <h2 className="font-display text-5xl font-semibold leading-tight">
          Every flight, logged.
          <br />
          Every battery, tracked.
        </h2>

        <p className="text-sm text-slate-300">© 2026 AeroTrack Ops</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-col bg-slate-50">
        {/* Mobile-only hero banner */}
        <div
          className="relative flex h-56 flex-col justify-between bg-navy bg-cover bg-center p-5 text-white sm:h-64 lg:hidden"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(11,20,36,0.45) 0%, rgba(11,20,36,0.85) 100%), url('/auth-bg.jpg')",
          }}
        >
          {/* Brand lockup — top-left */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand">
              <DroneMark className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-xl font-semibold">AeroTrack</p>
              <p className="text-xs text-slate-300">Flight Operations System</p>
            </div>
          </div>

          {/* Tagline — bottom */}
          <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
            Every flight, logged.
            <br />
            Every battery, tracked.
          </h2>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

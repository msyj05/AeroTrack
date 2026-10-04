import { useState, type FormEvent } from 'react'
import { ChevronDown, ShieldCheck } from 'lucide-react'
import Topbar from '../components/Topbar'
import { currentUser } from '../data/mock'

export default function Settings() {
  const [profile, setProfile] = useState({ name: currentUser.name, role: 'Admin · Pilot', phone: currentUser.phone })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [msg, setMsg] = useState('')

  const meetsPolicy = pw.next.length >= 12
  const mismatch = pw.confirm !== '' && pw.next !== pw.confirm

  const saveProfile = (e: FormEvent) => { e.preventDefault(); setMsg('Profile saved.') }
  const savePassword = (e: FormEvent) => {
    e.preventDefault()
    if (!meetsPolicy || mismatch) return
    setPw({ current: '', next: '', confirm: '' })
    setMsg('Password updated.')
  }

  return (
    <>
      <Topbar title="Profile / Settings" />
      <div className="max-w-3xl space-y-6 p-4 sm:p-8">
        {msg && (
          <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            {msg}
          </p>
        )}

        <form onSubmit={saveProfile} className="card p-6">
          <h2 className="font-display text-lg font-semibold">
            Profile information
          </h2>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Avatar + Change photo: side by side on mobile */}
            <div className="flex items-center justify-between gap-4 sm:contents">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg font-semibold text-white">
                {currentUser.initials}
              </div>
              <button type="button" className="btn-outline shrink-0 sm:hidden">
                Change photo
              </button>
            </div>

            <div className="min-w-0 sm:flex-1">
              <p className="font-medium">{profile.name}</p>
              <p className="text-sm text-slate-500">
                Ops Pilot · License {currentUser.license}
              </p>
            </div>

            {/* Change photo (desktop only) */}
            <button type="button" className="btn-outline hidden sm:inline-flex">
              Change photo
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm">Full name</label>
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm">Email</label>
              <input
                value={currentUser.email}
                readOnly
                className="input bg-slate-50 text-slate-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm">Role</label>
              <div className="relative">
                <select
                  value={profile.role}
                  onChange={(e) =>
                    setProfile({ ...profile, role: e.target.value })
                  }
                  className="input appearance-none"
                >
                  <option>Admin · Pilot</option>
                  <option>Pilot</option>
                  <option>Ops Desk</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm">Phone</label>
              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="input"
              />
            </div>
          </div>
          <button type="submit" className="btn-dark mt-5">
            Save changes
          </button>
        </form>

        <form onSubmit={savePassword} className="card p-6">
          <h2 className="font-display text-lg font-semibold">
            Password &amp; security
          </h2>
          <p className="text-sm text-slate-500">Last changed 42 days ago </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {(["current", "next", "confirm"] as const).map((k) => (
              <div key={k}>
                <label className="mb-1.5 block text-sm capitalize">
                  {k === "next" ? "New" : k}
                </label>
                <input
                  type="password"
                  value={pw[k]}
                  onChange={(e) => setPw({ ...pw, [k]: e.target.value })}
                  className="input"
                />
              </div>
            ))}
          </div>
          {mismatch && (
            <p className="mt-3 text-sm text-red-600">Passwords do not match.</p>
          )}
          <div className="mt-5 flex items-center gap-4">
            <button type="submit" className="btn-primary">
              Update password
            </button>
            <span
              className={`flex items-center gap-1.5 text-xs ${meetsPolicy ? "text-emerald-700" : "text-slate-500"}`}
            >
              <ShieldCheck className="h-4 w-4" />
              {meetsPolicy
                ? "Meets 12 char policy"
                : "Use at least 12 characters"}
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

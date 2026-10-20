import {
  useRef,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import Topbar from "../components/layout/Topbar";
import { useData } from "../data/DataContext";
import { toast } from "sonner";

export default function Settings() {
  const { user, updateUser } = useData();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: user.name,
    phone: user.phone,
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  const meetsPolicy = pw.next.length >= 10;
  const mismatch = pw.confirm !== "" && pw.next !== pw.confirm;
  const missingCurrent = pw.current === "" && pw.next !== "";

  const saveProfile = (e: FormEvent) => {
  e.preventDefault();
  updateUser({ name: profile.name, phone: profile.phone });
  toast.success("Profile saved.");
};

  const savePassword = (e: FormEvent) => {
    e.preventDefault();
    if (!pw.current) return toast.error("Enter your current password.");
    if (!meetsPolicy)
      return toast.error("Password must be at least 10 characters.");
    if (mismatch) return toast.error("Passwords do not match.");
    setPw({ current: "", next: "", confirm: "" });
    toast.success("Password updated.");
  };

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateUser({ photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const avatar = user.photo ? (
    <img
      src={user.photo}
      alt={user.name}
      className="h-16 w-16 shrink-0 rounded-full object-cover"
    />
  ) : (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg font-semibold text-white">
      {user.initials}
    </div>
  );

  return (
    <>
      <Topbar title="Profile / Settings" />
      <div className="max-w-3xl space-y-6 p-4 sm:p-8">
        
        <form onSubmit={saveProfile} className="card p-6">
          <h2 className="font-display text-lg font-semibold">
            Profile information
          </h2>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between gap-4 sm:contents">
              {avatar}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="btn-outline shrink-0 sm:hidden"
              >
                Change photo
              </button>
            </div>

            <div className="min-w-0 sm:flex-1">
              <p className="font-medium">{profile.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-outline hidden sm:inline-flex"
            >
              Change photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
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
                value={user.email}
                readOnly
                className="input bg-slate-50 text-slate-500"
              />
            </div>
            <div className="sm:col-span-2">
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
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {(["current", "next", "confirm"] as const).map((k) => (
              <div key={k}>
                <label className="mb-1.5 block text-sm">
                  {k === "current"
                    ? "Current Password"
                    : k === "next"
                      ? "New Password"
                      : "Confirm Password"}
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

          {/* Validation hints */}
          {missingCurrent && (
            <p className="mt-3 text-sm text-amber-600">
              Please enter your current password.
            </p>
          )}
          {!meetsPolicy && pw.next !== "" && (
            <p className="mt-3 text-sm text-slate-500">
              Password must be at least 10 characters ({pw.next.length}/10).
            </p>
          )}
          {mismatch && (
            <p className="mt-3 text-sm text-red-600">Passwords do not match.</p>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={!meetsPolicy || mismatch || missingCurrent}
              className="btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
            >
              Update password
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

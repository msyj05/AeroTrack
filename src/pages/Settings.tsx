import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../data/AuthContext";
import Topbar from "../components/layout/Topbar";
import { useData } from "../data/DataContext";
import { toast } from "sonner";

export default function Settings() {
  const { user, updateUser } = useData();
  const { user: authUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: user.name,
    phone: user.phone,
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    setProfile({ name: user.name, phone: user.phone });
  }, [user.name, user.phone]);

  const meetsPolicy = pw.next.length >= 10;
  const mismatch = pw.confirm !== "" && pw.next !== pw.confirm;
  const missingCurrent = pw.current === "" && pw.next !== "";

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({ name: profile.name, phone: profile.phone });
      toast.success("Profile saved.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save profile.",
      );
    }
  };

  const savePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!pw.current) return toast.error("Enter your current password.");
    if (!meetsPolicy)
      return toast.error("Password must be at least 10 characters.");
    if (mismatch) return toast.error("Passwords do not match.");

    setPwLoading(true);

    // 1. Verify the current password by re-authenticating.
    const email = authUser?.email;
    if (!email) {
      setPwLoading(false);
      return toast.error("Could not read your account email.");
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pw.current,
    });

    if (authError) {
      setPwLoading(false);
      // Do NOT clear the fields — let the user retype the current password.
      return toast.error("Current password is incorrect.");
    }

    // 2. Update to the new password.
    const { error: updateError } = await supabase.auth.updateUser({
      password: pw.next,
    });

    setPwLoading(false);

    if (updateError) return toast.error(updateError.message);

    // Clear only on success
    setPw({ current: "", next: "", confirm: "" });
    toast.success("Password updated.");
  };

  const handlePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB.");
      return;
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${authUser.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?v=${Date.now()}`;

    await updateUser({ photo: url });
    toast.success("Photo updated.");
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
              disabled={!meetsPolicy || mismatch || missingCurrent || pwLoading}
              className="btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pwLoading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

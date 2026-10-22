import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import AuthShell from "../components/auth/AuthShell";
import { toast } from "sonner";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // The Supabase client parses the recovery token from the URL hash on load.
    // Check whether a session exists now, or set up a listener for when it does.
    let cancelled = false;

    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setReady(true);
      } else {
        // Give the SDK a moment to process the hash token — it's async
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === "PASSWORD_RECOVERY" && session) {
              setReady(true);
              subscription.unsubscribe();
            }
          },
        );
        // If no session shows up in 5 seconds, the link is bad/expired
        setTimeout(() => {
          if (!cancelled) {
            setInvalid(true);
            subscription.unsubscribe();
          }
        }, 5000);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const meetsPolicy = pw.next.length >= 10;
  const mismatch = pw.confirm !== "" && pw.next !== pw.confirm;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!meetsPolicy)
      return toast.error("Password must be at least 10 characters.");
    if (mismatch) return toast.error("Passwords do not match.");

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw.next });
    setLoading(false);

    if (error) return toast.error(error.message);

    toast.success("Password updated. Please log in.");
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (invalid) {
    return (
      <AuthShell>
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold">
            Link expired or invalid
          </h1>
          <p className="mt-3 text-slate-600">
            This password reset link can only be used once, and it expires after
            a while. Request a new one.
          </p>
          <Link to="/forgot-password" className="btn-primary mt-8 w-full py-3">
            Request new link
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (!ready) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="mt-4 text-sm text-slate-500">
            Verifying your reset link...
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <form onSubmit={onSubmit}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <KeyRound className="h-7 w-7 text-brand" />
        </div>
        <h1 className="mt-6 text-center font-display text-3xl font-semibold">
          Set a new password
        </h1>
        <p className="mt-3 text-center text-slate-600">
          Choose a strong password. You'll use it to log in next time.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              New password
            </label>
            <input
              type="password"
              required
              value={pw.next}
              onChange={(e) => setPw({ ...pw, next: e.target.value })}
              className="input py-3"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Confirm password
            </label>
            <input
              type="password"
              required
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              className="input py-3"
            />
          </div>
        </div>

        {!meetsPolicy && pw.next !== "" && (
          <p className="mt-3 text-sm text-slate-500">
            Password must be at least 10 characters ({pw.next.length}/10).
          </p>
        )}
        {mismatch && (
          <p className="mt-3 text-sm text-red-600">Passwords do not match.</p>
        )}

        <button
          type="submit"
          disabled={!meetsPolicy || mismatch || loading}
          className="btn-primary mt-6 w-full py-3 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
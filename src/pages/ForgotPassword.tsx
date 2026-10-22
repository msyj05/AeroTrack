import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound } from "lucide-react";
import { supabase } from "../lib/supabase";
import AuthShell from "../components/auth/AuthShell";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <Mail className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold">
            Check your email
          </h1>
          <p className="mt-3 text-slate-600">
            We sent a password reset link to{" "}
            <span className="font-medium text-ink">{email}</span>.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Click the link to set a new password. Check spam if it doesn't
            arrive within a minute.
          </p>
          <Link to="/login" className="btn-primary mt-8 w-full py-3">
            Back to log in
          </Link>
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
          Reset your password
        </h1>
        <p className="mt-3 text-center text-slate-600">
          Enter your account email and we'll send you a reset link.
        </p>

        <label className="mt-8 block text-sm font-medium">Email address</label>
        <div className="relative mt-1.5">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input py-3 pl-10"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full py-3 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        <p className="mt-5 text-sm text-slate-600">
          Remembered it?{" "}
          <Link to="/login" className="text-brand hover:underline">
            Back to log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

import { supabase } from "../lib/supabase";
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail } from 'lucide-react'
import AuthShell from '../components/auth/AuthShell'
import { toast } from "sonner";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password.length < 10)
      return setError("Password must be at least 10 characters.");
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/login`, // where the email link lands
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setPendingEmail(form.email);
  };

  const Eyeball = (
    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-label="Toggle password visibility">
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  )

  if (pendingEmail) {
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
            We sent a verification link to{" "}
            <span className="font-medium text-ink">{pendingEmail}</span>. Click
            it to activate your AeroTrack account.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Didn't get it? Check spam, or{" "}
            <button
              onClick={async () => {
                const { error } = await supabase.auth.resend({
                  type: "signup",
                  email: pendingEmail,
                  options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                  },
                });
                if (error) toast.error(error.message);
                else toast.success("Verification email resent.");
              }}
              className="text-brand hover:underline"
            >
              resend the email
            </button>
            .
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
        <h1 className="font-display text-4xl font-semibold">Create account</h1>

        <label className="mt-8 block text-sm font-medium">Full name</label>
        <input required value={form.name} onChange={set('name')} placeholder="Enter your full name" className="input mt-1.5 py-3" />

        <label className="mt-5 block text-sm font-medium">Email</label>
        <div className="relative mt-1.5">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="email" required value={form.email} onChange={set('email')} placeholder="Enter your email" className="input py-3 pl-10" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative mt-1.5">
              <input type={show ? 'text' : 'password'} required value={form.password} onChange={set('password')} placeholder="Enter password" className="input py-3 pr-10" />
              {Eyeball}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <div className="relative mt-1.5">
              <input type={show ? 'text' : 'password'} required value={form.confirm} onChange={set('confirm')} placeholder="Confirm password" className="input py-3 pr-10" />
              {Eyeball}
            </div>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full py-3 disabled:opacity-30">
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-5 text-sm text-slate-600">
          By signing up you agree to the Terms &amp; Aviation Data Policy.{' '}
          <Link to="/login" className="text-brand hover:underline">Log in</Link>
        </p>
      </form>
    </AuthShell>
  )
}

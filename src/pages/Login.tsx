import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, KeyRound, Mail } from 'lucide-react'
import AuthShell from '../components/AuthShell'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)

  // Mock only: real authentication comes with the backend
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <AuthShell>
      <form onSubmit={onSubmit}>
        <h1 className="text-center font-display text-4xl font-semibold">Welcome back</h1>
        <p className="mt-3 text-center text-slate-600">
          Sign in to access flight logs, fleet status and compliance reports.
        </p>

        <label className="mt-8 block text-sm font-medium">Email address</label>
        <div className="relative mt-1.5">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="input py-3 pl-10" />
        </div>

        <label className="mt-5 block text-sm font-medium">Password</label>
        <div className="relative mt-1.5">
          <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type={show ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="input py-3 pl-10 pr-10" />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-label="Toggle password visibility">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded accent-brand" />
            Remember me
          </label>
          <a href="#" className="text-brand hover:underline">Forgot password?</a>
        </div>

        <button type="submit" className="btn-primary mt-6 w-full py-3">
          Log in to operations
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-5 text-sm text-slate-600">
          New to AeroTrack?{' '}
          <Link to="/signup" className="text-brand hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  )
}

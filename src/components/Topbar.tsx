import { Bell, Menu, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSidebar } from './SidebarContext'

interface Props {
  title: string
  hideAction?: boolean
}

export default function Topbar({ title, hideAction }: Props) {
  const { setOpen } = useSidebar()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4 text-ink" />
        </button>
        <div>
          <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Search logs, drones, pilots..."
          />
          <kbd className="rounded border border-slate-200 bg-white px-1.5 text-xs text-slate-500">
            K
          </kbd>
        </label>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
          <Bell className="h-4 w-4 text-ink" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand" />
        </button>

        {!hideAction && (
          <Link to="/flight-logs/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Flight Log</span>
            <span className="sm:hidden">Log</span>
          </Link>
        )}
      </div>
    </header>
  );
}
import { Menu } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'

interface Props {
  title: string
}

export default function Topbar({ title }: Props) {
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
    </header>
  );
}
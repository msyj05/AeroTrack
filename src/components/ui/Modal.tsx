import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description?: string;
  /** Max width class for the panel. Defaults to `max-w-sm` (matches ConfirmDialog). */
  maxWidth?: string;
  onClose: () => void;
  children: ReactNode;
  /** Buttons row rendered at the bottom of the panel. */
  footer?: ReactNode;
}

export default function Modal({
  open,
  title,
  description,
  maxWidth = "max-w-sm",
  onClose,
  children,
  footer,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`card w-full ${maxWidth} max-h-[calc(100dvh-2rem)] overflow-y-auto p-5 sm:p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="modal-title" className="font-display text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {description && (
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        )}

        <div className="mt-4">{children}</div>

        {footer && <div className="mt-5 flex gap-3">{footer}</div>}
      </div>
    </div>
  );
}
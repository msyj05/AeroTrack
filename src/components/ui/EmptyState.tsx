import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Optional action button or link rendered below the description. */
  action?: ReactNode;
  /** Tighter spacing for use inside cards with limited room. */
  compact?: boolean;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 text-center ${
        compact ? "py-8" : "py-12 sm:py-16"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 ${
          compact ? "h-12 w-12" : "h-14 w-14"
        }`}
      >
        <Icon className={compact ? "h-6 w-6" : "h-7 w-7"} />
      </div>
      <h3
        className={`mt-4 font-display font-semibold text-ink ${
          compact ? "text-base" : "text-lg"
        }`}
      >
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
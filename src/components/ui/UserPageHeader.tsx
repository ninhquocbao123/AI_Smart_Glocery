import type { ReactNode } from "react";

interface UserPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function UserPageHeader({
  eyebrow,
  title,
  description,
  action,
}: UserPageHeaderProps) {
  return (
    <header data-page-intro className="flex flex-wrap items-center justify-between gap-6 p-6 sm:p-7 bg-white border border-slate-200/90 rounded-2xl shadow-sm mb-6">
      <div className="space-y-1.5 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          {eyebrow}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed pt-0.5">
          {description}
        </p>
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </header>
  );
}

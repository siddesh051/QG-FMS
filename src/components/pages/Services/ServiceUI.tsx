import React, { ReactNode } from 'react';

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
        checked ? 'bg-[#1e3a8a]' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-[19px]' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function StatusPill({ label, tone }: { label: string; tone: 'green' | 'gray' | 'amber' }) {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700',
    gray: 'bg-slate-100 text-slate-600',
    amber: 'bg-amber-50 text-amber-700',
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${styles}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function ServiceHeader({
  icon,
  title,
  status,
  enabled,
  onToggle,
}: {
  icon: ReactNode;
  title: string;
  status: { label: string; tone: 'green' | 'gray' | 'amber' };
  enabled: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <span className="text-[#1e3a8a]">{icon}</span>
        <h1 className="text-base font-bold text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <StatusPill label={status.label} tone={status.tone} />
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
    </div>
  );
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 mb-4">
      {title && <div className="text-[11px] font-semibold text-slate-500 mb-3 uppercase tracking-wide">{title}</div>}
      {children}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-blue-100';
export const selectClass = inputClass + ' bg-white';

export function SaveBar({ onSave, saveLabel = 'Save and apply' }: { onSave?: () => void; saveLabel?: string }) {
  return (
    <div className="flex justify-end gap-2 mt-2">
      <button className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 rounded-lg bg-[#1e3a8a] text-white text-xs font-semibold hover:bg-[#1e3a8a]/90 cursor-pointer"
      >
        {saveLabel}
      </button>
    </div>
  );
}

export function ServiceBanner({
  breadcrumb,
  icon,
  title,
  description,
}: {
  breadcrumb: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#0f1e46] rounded-xl p-6 mb-6 text-white">
      <div className="text-[11px] font-semibold text-blue-300 mb-2">{breadcrumb}</div>
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-blue-300">{icon}</span>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      </div>
      <p className="text-[13px] text-blue-200/80 max-w-2xl">{description}</p>
    </div>
  );
}

export function PanelHeaderCheckbox({
  title,
  label,
  checked,
  onChange,
}: {
  title: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="text-sm font-bold text-slate-900">{title}</div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
        {label}
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-[#1e3a8a] cursor-pointer"
        />
      </label>
    </div>
  );
}

export function RequiredField({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export const bigInputClass =
  'w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-blue-100';
export const bigSelectClass = bigInputClass + ' bg-white';

export function BottomActionBar({
  secondaryLabel,
  primaryLabel = 'Save configuration',
  onSecondary,
  onPrimary,
}: {
  secondaryLabel?: string;
  primaryLabel?: string;
  onSecondary?: () => void;
  onPrimary?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mt-2">
      {secondaryLabel ? (
        <button
          onClick={onSecondary}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          {secondaryLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        onClick={onPrimary}
        className="px-5 py-2.5 rounded-xl bg-[#1e3a8a] text-white text-sm font-semibold hover:bg-[#1e3a8a]/90 cursor-pointer"
      >
        {primaryLabel}
      </button>
    </div>
  );
}
import { CheckCircle2 } from 'lucide-react';

export function SavedToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-emerald-600 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
      <CheckCircle2 size={16} /> Configuration saved
    </div>
  );
}
// import { ReactNode } from 'react'

// export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={() => onChange(!checked)}
//       className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
//         checked ? 'bg-teal-600' : 'bg-slate-300'
//       }`}
//     >
//       <span
//         className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
//           checked ? 'translate-x-[19px]' : 'translate-x-1'
//         }`}
//       />
//     </button>
//   )
// }

// export function StatusPill({ label, tone }: { label: string; tone: 'green' | 'gray' | 'amber' }) {
//   const styles = {
//     green: 'bg-green-100 text-green-700',
//     gray: 'bg-slate-100 text-slate-600',
//     amber: 'bg-amber-100 text-amber-700',
//   }[tone]
//   return (
//     <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${styles}`}>
//       <span className="h-1.5 w-1.5 rounded-full bg-current" />
//       {label}
//     </span>
//   )
// }

// export function ServiceHeader({
//   icon,
//   title,
//   status,
//   enabled,
//   onToggle,
// }: {
//   icon: ReactNode
//   title: string
//   status: { label: string; tone: 'green' | 'gray' | 'amber' }
//   enabled: boolean
//   onToggle: (v: boolean) => void
// }) {
//   return (
//     <div className="flex items-center justify-between mb-5">
//       <div className="flex items-center gap-2.5">
//         <span className="text-teal-600">{icon}</span>
//         <h1 className="text-[17px] font-semibold text-slate-900">{title}</h1>
//       </div>
//       <div className="flex items-center gap-3">
//         <StatusPill label={status.label} tone={status.tone} />
//         <Toggle checked={enabled} onChange={onToggle} />
//       </div>
//     </div>
//   )
// }

// export function Panel({ title, children }: { title?: string; children: ReactNode }) {
//   return (
//     <div className="bg-white border border-slate-200 rounded-md p-5 mb-4">
//       {title && <div className="text-[12px] font-medium text-slate-500 mb-3">{title}</div>}
//       {children}
//     </div>
//   )
// }

// export function Field({ label, children }: { label: string; children: ReactNode }) {
//   return (
//     <div>
//       <label className="block text-[11.5px] font-medium text-slate-500 mb-1.5">{label}</label>
//       {children}
//     </div>
//   )
// }

// export const inputClass =
//   'w-full rounded border border-slate-200 px-3 py-2 text-[13px] text-slate-900 focus:border-teal-600 focus:outline-none'
// export const selectClass = inputClass + ' bg-white'

// export function SaveBar({ onSave, saveLabel = 'Save and apply' }: { onSave?: () => void; saveLabel?: string }) {
//   return (
//     <div className="flex justify-end gap-2 mt-2">
//       <button className="px-4 py-2 rounded border border-slate-200 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50">
//         Cancel
//       </button>
//       <button
//         onClick={onSave}
//         className="px-4 py-2 rounded bg-teal-600 text-white text-[12.5px] font-medium hover:bg-teal-700"
//       >
//         {saveLabel}
//       </button>
//     </div>
//   )
// }
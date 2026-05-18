import type { ReactNode } from 'react';

type InfoFieldProps = {
  label: string;
  value: string;
  icon?: ReactNode;
  wide?: boolean;
  readOnly?: boolean;
};

export function InfoField({ label, value, icon, wide, readOnly }: InfoFieldProps) {
  return (
    <div className={`rounded-xl border border-slate-100 p-4 ${wide ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
        {icon}
        {label}
        {readOnly && <span className="normal-case text-slate-300">(read-only)</span>}
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm font-medium text-slate-700">
        {value || '-'}
      </p>
    </div>
  );
}

type ProfileSummaryRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export function ProfileSummaryRow({ icon, label, value }: ProfileSummaryRowProps) {
  return (
    <div className="flex gap-3 px-4 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value || '-'}
        </p>
      </div>
    </div>
  );
}

type EditFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  multiline?: boolean;
};

export function EditField({ label, value, onChange, icon, multiline }: EditFieldProps) {
  return (
    <label className={`block ${multiline ? 'sm:col-span-2' : ''}`}>
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
        {icon}
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      )}
    </label>
  );
}

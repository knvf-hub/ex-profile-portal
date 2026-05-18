import { useState } from 'react';
import { Eye, EyeOff, Lock, Save, X } from 'lucide-react';

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordCardProps = {
  form: PasswordForm;
  isEditing: boolean;
  isSaving: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onChange: (field: keyof PasswordForm, value: string) => void;
  onSave: () => void;
};

export function PasswordCard({
  form,
  isEditing,
  isSaving,
  onStartEdit,
  onCancelEdit,
  onChange,
  onSave,
}: PasswordCardProps) {
  const [visibleFields, setVisibleFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: keyof PasswordForm) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <section className="rounded-2xl border border-white/70 bg-white/95 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Password</h3>
          <p className="mt-1 text-sm text-slate-500">
            Password is hidden and can only be changed after confirming the current password.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={onStartEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            <Lock size={16} />
            Change Password
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <X size={16} />
            Cancel
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-5 space-y-4">
          <PasswordField
            label="Current Password"
            value={form.currentPassword}
            isVisible={visibleFields.currentPassword}
            onChange={(value) => onChange('currentPassword', value)}
            onToggleVisibility={() => toggleVisibility('currentPassword')}
            autoComplete="current-password"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <PasswordField
              label="New Password"
              value={form.newPassword}
              isVisible={visibleFields.newPassword}
              onChange={(value) => onChange('newPassword', value)}
              onToggleVisibility={() => toggleVisibility('newPassword')}
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm New Password"
              value={form.confirmPassword}
              isVisible={visibleFields.confirmPassword}
              onChange={(value) => onChange('confirmPassword', value)}
              onToggleVisibility={() => toggleVisibility('confirmPassword')}
              autoComplete="new-password"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-[oklch(0.2_0.08_261.66)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Password'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-slate-100 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-slate-400">
              <Lock size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Password is hidden</p>
              <p className="mt-1 text-sm text-slate-500">
                Passwords are never returned by the API.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function PasswordField({
  label,
  value,
  isVisible,
  autoComplete,
  onChange,
  onToggleVisibility,
}: {
  label: string;
  value: string;
  isVisible: boolean;
  autoComplete: string;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase text-slate-400">
        {label}
      </span>
      <div className="relative">
        <input
          value={value}
          type={isVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

export type { PasswordForm };

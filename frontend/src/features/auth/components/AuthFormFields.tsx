import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
};

export function AuthTextInput({ icon, className = '', ...props }: TextInputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border border-slate-200 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
          icon ? 'px-11' : 'px-4'
        } ${className}`}
      />
    </div>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  icon?: ReactNode;
};

export function AuthTextArea({ icon, className = '', ...props }: TextAreaProps) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-4 top-4 text-slate-400">{icon}</span>}
      <textarea
        {...props}
        className={`w-full resize-none rounded-xl border border-slate-200 py-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
          icon ? 'px-11' : 'px-4'
        } ${className}`}
      />
    </div>
  );
}

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  isVisible: boolean;
  onToggleVisibility: () => void;
};

export function PasswordInput({
  icon,
  isVisible,
  onToggleVisibility,
  className = '',
  ...props
}: PasswordInputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}
      <input
        {...props}
        type={isVisible ? 'text' : 'password'}
        className={`w-full rounded-xl border border-slate-200 py-3 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
          icon ? 'pl-11' : 'pl-4'
        } ${className}`}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
      >
        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export function AuthError({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

import { CheckCircle2, TriangleAlert, X } from 'lucide-react';

type ProfileToastProps = {
  error: string;
  success: string;
  onClose: () => void;
};

export function ProfileToast({ error, success, onClose }: ProfileToastProps) {
  if (!error && !success) {
    return null;
  }

  return (
    <div className="fixed right-6 top-6 z-50 w-[min(24rem,calc(100vw-3rem))]">
      <div
        className={`flex items-start gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold shadow-2xl shadow-slate-300/40 ${
          error ? 'border-red-100 text-red-600' : 'border-emerald-100 text-emerald-700'
        }`}
      >
        <div className="mt-0.5">
          {error ? <TriangleAlert size={18} /> : <CheckCircle2 size={18} />}
        </div>
        <p className="flex-1">{error || success}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 transition hover:text-slate-700"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

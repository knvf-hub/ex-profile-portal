import { LogOut, Pencil, X } from 'lucide-react';
import type { Profile } from '../../../types/profile.type';

type ProfileHeaderProps = {
  profile: Profile | null;
  isEditing: boolean;
  isLoading: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onLogout: () => void;
};

export function ProfileHeader({
  profile,
  isEditing,
  isLoading,
  onStartEdit,
  onCancelEdit,
  onLogout,
}: ProfileHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
          Employee Profile
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">
          {profile ? `${profile.first_name} ${profile.last_name}` : 'Profile'}
        </h1>
      </div>

      <div className="flex gap-3">
        {!isEditing ? (
          <button
            type="button"
            onClick={onStartEdit}
            disabled={!profile || isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white px-4 py-2 text-sm font-semibold text-[oklch(0.2_0.08_261.66)] shadow-lg shadow-blue-950/20 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Pencil size={16} />
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white px-4 py-2 text-sm font-semibold text-[oklch(0.2_0.08_261.66)] shadow-lg shadow-blue-950/20 transition hover:bg-blue-50"
          >
            <X size={16} />
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-white/25"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

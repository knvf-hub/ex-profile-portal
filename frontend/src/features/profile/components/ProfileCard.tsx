import type { RefObject } from 'react';
import { Camera, Eye, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import type { Profile } from '../../../types/profile.type';
import type { User } from '../../../types/auth.type';
import { ProfileSummaryRow } from './ProfileFields';

type ProfileCardProps = {
  user: User;
  profile: Profile | null;
  photoURL: string;
  isEditing: boolean;
  isSaving: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onPhotoClick: () => void;
  onPhotoChange: (file: File | undefined) => void;
};

export function ProfileCard({
  user,
  profile,
  photoURL,
  isEditing,
  isSaving,
  fileInputRef,
  onPhotoClick,
  onPhotoChange,
}: ProfileCardProps) {
  return (
    <aside className="overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-2xl shadow-blue-950/30 backdrop-blur">
      <div className="relative h-36 bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.35),transparent_18%),radial-gradient(circle_at_82%_74%,rgba(59,130,246,0.42),transparent_22%),linear-gradient(135deg,#0b2a8f_0%,#0f46c8_48%,#08246e_100%)]">
        <div className="absolute left-6 top-6 grid grid-cols-4 gap-2 opacity-30">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-white" />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.16),transparent_70%)]" />
      </div>

      <div className="-mt-16 flex flex-col items-center px-6 pb-6 text-center">
        <button
          type="button"
          disabled={!photoURL || isEditing}
          onClick={onPhotoClick}
          className="group relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-[oklch(0.2_0.08_261.66)] ring-[7px] ring-white shadow-2xl shadow-blue-950/20 disabled:cursor-default"
        >
          {photoURL ? (
            <img
              src={photoURL}
              alt={`${profile?.first_name ?? 'Employee'} profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound size={64} />
          )}

          {photoURL && !isEditing && (
            <span className="absolute inset-0 hidden items-center justify-center bg-slate-950/45 text-sm font-semibold text-white group-hover:flex">
              <Eye size={18} />
            </span>
          )}
        </button>

        {isEditing && (
          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onPhotoChange(event.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Camera size={16} />
              Change Photo
            </button>
          </div>
        )}

        <div className="mt-5 w-full">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Profile Card
          </p>
          <p className="mt-1 text-sm text-slate-500">View mode summary</p>
        </div>

        <div className="mt-6 w-full divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white/80 text-left">
          <ProfileSummaryRow icon={<Mail size={18} />} label="Login Email" value={user.email} />
          <ProfileSummaryRow
            icon={<Phone size={18} />}
            label="Mobile Phone"
            value={profile?.phone ?? '-'}
          />
          <ProfileSummaryRow
            icon={<MapPin size={18} />}
            label="Address"
            value={profile?.address ?? '-'}
          />
        </div>

        <div className="mt-6 w-full text-left">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {profile?.skills.length ? (
              profile.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700"
                >
                  {skill.name}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">No skills selected</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

type ProfilePhotoModalProps = {
  photoURL: string | null;
  onClose: () => void;
};

export function ProfilePhotoModal({ photoURL, onClose }: ProfilePhotoModalProps) {
  if (!photoURL) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClose}
      className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-slate-950/85 p-6"
    >
      <img
        src={photoURL}
        alt="Full profile"
        className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
      />
    </button>
  );
}

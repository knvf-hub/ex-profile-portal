import type { ReactNode } from 'react';
import { UserRound } from 'lucide-react';

type AuthCardProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  maxWidth?: string;
};

export function AuthCard({ children, title, subtitle, maxWidth = 'max-w-md' }: AuthCardProps) {
  return (
    <div className={`w-full ${maxWidth} rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200/80`}>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[oklch(0.2_0.08_261.66)]">
          <UserRound size={34} />
        </div>

        <h1 className="text-3xl font-bold text-[oklch(0.2_0.08_261.66)]">{title}</h1>
        <p className="mt-1 text-base text-slate-600">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}

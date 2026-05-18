import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  highlight: string;
  description: string;
};

export function AuthLayout({ children, title, highlight, description }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-[1.7fr_0.7fr]">
      <section className="relative hidden overflow-hidden bg-[oklch(0.16_0.07_261.66)] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(37,99,235,0.45),transparent_32%),linear-gradient(135deg,rgba(0,0,0,0.55),transparent_45%)]" />

        <div className="absolute inset-x-0 bottom-0 h-[52%] opacity-80">
          <div className="absolute bottom-0 left-[8%] h-56 w-24 bg-slate-950" />
          <div className="absolute bottom-0 left-[18%] h-80 w-28 bg-blue-950" />
          <div className="absolute bottom-0 left-[30%] h-96 w-32 bg-slate-900" />
          <div className="absolute bottom-0 left-[45%] h-[28rem] w-36 bg-blue-950" />
          <div className="absolute bottom-0 left-[62%] h-72 w-28 bg-slate-950" />
          <div className="absolute bottom-0 left-[76%] h-60 w-24 bg-blue-900" />
        </div>

        <div className="relative z-10 flex h-full items-end px-20 pb-24">
          <div>
            <h2 className="max-w-xl text-6xl font-bold leading-tight text-white">
              {title}
              <span className="block text-blue-500">{highlight}</span>
            </h2>
            <div className="mt-6 h-1 w-24 rounded-full bg-blue-500" />
            <p className="mt-8 max-w-md text-xl leading-relaxed text-blue-100/80">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6 lg:px-10">
        {children}
      </section>
    </main>
  );
}

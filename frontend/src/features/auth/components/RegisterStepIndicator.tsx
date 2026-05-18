type RegisterStepIndicatorProps = {
  step: number;
  total: number;
};

export function RegisterStepIndicator({ step, total }: RegisterStepIndicatorProps) {
  return (
    <div className="mb-6 grid gap-2" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
      {Array.from({ length: total }, (_, index) => index + 1).map((item) => (
        <div
          key={item}
          className={`h-2 rounded-full ${
            item <= step ? 'bg-[oklch(0.2_0.08_261.66)]' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

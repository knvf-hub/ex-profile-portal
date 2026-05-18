import { ArrowLeft, ArrowRight, Lock, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import type { RegisterForm } from '../types/register.type';
import { AuthTextArea, AuthTextInput, PasswordInput } from './AuthFormFields';
import { RegisterSkillSelect, type SkillOption } from './RegisterSkillSelect';

export function RegisterIdentityStep({
  form,
  onChange,
}: {
  form: RegisterForm;
  onChange: (field: keyof RegisterForm, value: string) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AuthTextInput
          value={form.first_name}
          onChange={(event) => onChange('first_name', event.target.value)}
          type="text"
          placeholder="First name"
          icon={<UserRound size={18} />}
          className="py-4"
        />
        <AuthTextInput
          value={form.last_name}
          onChange={(event) => onChange('last_name', event.target.value)}
          type="text"
          placeholder="Last name"
          className="py-4"
        />
      </div>

      <AuthTextInput
        value={form.email}
        onChange={(event) => onChange('email', event.target.value)}
        type="email"
        placeholder="Email"
        icon={<Mail size={18} />}
        className="py-4"
      />

      <AuthTextInput
        value={form.phone}
        onChange={(event) => onChange('phone', event.target.value)}
        type="tel"
        placeholder="Phone"
        icon={<Phone size={18} />}
        className="py-4"
      />
    </>
  );
}

export function RegisterProfileStep({
  address,
  skillOptions,
  selectedSkills,
  onAddressChange,
  onSkillsChange,
  onCreateSkill,
}: {
  address: string;
  skillOptions: SkillOption[];
  selectedSkills: SkillOption[];
  onAddressChange: (value: string) => void;
  onSkillsChange: (value: SkillOption[]) => void;
  onCreateSkill: (value: string) => void;
}) {
  return (
    <>
      <AuthTextArea
        value={address}
        onChange={(event) => onAddressChange(event.target.value)}
        placeholder="Address"
        rows={4}
        icon={<MapPin size={18} />}
      />

      <RegisterSkillSelect
        options={skillOptions}
        value={selectedSkills}
        onChange={onSkillsChange}
        onCreate={onCreateSkill}
      />
    </>
  );
}

export function RegisterPasswordStep({
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
  onToggleConfirmPassword,
}: {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}) {
  return (
    <>
      <PasswordInput
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        placeholder="Password"
        icon={<Lock size={18} />}
        isVisible={showPassword}
        onToggleVisibility={onTogglePassword}
        className="py-4"
      />

      <PasswordInput
        value={confirmPassword}
        onChange={(event) => onConfirmPasswordChange(event.target.value)}
        placeholder="Confirm password"
        icon={<Lock size={18} />}
        isVisible={showConfirmPassword}
        onToggleVisibility={onToggleConfirmPassword}
        className="py-4"
      />
    </>
  );
}

export function RegisterActions({
  step,
  isSubmitting,
  onBack,
  onNext,
}: {
  step: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {step > 1 && (
        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      )}

      {step < 3 ? (
        <button
          type="button"
          onClick={onNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[oklch(0.2_0.08_261.66)] py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Next
          <ArrowRight size={18} />
        </button>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[oklch(0.2_0.08_261.66)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </button>
      )}
    </div>
  );
}

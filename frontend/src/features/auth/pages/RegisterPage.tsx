import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { register } from '../../../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';
import { AuthCard } from '../components/AuthCard';
import { AuthError } from '../components/AuthFormFields';
import { AuthLayout } from '../components/AuthLayout';
import type { SkillOption } from '../components/RegisterSkillSelect';
import { RegisterStepIndicator } from '../components/RegisterStepIndicator';
import {
  RegisterActions,
  RegisterIdentityStep,
  RegisterPasswordStep,
  RegisterProfileStep,
} from '../components/RegisterSteps';
import type { RegisterForm } from '../types/register.type';

const initialForm: RegisterForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirm_password: '',
};

const skillOptions: SkillOption[] = [
  { label: 'React', value: 'React' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'Go', value: 'Go' },
  { label: 'SQL', value: 'SQL' },
  { label: 'Node.js', value: 'Node.js' },
  { label: 'HTML', value: 'HTML' },
  { label: 'CSS', value: 'CSS' },
];

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [selectedSkills, setSelectedSkills] = useState<SkillOption[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setUser } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    setError('');
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const createSkill = (inputValue: string) => {
    const value = inputValue.trim();
    if (!value) return;

    setSelectedSkills((prev) =>
      prev.some((item) => item.value.toLowerCase() === value.toLowerCase())
        ? prev
        : [...prev, { label: value, value }],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirm_password) {
      setError('Password and confirm password do not match.');
      return;
    }

    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      skills: selectedSkills.map((skill) => skill.value),
      password: form.password,
    };

    if (
      !payload.first_name ||
      !payload.last_name ||
      !payload.email ||
      !payload.phone ||
      !payload.address ||
      !payload.password
    ) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await register(payload);
      setUser(response.data.user);
      navigate('/profile', { replace: true });
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.error ?? 'Register failed.'
          : 'Register failed.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your"
      highlight="Portal Account"
      description="Register your profile step by step."
    >
      <AuthCard title="Sign Up" subtitle={`Step ${step} of 3`} maxWidth="max-w-lg">
        <RegisterStepIndicator step={step} total={3} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <RegisterIdentityStep form={form} onChange={updateField} />
          )}

          {step === 2 && (
            <RegisterProfileStep
              address={form.address}
              skillOptions={skillOptions}
              selectedSkills={selectedSkills}
              onAddressChange={(value) => updateField('address', value)}
              onSkillsChange={setSelectedSkills}
              onCreateSkill={createSkill}
            />
          )}

          {step === 3 && (
            <RegisterPasswordStep
              password={form.password}
              confirmPassword={form.confirm_password}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onPasswordChange={(value) => updateField('password', value)}
              onConfirmPasswordChange={(value) => updateField('confirm_password', value)}
              onTogglePassword={() => setShowPassword((prev) => !prev)}
              onToggleConfirmPassword={() => setShowConfirmPassword((prev) => !prev)}
            />
          )}

          <RegisterActions
            step={step}
            isSubmitting={isSubmitting}
            onBack={prevStep}
            onNext={nextStep}
          />

          <AuthError message={error} />
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[oklch(0.2_0.08_261.66)] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default RegisterPage;

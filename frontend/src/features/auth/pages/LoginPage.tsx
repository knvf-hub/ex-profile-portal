import { useState } from 'react';
import { Lock, UserRound } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { login, me } from '../../../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';
import { AuthCard } from '../components/AuthCard';
import { AuthError, AuthTextInput, PasswordInput } from '../components/AuthFormFields';
import { AuthLayout } from '../components/AuthLayout';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setUser } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({
        email: email.trim().toLowerCase(),
        password,
      });

      const currentUser = await me();
      setUser(currentUser.data.user);
      navigate('/profile', { replace: true });
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.error ?? 'Login failed.'
          : 'Login failed.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome to"
      highlight="Profile Portal"
      description="Manage employee profiles securely, simply, and efficiently."
    >
      <AuthCard title="Welcome" subtitle="Login Portal">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthTextInput
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Email"
              autoComplete="email"
              icon={<UserRound size={18} />}
            />

            <PasswordInput
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              icon={<Lock size={18} />}
              isVisible={showPassword}
              onToggleVisibility={() => setShowPassword((prev) => !prev)}
            />

            <AuthError message={error} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[oklch(0.2_0.08_261.66)] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-[oklch(0.2_0.08_261.66)] hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <p className="mt-7 text-center text-xs text-slate-400">
            Secure • Simple • Connected
          </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default LoginPage;

import { AxiosError } from 'axios';
import type { Profile } from '../../../types/profile.type';
import type { ContactForm, SkillOption } from '../types/profile-ui.type';

export const emptyContact: ContactForm = {
  phone: '',
  address: '',
};

export function buildAssetURL(path: string) {
  if (path.startsWith('http')) {
    return path;
  }

  const apiURL = import.meta.env.VITE_API_URL || '';
  const origin = apiURL.replace(/\/api\/?$/, '');
  return `${origin}${path}`;
}

export function getErrorMessage(err: unknown, fallback: string) {
  if (err instanceof AxiosError) {
    return err.response?.data?.error ?? fallback;
  }

  return fallback;
}

export function toContactForm(profile: Profile): ContactForm {
  return {
    phone: profile.phone,
    address: profile.address,
  };
}

export function toSkillOptions(profile: Profile): SkillOption[] {
  return profile.skills.map((skill) => ({
    label: skill.name,
    value: skill.name,
  }));
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword, logout } from '../../../api/auth.api';
import {
  getProfile,
  getProfileHistory,
  getSkillCatalog,
  updateContact,
  updateSkills,
  uploadProfilePhoto,
} from '../../../api/profile.api';
import { useAuthStore } from '../../../store/auth.store';
import type { ChangeHistory, Profile, Skill } from '../../../types/profile.type';
import type { PasswordForm } from '../components/PasswordCard';
import type { ContactForm, SkillOption } from '../types/profile-ui.type';
import {
  buildAssetURL,
  emptyContact,
  getErrorMessage,
  toContactForm,
  toSkillOptions,
} from '../utils/profile.utils';

export function useProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, isAuthenticated, logout: clearAuth, setUser } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(user?.profile ?? null);
  const [skillCatalog, setSkillCatalog] = useState<Skill[]>([]);
  const [contactForm, setContactForm] = useState<ContactForm>(emptyContact);
  const [selectedSkills, setSelectedSkills] = useState<SkillOption[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [history, setHistory] = useState<ChangeHistory[]>([]);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const skillOptions = useMemo(
    () => skillCatalog.map((skill) => ({ label: skill.name, value: skill.name })),
    [skillCatalog],
  );

  const photoURL = profile?.image_url ? buildAssetURL(profile.image_url) : '';

  const syncEditState = (nextProfile: Profile) => {
    setContactForm(toContactForm(nextProfile));
    setSelectedSkills(toSkillOptions(nextProfile));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const [profileResponse, skillsResponse] = await Promise.all([
          getProfile(),
          getSkillCatalog(),
        ]);

        if (!isMounted) return;

        const nextProfile = profileResponse.data.profile;
        setProfile(nextProfile);
        setSkillCatalog(skillsResponse.data.skills);
        syncEditState(nextProfile);
      } catch (err) {
        if (!isMounted) return;
        setError(getErrorMessage(err, 'Failed to load profile.'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!error && !success) {
      return;
    }

    const timer = window.setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [error, success]);

  const handleLogout = async () => {
    await logout();
    clearAuth();
    navigate('/login', { replace: true });
  };

  const startEdit = () => {
    if (profile) {
      syncEditState(profile);
    }
    setError('');
    setSuccess('');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (profile) {
      syncEditState(profile);
    }
    setError('');
    setIsEditing(false);
  };

  const startPasswordChange = () => {
    setError('');
    setSuccess('');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(true);
  };

  const cancelPasswordChange = () => {
    setError('');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  const applyProfile = (nextProfile: Profile) => {
    setProfile(nextProfile);
    if (user) {
      setUser({ ...user, profile: nextProfile });
    }
    syncEditState(nextProfile);
  };

  const updateContactField = (field: keyof ContactForm, value: string) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePasswordField = (field: keyof PasswordForm, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const clearToast = () => {
    setError('');
    setSuccess('');
  };

  const openHistory = async () => {
    try {
      setIsHistoryOpen(true);
      setIsHistoryLoading(true);
      setError('');
      const response = await getProfileHistory();
      setHistory(response.data.history);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load change history.'));
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const closeHistory = () => {
    setIsHistoryOpen(false);
  };

  const handleSave = async () => {
    if (!profile) return;

    const nextContact = {
      phone: contactForm.phone.trim(),
      email: profile.email,
      address: contactForm.address.trim(),
    };

    if (!nextContact.phone || !nextContact.address) {
      setError('Phone and address are required.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const contactResponse = await updateContact(nextContact);
      const skillsResponse = await updateSkills({
        skills: selectedSkills.map((skill) => skill.value),
      });

      applyProfile(skillsResponse.data.profile ?? contactResponse.data.profile);
      const catalogResponse = await getSkillCatalog();
      setSkillCatalog(catalogResponse.data.skills);
      setIsEditing(false);
      setSuccess('Profile updated.');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update profile.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Current password, new password, and confirm password are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
      setSuccess('Password changed.');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to change password.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoChange = async (file: File | undefined) => {
    if (!file) return;

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      const response = await uploadProfilePhoto(file);
      applyProfile(response.data.profile);
      setSuccess('Profile photo updated.');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to upload profile photo.'));
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openPhotoPreview = () => {
    if (photoURL) {
      setPreviewPhoto(photoURL);
    }
  };

  return {
    user,
    isAuthenticated,
    profile,
    contactForm,
    selectedSkills,
    skillOptions,
    isEditing,
    isChangingPassword,
    isHistoryOpen,
    isHistoryLoading,
    passwordForm,
    history,
    isLoading,
    isSaving,
    error,
    success,
    previewPhoto,
    photoURL,
    fileInputRef,
    startEdit,
    cancelEdit,
    startPasswordChange,
    cancelPasswordChange,
    openHistory,
    closeHistory,
    handleLogout,
    handleSave,
    handlePasswordSave,
    handlePhotoChange,
    updateContactField,
    updatePasswordField,
    setSelectedSkills,
    createSkill,
    clearToast,
    openPhotoPreview,
    closePhotoPreview: () => setPreviewPhoto(null),
  };
}

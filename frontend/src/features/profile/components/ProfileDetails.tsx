import { Clock3, Mail, MapPin, Phone, Save } from 'lucide-react';
import CreatableSelect from 'react-select/creatable';
import type { MultiValue } from 'react-select';
import type { Profile } from '../../../types/profile.type';
import type { ContactForm, SkillOption } from '../types/profile-ui.type';
import { EditField, InfoField } from './ProfileFields';

type ProfileDetailsProps = {
  profile: Profile | null;
  contactForm: ContactForm;
  selectedSkills: SkillOption[];
  skillOptions: SkillOption[];
  isEditing: boolean;
  isLoading: boolean;
  isSaving: boolean;
  onContactChange: (field: keyof ContactForm, value: string) => void;
  onSkillsChange: (skills: SkillOption[]) => void;
  onCreateSkill: (skill: string) => void;
  onSave: () => void;
  onOpenHistory: () => void;
};

export function ProfileDetails({
  profile,
  contactForm,
  selectedSkills,
  skillOptions,
  isEditing,
  isLoading,
  isSaving,
  onContactChange,
  onSkillsChange,
  onCreateSkill,
  onSave,
  onOpenHistory,
}: ProfileDetailsProps) {
  return (
    <section className="rounded-2xl border border-white/70 bg-white/95 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur">
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading profile...</p>
      ) : profile ? (
        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-950">Personal Information</h3>
              <button
                type="button"
                onClick={onOpenHistory}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Clock3 size={16} />
                View History
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoField label="First Name" value={profile.first_name} readOnly />
              <InfoField label="Last Name" value={profile.last_name} readOnly />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-950">Contact Information</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {isEditing ? (
                <>
                  <EditField
                    label="Mobile Phone"
                    icon={<Phone size={17} />}
                    value={contactForm.phone}
                    onChange={(value) => onContactChange('phone', value)}
                  />
                  <InfoField label="Email" value={profile.email} icon={<Mail size={17} />} readOnly />
                  <EditField
                    label="Address"
                    icon={<MapPin size={17} />}
                    value={contactForm.address}
                    onChange={(value) => onContactChange('address', value)}
                    multiline
                  />
                </>
              ) : (
                <>
                  <InfoField label="Mobile Phone" value={profile.phone} icon={<Phone size={17} />} />
                  <InfoField label="Email" value={profile.email} icon={<Mail size={17} />} readOnly />
                  <InfoField label="Address" value={profile.address} icon={<MapPin size={17} />} wide />
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-950">Skills</h3>
            {isEditing ? (
              <div className="mt-4">
                <CreatableSelect
                  isMulti
                  options={skillOptions}
                  value={selectedSkills}
                  onChange={(value: MultiValue<SkillOption>) => onSkillsChange([...value])}
                  onCreateOption={onCreateSkill}
                  placeholder="Select or type skill then press Enter"
                  closeMenuOnSelect={false}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  className="text-sm"
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                      borderRadius: '14px',
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
                    }),
                    control: (base, state) => ({
                      ...base,
                      minHeight: '56px',
                      borderRadius: '14px',
                      borderColor: state.isFocused ? '#3b82f6' : '#e2e8f0',
                      boxShadow: state.isFocused
                        ? '0 0 0 4px rgba(59, 130, 246, 0.12)'
                        : 'none',
                      padding: '4px 8px',
                      ':hover': {
                        borderColor: '#3b82f6',
                      },
                    }),
                    multiValue: (base) => ({
                      ...base,
                      borderRadius: '999px',
                      backgroundColor: '#eff6ff',
                      padding: '3px 6px',
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#0f3a8a',
                      fontWeight: 600,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: '#64748b',
                      borderRadius: '999px',
                      ':hover': {
                        backgroundColor: '#dbeafe',
                        color: '#dc2626',
                      },
                    }),
                    option: (base, state) => ({
                      ...base,
                      padding: '10px 14px',
                      backgroundColor: state.isSelected
                        ? '#dbeafe'
                        : state.isFocused
                          ? '#f1f5f9'
                          : 'white',
                      color: state.isSelected ? '#0f3a8a' : '#334155',
                      fontWeight: state.isSelected ? 600 : 400,
                      cursor: 'pointer',
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#94a3b8',
                    }),
                  }}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Select multiple skills from the list.
                </p>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-[oklch(0.2_0.08_261.66)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Profile not found.</p>
      )}
    </section>
  );
}

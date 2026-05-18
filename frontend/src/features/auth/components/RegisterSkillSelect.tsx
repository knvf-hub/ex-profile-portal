import CreatableSelect from 'react-select/creatable';
import type { MultiValue } from 'react-select';

export type SkillOption = {
  label: string;
  value: string;
};

type RegisterSkillSelectProps = {
  options: SkillOption[];
  value: SkillOption[];
  onChange: (value: SkillOption[]) => void;
  onCreate: (value: string) => void;
};

export function RegisterSkillSelect({
  options,
  value,
  onChange,
  onCreate,
}: RegisterSkillSelectProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">Skills</label>
      <CreatableSelect
        isMulti
        options={options}
        value={value}
        onChange={(nextValue: MultiValue<SkillOption>) => onChange([...nextValue])}
        onCreateOption={onCreate}
        placeholder="Select or type skill then press Enter"
        closeMenuOnSelect={false}
        className="text-sm"
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: '56px',
            borderRadius: '14px',
            borderColor: state.isFocused ? '#3b82f6' : '#e2e8f0',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.12)' : 'none',
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
          menu: (base) => ({
            ...base,
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
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
  );
}

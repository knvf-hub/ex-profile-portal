import type { Profile, Skill } from './auth.type';

export type { Profile, Skill };

export type ProfileResponse = {
  profile: Profile;
};

export type SkillCatalogResponse = {
  skills: Skill[];
};

export type UpdateContactRequest = {
  phone: string;
  email: string;
  address: string;
};

export type UpdateSkillsRequest = {
  skills: string[];
};

export type ChangeHistory = {
  id: number;
  profile_id: number;
  field: string;
  old_value: string;
  new_value: string;
  created_at: string;
};

export type ChangeHistoryResponse = {
  history: ChangeHistory[];
};

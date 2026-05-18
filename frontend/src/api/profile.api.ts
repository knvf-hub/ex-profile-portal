import { http } from './http';
import type {
  ChangeHistoryResponse,
  ProfileResponse,
  SkillCatalogResponse,
  UpdateContactRequest,
  UpdateSkillsRequest,
} from '../types/profile.type';

export const getProfile = () => {
  return http.get<ProfileResponse>('/profile');
};

export const updateContact = (payload: UpdateContactRequest) => {
  return http.patch<ProfileResponse>('/profile/contact', payload);
};

export const updateSkills = (payload: UpdateSkillsRequest) => {
  return http.patch<ProfileResponse>('/profile/skills', payload);
};

export const uploadProfilePhoto = (photo: File) => {
  const formData = new FormData();
  formData.append('photo', photo);

  return http.patch<ProfileResponse>('/profile/photo', formData);
};

export const getSkillCatalog = () => {
  return http.get<SkillCatalogResponse>('/config/skills');
};

export const getProfileHistory = () => {
  return http.get<ChangeHistoryResponse>('/profile/history');
};

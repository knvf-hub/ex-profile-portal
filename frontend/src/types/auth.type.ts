export type Skill = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  image_url: string;
  skills: Skill[];
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  email: string;
  profile: Profile;
  created_at: string;
  updated_at: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

export type LoginResponse = {
  token: string;
  expires_at: string;
};

export type RegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  skills: string[];
};

export type AuthResponse = {
  user: User;
  expires_at: string;
};

export type MeResponse = {
  user: User;
};

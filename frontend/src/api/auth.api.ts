import { http } from './http';
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
} from '../types/auth.type';

export const login = (payload: LoginRequest) => {
  return http.post<LoginResponse>('/auth/login', payload);
};

export const register = (payload: RegisterRequest) => {
  return http.post<AuthResponse>('/auth/register', payload);
};

export const logout = () => {
  return http.post('/auth/logout');
};

export const me = () => {
  return http.get<MeResponse>('/auth/me');
};

export const changePassword = (payload: ChangePasswordRequest) => {
  return http.patch('/auth/password', payload);
};

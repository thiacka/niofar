export type UserRole = 'administrator' | 'editor' | 'contributor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface CreateUserDto {
  email: string;
  name: string;
  role: UserRole;
  password: string;
  is_active?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole;
  password?: string;
  is_active?: boolean;
}

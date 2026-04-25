export type UserRole = 'administrator' | 'manager' | 'operator';

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

export type AuditAction = 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE';

export interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string;
  user_name: string;
  user_role: string;
  action: AuditAction;
  entity_type: string;
  entity_id: string | null;
  entity_label: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

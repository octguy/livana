export interface AdminUserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  enabled: boolean;
  status: UserStatus;
  roles: string[];
  lastLoginAt: string | null;
  createdAt: string;
}

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "BANNED"
  | "PENDING_VERIFICATION";

export type UserRole = "ROLE_ADMIN" | "ROLE_USER" | "ROLE_MODERATOR";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

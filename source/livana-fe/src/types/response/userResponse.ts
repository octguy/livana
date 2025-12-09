export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  roles?: string[]; // Optional since it's not in /auth/me response
}

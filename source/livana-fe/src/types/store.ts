import type { ApiResponse } from "./apiResponse";
import type { AuthResponse } from "./authResponse";
import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string) => void;
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<ApiResponse<AuthResponse>>;
  login: (
    username: string,
    password: string
  ) => Promise<ApiResponse<AuthResponse>>;
  clearState: () => void;
  logOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<ApiResponse<string>>;
}

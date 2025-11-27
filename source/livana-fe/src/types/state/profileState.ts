import type { UpdateProfileRequest } from "../request/updateProfileRequest";
import type { ApiResponse } from "../response/apiResponse";
import type { User } from "../response/userResponse";

export interface ProfileState {
  loading: boolean;

  update: (updatedProfile: UpdateProfileRequest) => Promise<ApiResponse<User>>;
  uploadAvatar: (file: File) => Promise<ApiResponse<User>>;
}

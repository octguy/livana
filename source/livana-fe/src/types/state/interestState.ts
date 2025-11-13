import type { ApiResponse } from "../response/apiResponse";
import type { InterestResponse } from "../response/interestResponse";
import type { UserInterestResponse } from "../response/userInterestResponse";

export interface InterestState {
  loading: boolean;
  interests: InterestResponse[];
  userInterests: UserInterestResponse | null;

  setListInterests: (interests: InterestResponse[]) => void;
  setUserInterests: (userInterests: UserInterestResponse) => void;
  getAllInterests: () => Promise<ApiResponse<InterestResponse[]>>;
  getUserInterests: () => Promise<ApiResponse<UserInterestResponse>>;
  updateUserInterests: (
    interestIds: string[]
  ) => Promise<ApiResponse<UserInterestResponse>>;
}

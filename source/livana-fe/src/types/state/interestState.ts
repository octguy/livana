import type { ApiResponse } from "../response/apiResponse";
import type { InterestResponse } from "../response/interestResponse";
import type { UserInterestResponse } from "../response/userInterestResponse";

export interface InterestState {
  loading: boolean;
  interests: InterestResponse[];
  userInterests: UserInterestResponse | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;

  clearState: () => void;
  setListInterests: (interests: InterestResponse[]) => void;
  setUserInterests: (userInterests: UserInterestResponse) => void;
  setPage: (page: number) => void;
  setPaginationInfo: (totalPages: number, totalElements: number) => void;
  getAllInterests: (
    page?: number,
    size?: number
  ) => Promise<ApiResponse<InterestResponse[]>>;
  getUserInterests: () => Promise<ApiResponse<UserInterestResponse>>;
  updateUserInterests: (
    interestIds: string[]
  ) => Promise<ApiResponse<UserInterestResponse>>;
}

import type { ApiResponse } from "../response/apiResponse";
import type { InterestResponse } from "../response/interestResponse";

export interface InterestState {
  loading: boolean;
  interests: InterestResponse[];

  setListInterests: (interests: InterestResponse[]) => void;
  getAllInterests: () => Promise<ApiResponse<InterestResponse[]>>;
}

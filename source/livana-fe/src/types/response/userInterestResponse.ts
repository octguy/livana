import type { InterestResponse } from "./interestResponse";

export interface UserInterestResponse {
  userId: string;
  username: string;
  interests: InterestResponse[];
}

import api from "@/lib/axios";
import type { InterestResponse } from "@/types/response/interestResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const interestService = {
  getAllInterests: async (): Promise<ApiResponse<InterestResponse[]>> => {
    const response = await api.get<ApiResponse<InterestResponse[]>>(
      `/interests`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};

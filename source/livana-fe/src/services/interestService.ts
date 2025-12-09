import api from "@/lib/axios";
import type { InterestResponse } from "@/types/response/interestResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const interestService = {
  getAllInterests: async (
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<InterestResponse[]>> => {
    const response = await api.get<ApiResponse<InterestResponse[]>>(
      `/interests`,
      {
        params: { page, size },
        withCredentials: true,
      }
    );
    return response.data;
  },
};

import api from "@/lib/axios";
import type { BulkCreateSessionRequest } from "@/types/request/createSessionRequest";
import type { BulkCreateSessionResponse } from "@/types/response/sessionResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const createExperienceSessions = async (
  experienceId: string,
  payload: BulkCreateSessionRequest
): Promise<ApiResponse<BulkCreateSessionResponse>> => {
  const response = await api.post<ApiResponse<BulkCreateSessionResponse>>(
    `/listings/experiences/${experienceId}/sessions`,
    payload
  );

  return response.data;
};

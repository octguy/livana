import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response/apiResponse";
import type {
  HostRevenueStatsResponse,
  HostRevenuePeriodResponse,
  PeriodType,
} from "@/types/response/hostRevenueResponse";

export const hostRevenueService = {
  /**
   * Get overall revenue statistics for the host
   */
  getOverallStats: async (): Promise<ApiResponse<HostRevenueStatsResponse>> => {
    const response = await api.get<ApiResponse<HostRevenueStatsResponse>>(
      "/host/revenue/stats",
      { withCredentials: true }
    );
    return response.data;
  },

  /**
   * Get revenue statistics for a specific period
   */
  getPeriodStats: async (
    period: PeriodType,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<HostRevenuePeriodResponse>> => {
    const response = await api.get<ApiResponse<HostRevenuePeriodResponse>>(
      "/host/revenue/stats/period",
      {
        params: { period, startDate, endDate },
        withCredentials: true,
      }
    );
    return response.data;
  },
};

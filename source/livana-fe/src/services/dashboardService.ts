import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response/apiResponse";
import type {
  DashboardStatsResponse,
  PeriodStatsResponse,
  ComparisonStatsResponse,
  PeriodType,
} from "@/types/response/dashboardResponse";

export const dashboardService = {
  /**
   * Get overall dashboard statistics
   */
  getOverallStats: async (): Promise<ApiResponse<DashboardStatsResponse>> => {
    const response = await api.get<ApiResponse<DashboardStatsResponse>>(
      "/dashboard/stats",
      { withCredentials: true }
    );
    return response.data;
  },

  /**
   * Get statistics for a specific period (growth data)
   */
  getPeriodStats: async (
    period: PeriodType,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<PeriodStatsResponse>> => {
    const response = await api.get<ApiResponse<PeriodStatsResponse>>(
      "/dashboard/stats/period",
      {
        params: { period, startDate, endDate },
        withCredentials: true,
      }
    );
    return response.data;
  },

  /**
   * Get comparison statistics between Home and Experience
   */
  getComparisonStats: async (
    period: PeriodType,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<ComparisonStatsResponse>> => {
    const response = await api.get<ApiResponse<ComparisonStatsResponse>>(
      "/dashboard/stats/comparison",
      {
        params: { period, startDate, endDate },
        withCredentials: true,
      }
    );
    return response.data;
  },
};

import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response/apiResponse";

export interface NotificationResponse {
  id: string;
  recipientId: string;
  type:
    | "BOOKING_HOME"
    | "BOOKING_EXPERIENCE"
    | "BOOKING_CONFIRMED"
    | "BOOKING_CANCELLED"
    | "SYSTEM";
  title: string;
  message: string;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async (): Promise<ApiResponse<NotificationResponse[]>> => {
    const response = await api.get<ApiResponse<NotificationResponse[]>>(
      "/notifications",
      { withCredentials: true }
    );
    return response.data;
  },

  getUnreadNotifications: async (): Promise<
    ApiResponse<NotificationResponse[]>
  > => {
    const response = await api.get<ApiResponse<NotificationResponse[]>>(
      "/notifications/unread",
      { withCredentials: true }
    );
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const response = await api.get<ApiResponse<number>>(
      "/notifications/unread/count",
      { withCredentials: true }
    );
    return response.data;
  },

  markAsRead: async (
    notificationId: string
  ): Promise<ApiResponse<NotificationResponse>> => {
    const response = await api.put<ApiResponse<NotificationResponse>>(
      `/notifications/${notificationId}/read`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await api.put<ApiResponse<void>>(
      "/notifications/read-all",
      {},
      { withCredentials: true }
    );
    return response.data;
  },
};

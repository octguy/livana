import { create } from "zustand";
import type { NotificationMessage } from "@/types/response/notificationResponse";
import { websocketService } from "@/services/websocketService";
import {
  notificationService,
  type NotificationResponse,
} from "@/services/notificationService";

interface NotificationState {
  notifications: NotificationResponse[];
  unreadCount: number;
  isConnected: boolean;
  loading: boolean;

  // Actions
  connect: (userId: string) => void;
  disconnect: () => void;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: NotificationMessage) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  loading: false,

  connect: (userId: string) => {
    if (get().isConnected) return;

    // Fetch existing notifications from API
    get().fetchNotifications();

    websocketService.connect(
      () => {
        set({ isConnected: true });

        // Subscribe to notifications for this user
        websocketService.subscribeToNotifications<NotificationMessage>(
          userId,
          (notification) => {
            get().addNotification(notification);
          }
        );
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        set({ isConnected: false });
      }
    );
  },

  disconnect: () => {
    websocketService.disconnect();
    set({ isConnected: false });
  },

  fetchNotifications: async () => {
    try {
      set({ loading: true });
      const response = await notificationService.getNotifications();
      const countResponse = await notificationService.getUnreadCount();

      set({
        notifications: response.data || [],
        unreadCount: countResponse.data || 0,
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      set({ loading: false });
    }
  },

  addNotification: (notification: NotificationMessage) => {
    // Convert WebSocket message to NotificationResponse format
    const newNotification: NotificationResponse = {
      id: notification.id,
      recipientId: notification.recipientId,
      type: notification.type as NotificationResponse["type"],
      title: notification.title,
      message: notification.message,
      referenceId: null,
      isRead: false,
      createdAt: notification.createdAt,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0, isConnected: false });
  },
}));

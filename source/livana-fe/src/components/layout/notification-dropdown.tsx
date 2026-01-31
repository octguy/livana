import { useEffect } from "react";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import type { NotificationResponse } from "@/services/notificationService";

export function NotificationDropdown() {
  const { user } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isConnected,
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    if (user?.id) {
      connect(user.id);
    }
    // Don't disconnect WebSocket on unmount - it's shared with chat
    // WebSocket will be disconnected on logout
  }, [user?.id, connect]);

  // Show toast for new notifications
  const latestNotificationId = notifications[0]?.id;
  useEffect(() => {
    const latestNotification = notifications[0];
    if (latestNotification && !latestNotification.isRead) {
      toast.success(latestNotification.title, {
        description: latestNotification.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestNotificationId]);

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm MM/dd/yyyy", { locale: enUS });
  };

  const getTypeLabel = (type: NotificationResponse["type"]) => {
    switch (type) {
      case "BOOKING_HOME":
        return {
          label: "Booking",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
        };
      case "BOOKING_EXPERIENCE":
        return {
          label: "Experience",
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
        };
      case "BOOKING_CONFIRMED":
        return {
          label: "Confirmed",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
        };
      case "BOOKING_CANCELLED":
        return {
          label: "Cancelled",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
        };
      default:
        return {
          label: "System",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
        };
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6"
                onClick={() => markAllAsRead()}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No new notifications
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => {
              const typeInfo = getTypeLabel(notification.type);
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                    !notification.isRead ? "bg-accent/50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${typeInfo.bgColor} ${typeInfo.textColor}`}
                    >
                      {typeInfo.label}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatNotificationTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ChatSheet } from "./chat-sheet";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

interface ChatIconProps {
  className?: string;
}

export function ChatIcon({ className }: ChatIconProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { unreadCount, connect, fetchUnreadCount } = useChatStore();

  // Initialize WebSocket connection and fetch unread count
  useEffect(() => {
    if (user) {
      connect(user.id);
      fetchUnreadCount();
    }
  }, [user, connect, fetchUnreadCount]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn("relative", className)}
        onClick={() => setChatOpen(true)}
      >
        <MessageCircle className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      <ChatSheet open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}

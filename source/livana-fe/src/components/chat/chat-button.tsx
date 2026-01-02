import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ChatSheet } from "./chat-sheet";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

interface ChatButtonProps {
  hostId: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function ChatButton({
  hostId,
  variant = "outline",
  size = "default",
  className,
  children,
}: ChatButtonProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const handleClick = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để nhắn tin");
      return;
    }

    if (user.id === hostId) {
      toast.error("Bạn không thể nhắn tin cho chính mình");
      return;
    }

    setChatOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {children || "Liên hệ chủ nhà"}
      </Button>

      <ChatSheet
        open={chatOpen}
        onOpenChange={setChatOpen}
        initialParticipantId={hostId}
      />
    </>
  );
}

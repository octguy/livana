import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  ArrowLeft,
  Loader2,
  FileText,
  Download,
} from "lucide-react";
import { cloudinaryService } from "@/services/cloudinaryService";
import { toast } from "sonner";
import type {
  ConversationResponse,
  MessageResponse,
} from "@/types/response/chatResponse";
import { cn } from "@/lib/utils";

interface ChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialParticipantId?: string;
}

export function ChatSheet({
  open,
  onOpenChange,
  initialParticipantId,
}: ChatSheetProps) {
  const user = useAuthStore((s) => s.user);
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    sendingMessage,
    connect,
    fetchConversations,
    getOrCreateConversation,
    setCurrentConversation,
    fetchMessages,
    sendMessage,
    markMessagesAsRead,
    fetchUnreadCount,
    setChatOpen,
  } = useChatStore();

  const [messageInput, setMessageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Connect to WebSocket and fetch conversations when opened
  useEffect(() => {
    if (open && user) {
      setChatOpen(true);
      connect(user.id);
      fetchConversations();
      fetchUnreadCount();
    } else if (!open) {
      setChatOpen(false);
    }
  }, [open, user, connect, fetchConversations, fetchUnreadCount, setChatOpen]);

  // Open initial conversation if provided
  useEffect(() => {
    if (open && initialParticipantId && user) {
      getOrCreateConversation(initialParticipantId);
    }
  }, [open, initialParticipantId, user, getOrCreateConversation]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id);
      markMessagesAsRead(currentConversation.id);
    }
  }, [currentConversation, fetchMessages, markMessagesAsRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentConversation || sendingMessage) return;

    await sendMessage({
      receiverId: currentConversation.participant.id,
      messageType: "TEXT",
      content: messageInput.trim(),
    });
    setMessageInput("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentConversation) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    try {
      setUploading(true);
      const result = await cloudinaryService.uploadImage(file);
      await sendMessage({
        receiverId: currentConversation.participant.id,
        messageType: "IMAGE",
        fileUrl: result.url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
    } catch {
      toast.error("Không thể tải lên hình ảnh");
    } finally {
      setUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentConversation) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File không được vượt quá 10MB");
      return;
    }

    try {
      setUploading(true);
      const result = await cloudinaryService.uploadImage(file);
      await sendMessage({
        receiverId: currentConversation.participant.id,
        messageType: "FILE",
        fileUrl: result.url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
    } catch {
      toast.error("Không thể tải lên file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    }
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderMessage = (msg: MessageResponse) => {
    const isMine = msg.senderId === user?.id;

    return (
      <div
        key={msg.id}
        className={cn(
          "flex gap-2 mb-3",
          isMine ? "flex-row-reverse" : "flex-row"
        )}
      >
        {!isMine && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={msg.senderAvatar || ""} />
            <AvatarFallback>
              {msg.senderName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn("max-w-[70%]", isMine ? "items-end" : "items-start")}
        >
          {msg.messageType === "TEXT" && (
            <div
              className={cn(
                "px-3 py-2 rounded-2xl",
                isMine
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted rounded-bl-sm"
              )}
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {msg.content}
              </p>
            </div>
          )}
          {msg.messageType === "IMAGE" && msg.fileUrl && (
            <div
              className={cn(
                "rounded-2xl overflow-hidden",
                isMine ? "rounded-br-sm" : "rounded-bl-sm"
              )}
            >
              <img
                src={msg.fileUrl}
                alt={msg.fileName || "Image"}
                className="max-w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(msg.fileUrl || "", "_blank")}
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.innerHTML = `<div class="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"><span class="text-sm">[Không thể tải hình ảnh]</span></div>`;
                }}
              />
            </div>
          )}
          {msg.messageType === "IMAGE" && !msg.fileUrl && (
            <div
              className={cn(
                "px-3 py-2 rounded-2xl",
                isMine
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted rounded-bl-sm"
              )}
            >
              <p className="text-sm">[Hình ảnh không khả dụng]</p>
            </div>
          )}
          {msg.messageType === "FILE" && (
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg",
                isMine ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              <FileText className="h-8 w-8 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{msg.fileName}</p>
                <p className="text-xs opacity-70">
                  {formatFileSize(msg.fileSize)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={() => window.open(msg.fileUrl || "", "_blank")}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
          <p
            className={cn(
              "text-xs text-muted-foreground mt-1",
              isMine ? "text-right" : "text-left"
            )}
          >
            {formatTime(msg.createdAt)}
          </p>
        </div>
      </div>
    );
  };

  const renderConversationList = () => (
    <div className="flex flex-col h-full">
      <SheetHeader className="border-b pb-4">
        <SheetTitle>Tin nhắn</SheetTitle>
        <SheetDescription className="sr-only">
          Danh sách cuộc trò chuyện của bạn
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-2">
        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p>Chưa có cuộc trò chuyện nào</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              onClick={() => setCurrentConversation(conv)}
            />
          ))
        )}
      </div>
    </div>
  );

  const renderChatView = () => (
    <div className="flex flex-col h-full">
      {/* Hidden accessibility elements */}
      <SheetTitle className="sr-only">
        Trò chuyện với {currentConversation?.participant.displayName}
      </SheetTitle>
      <SheetDescription className="sr-only">
        Cuộc trò chuyện với {currentConversation?.participant.displayName}
      </SheetDescription>
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentConversation(null)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentConversation?.participant.avatarUrl || ""} />
          <AvatarFallback>
            {currentConversation?.participant.displayName
              ?.charAt(0)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">
            {currentConversation?.participant.displayName}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>Bắt đầu cuộc trò chuyện</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const showDate =
                index === 0 ||
                formatDate(messages[index - 1].createdAt) !==
                  formatDate(msg.createdAt);

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  {renderMessage(msg)}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading || sendingMessage}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || sendingMessage}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Nhập tin nhắn..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={uploading || sendingMessage}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || uploading || sendingMessage}
            size="icon"
          >
            {sendingMessage || uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-4">
        {currentConversation ? renderChatView() : renderConversationList()}
      </SheetContent>
    </Sheet>
  );
}

interface ConversationItemProps {
  conversation: ConversationResponse;
  onClick: () => void;
}

function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  return (
    <button
      className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left"
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.participant.avatarUrl || ""} />
          <AvatarFallback>
            {conversation.participant.displayName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {conversation.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">
            {conversation.participant.displayName}
          </p>
          {conversation.lastMessageAt && (
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {new Date(conversation.lastMessageAt).toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>
          )}
        </div>
        {conversation.lastMessageContent && (
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessageContent}
          </p>
        )}
      </div>
    </button>
  );
}

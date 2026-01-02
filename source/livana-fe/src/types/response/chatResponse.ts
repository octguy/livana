export interface ParticipantInfo {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ConversationResponse {
  id: string;
  participant: ParticipantInfo;
  lastMessageContent: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  createdAt: string;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  messageType: "TEXT" | "IMAGE" | "FILE";
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ChatMessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  receiverId: string;
  messageType: "TEXT" | "IMAGE" | "FILE";
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  createdAt: string;
}

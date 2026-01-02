export interface SendMessageRequest {
  receiverId: string;
  messageType: "TEXT" | "IMAGE" | "FILE";
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface CreateConversationRequest {
  participantId: string;
}

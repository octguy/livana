import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response/apiResponse";
import type {
  ConversationResponse,
  MessageResponse,
} from "@/types/response/chatResponse";
import type { SendMessageRequest } from "@/types/request/chatRequest";

export const chatService = {
  /**
   * Get or create a conversation with another user
   */
  getOrCreateConversation: async (
    participantId: string
  ): Promise<ApiResponse<ConversationResponse>> => {
    const response = await api.post<ApiResponse<ConversationResponse>>(
      "/chat/conversations",
      { participantId },
      { withCredentials: true }
    );
    return response.data;
  },

  /**
   * Get all conversations for the current user
   */
  getConversations: async (): Promise<ApiResponse<ConversationResponse[]>> => {
    const response = await api.get<ApiResponse<ConversationResponse[]>>(
      "/chat/conversations",
      { withCredentials: true }
    );
    return response.data;
  },

  /**
   * Get a specific conversation by ID
   */
  getConversationById: async (
    conversationId: string
  ): Promise<ApiResponse<ConversationResponse>> => {
    const response = await api.get<ApiResponse<ConversationResponse>>(
      `/chat/conversations/${conversationId}`,
      { withCredentials: true }
    );
    return response.data;
  },

  /**
   * Get messages in a conversation with pagination
   */
  getMessages: async (
    conversationId: string,
    page: number = 0,
    size: number = 50
  ): Promise<ApiResponse<MessageResponse[]>> => {
    const response = await api.get<ApiResponse<MessageResponse[]>>(
      `/chat/conversations/${conversationId}/messages`,
      { params: { page, size }, withCredentials: true }
    );
    return response.data;
  },

  /**
   * Send a message to a user
   */
  sendMessage: async (
    request: SendMessageRequest
  ): Promise<ApiResponse<MessageResponse>> => {
    const response = await api.post<ApiResponse<MessageResponse>>(
      "/chat/messages",
      request,
      { withCredentials: true }
    );
    return response.data;
  },

  /**
   * Mark messages as read in a conversation
   */
  markMessagesAsRead: async (
    conversationId: string
  ): Promise<ApiResponse<void>> => {
    const response = await api.put<ApiResponse<void>>(
      `/chat/conversations/${conversationId}/read`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  /**
   * Get total unread message count
   */
  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const response = await api.get<ApiResponse<number>>("/chat/unread-count", {
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Get unread count for a specific conversation
   */
  getUnreadCountForConversation: async (
    conversationId: string
  ): Promise<ApiResponse<number>> => {
    const response = await api.get<ApiResponse<number>>(
      `/chat/conversations/${conversationId}/unread-count`,
      { withCredentials: true }
    );
    return response.data;
  },
};

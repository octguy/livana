import { create } from "zustand";
import { chatService } from "@/services/chatService";
import { websocketService } from "@/services/websocketService";
import type {
  ConversationResponse,
  MessageResponse,
  ChatMessageDto,
} from "@/types/response/chatResponse";
import type { SendMessageRequest } from "@/types/request/chatRequest";
import { toast } from "sonner";

interface ChatState {
  conversations: ConversationResponse[];
  currentConversation: ConversationResponse | null;
  messages: MessageResponse[];
  unreadCount: number;
  isConnected: boolean;
  loading: boolean;
  sendingMessage: boolean;

  // WebSocket
  connect: (userId: string) => void;
  disconnect: () => void;

  // Conversations
  fetchConversations: () => Promise<void>;
  getOrCreateConversation: (
    participantId: string
  ) => Promise<ConversationResponse | null>;
  setCurrentConversation: (conversation: ConversationResponse | null) => void;

  // Messages
  fetchMessages: (
    conversationId: string,
    page?: number,
    size?: number
  ) => Promise<void>;
  sendMessage: (request: SendMessageRequest) => Promise<MessageResponse | null>;
  addIncomingMessage: (message: ChatMessageDto) => void;

  // Read status
  markMessagesAsRead: (conversationId: string) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;

  // State management
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  unreadCount: 0,
  isConnected: false,
  loading: false,
  sendingMessage: false,

  connect: (userId: string) => {
    if (get().isConnected) return;

    websocketService.connect(
      () => {
        set({ isConnected: true });

        // Subscribe to chat messages for this user
        websocketService.subscribe<ChatMessageDto>(
          `/topic/chat/${userId}`,
          (message) => {
            get().addIncomingMessage(message);
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

  fetchConversations: async () => {
    try {
      set({ loading: true });
      const response = await chatService.getConversations();
      set({ conversations: response.data || [] });
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      toast.error("Không thể tải danh sách cuộc trò chuyện");
    } finally {
      set({ loading: false });
    }
  },

  getOrCreateConversation: async (participantId: string) => {
    try {
      set({ loading: true });
      const response = await chatService.getOrCreateConversation(participantId);
      const conversation = response.data;

      // Update conversations list
      set((state) => {
        const exists = state.conversations.some(
          (c) => c.id === conversation.id
        );
        if (!exists) {
          return { conversations: [conversation, ...state.conversations] };
        }
        return state;
      });

      set({ currentConversation: conversation });
      return conversation;
    } catch (error) {
      console.error("Failed to get or create conversation:", error);
      toast.error("Không thể tạo cuộc trò chuyện");
      return null;
    } finally {
      set({ loading: false });
    }
  },

  setCurrentConversation: (conversation: ConversationResponse | null) => {
    set({ currentConversation: conversation, messages: [] });
  },

  fetchMessages: async (conversationId: string, page = 0, size = 50) => {
    try {
      set({ loading: true });
      const response = await chatService.getMessages(
        conversationId,
        page,
        size
      );
      set({ messages: response.data || [] });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Không thể tải tin nhắn");
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (request: SendMessageRequest) => {
    try {
      set({ sendingMessage: true });
      const response = await chatService.sendMessage(request);
      const message = response.data;

      // Add message to current conversation
      set((state) => ({
        messages: [...state.messages, message],
      }));

      // Update conversation list
      set((state) => {
        const updatedConversations = state.conversations.map((conv) => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessageContent:
                message.messageType === "TEXT"
                  ? message.content
                  : message.messageType === "IMAGE"
                  ? "[Hình ảnh]"
                  : "[Tệp đính kèm]",
              lastMessageAt: message.createdAt,
            };
          }
          return conv;
        });

        // Sort by last message time
        updatedConversations.sort((a, b) => {
          if (!a.lastMessageAt) return 1;
          if (!b.lastMessageAt) return -1;
          return (
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime()
          );
        });

        return { conversations: updatedConversations };
      });

      return message;
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Không thể gửi tin nhắn");
      return null;
    } finally {
      set({ sendingMessage: false });
    }
  },

  addIncomingMessage: (message: ChatMessageDto) => {
    const { currentConversation, conversations } = get();

    // Create MessageResponse from ChatMessageDto
    const messageResponse: MessageResponse = {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatar: message.senderAvatar,
      messageType: message.messageType,
      content: message.content,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileSize: message.fileSize,
      fileType: message.fileType,
      isRead: false,
      createdAt: message.createdAt,
    };

    // If this is the current conversation, add to messages
    if (
      currentConversation &&
      currentConversation.id === message.conversationId
    ) {
      set((state) => ({
        messages: [...state.messages, messageResponse],
      }));
    }

    // Update conversation list
    const existingConv = conversations.find(
      (c) => c.id === message.conversationId
    );

    if (existingConv) {
      set((state) => {
        const updatedConversations = state.conversations.map((conv) => {
          if (conv.id === message.conversationId) {
            const isCurrentConv = currentConversation?.id === conv.id;
            return {
              ...conv,
              lastMessageContent:
                message.messageType === "TEXT"
                  ? message.content
                  : message.messageType === "IMAGE"
                  ? "[Hình ảnh]"
                  : "[Tệp đính kèm]",
              lastMessageAt: message.createdAt,
              unreadCount: isCurrentConv
                ? conv.unreadCount
                : conv.unreadCount + 1,
            };
          }
          return conv;
        });

        // Sort by last message time
        updatedConversations.sort((a, b) => {
          if (!a.lastMessageAt) return 1;
          if (!b.lastMessageAt) return -1;
          return (
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime()
          );
        });

        return {
          conversations: updatedConversations,
          unreadCount:
            currentConversation?.id === message.conversationId
              ? state.unreadCount
              : state.unreadCount + 1,
        };
      });
    } else {
      // New conversation - need to fetch it
      get().fetchConversations();
      set((state) => ({ unreadCount: state.unreadCount + 1 }));
    }

    // Show toast notification if not in current conversation
    if (
      !currentConversation ||
      currentConversation.id !== message.conversationId
    ) {
      toast.info(
        `${message.senderName}: ${message.content || "[Tệp đính kèm]"}`,
        {
          duration: 3000,
        }
      );
    }
  },

  markMessagesAsRead: async (conversationId: string) => {
    try {
      await chatService.markMessagesAsRead(conversationId);

      // Update unread count in conversations
      set((state) => {
        const conversation = state.conversations.find(
          (c) => c.id === conversationId
        );
        const unreadInConv = conversation?.unreadCount || 0;

        return {
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
          ),
          unreadCount: Math.max(0, state.unreadCount - unreadInConv),
        };
      });
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await chatService.getUnreadCount();
      set({ unreadCount: response.data || 0 });
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  },

  clearChat: () => {
    set({
      conversations: [],
      currentConversation: null,
      messages: [],
      unreadCount: 0,
    });
  },
}));

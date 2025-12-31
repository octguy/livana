import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WEBSOCKET_URL = "http://localhost:8080/ws";

let stompClient: Client | null = null;
const subscriptions: Map<string, StompSubscription> = new Map();

export const websocketService = {
  connect: (onConnect?: () => void, onError?: (error: unknown) => void) => {
    if (stompClient?.active) {
      console.log("WebSocket already connected");
      return;
    }

    stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log("[STOMP]", str);
      },
    });

    stompClient.onConnect = () => {
      console.log("WebSocket connected");
      onConnect?.();
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error:", frame.headers["message"]);
      onError?.(frame);
    };

    stompClient.onWebSocketError = (error) => {
      console.error("WebSocket error:", error);
      onError?.(error);
    };

    stompClient.activate();
  },

  disconnect: () => {
    if (stompClient?.active) {
      subscriptions.forEach((sub) => sub.unsubscribe());
      subscriptions.clear();
      stompClient.deactivate();
      console.log("WebSocket disconnected");
    }
  },

  subscribe: <T>(
    destination: string,
    callback: (message: T) => void
  ): (() => void) => {
    if (!stompClient?.active) {
      console.warn("WebSocket not connected, cannot subscribe");
      return () => {};
    }

    if (subscriptions.has(destination)) {
      console.warn(`Already subscribed to ${destination}`);
      return () => subscriptions.get(destination)?.unsubscribe();
    }

    const subscription = stompClient.subscribe(
      destination,
      (message: IMessage) => {
        try {
          const body = JSON.parse(message.body) as T;
          callback(body);
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      }
    );

    subscriptions.set(destination, subscription);
    console.log(`Subscribed to ${destination}`);

    return () => {
      subscription.unsubscribe();
      subscriptions.delete(destination);
      console.log(`Unsubscribed from ${destination}`);
    };
  },

  subscribeToNotifications: <T>(
    userId: string,
    callback: (notification: T) => void
  ): (() => void) => {
    const destination = `/topic/notifications/${userId}`;
    return websocketService.subscribe(destination, callback);
  },

  isConnected: (): boolean => {
    return stompClient?.active ?? false;
  },
};

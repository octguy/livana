import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/state/authState";
import { useProfileStore } from "./useProfileStore";
import { useInterestStore } from "./useInterestStore";
import { useHomeListingStore } from "./useHomeListingStore";
import { usePropertyTypeStore } from "./usePropertyTypeStore";
import { useAmenityStore } from "./useAmenityStore";
import { useFacilityStore } from "./useFacilityStore";
import { useExperienceCategoryStore } from "./useExperienceCategoryStore";
import { useChatStore } from "./useChatStore";
import { useNotificationStore } from "./useNotificationStore";
import { websocketService } from "@/services/websocketService";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => set({ accessToken: null, user: null, loading: false }),

  signUp: async (firstName, lastName, username, email, password) => {
    try {
      set({ loading: true });

      // Call the signUp service
      const data = await authService.signUp(
        firstName,
        lastName,
        username,
        email,
        password
      );
      console.log("SignUp response data:", data);

      // On success
      toast.success("Sign up successful! You can log in now.");

      return data;
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
      console.error("Sign up failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async (username, password) => {
    try {
      set({ loading: true });

      // Call the login service
      const data = await authService.login(username, password);

      // On success
      get().setAccessToken(data.data.accessToken);
      toast.success("Login successful!");

      // Fetch user info after login (now includes roles)
      await get().fetchMe();

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logOut: async () => {
    try {
      await authService.logOut();
    } catch (error) {
      // API call might fail if token is expired, but that's okay
      console.log("Logout API call failed (but will clear all state):", error);
    } finally {
      // Clear all store states
      get().clearState();
      useProfileStore.getState().clearState();
      useInterestStore.getState().clearState();
      useHomeListingStore.getState().clearState();
      usePropertyTypeStore.getState().clearState();
      useAmenityStore.getState().clearState();
      useFacilityStore.getState().clearState();
      useExperienceCategoryStore.getState().clearState();
      useChatStore.getState().clearChat();
      useNotificationStore.getState().clearNotifications();
      // Disconnect WebSocket on logout
      websocketService.disconnect();
      toast.success("Logout successful!");
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      console.log("fetchMe response data:", user);
      console.log("fetchMe user roles:", user.data.roles);
      set({ user: user.data });
    } catch (error) {
      toast.error("Unable to get user information. Please try again.");
      console.error("Failed to get user information:", error);
      set({ accessToken: null, user: null });
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      const { user, fetchMe, setAccessToken } = get();
      const newAccessToken = await authService.refresh();
      setAccessToken(newAccessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      // toast.error("Session has expired. Please log in again.");
      console.error(error);
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },

  verifyEmail: async (email, verificationCode) => {
    try {
      set({ loading: true });
      const data = await authService.verifyEmail(email, verificationCode);
      toast.success("Email verification successful!");
      return data;
    } catch (error) {
      toast.error("Email verification failed. Please try again.");
      console.error("Email verification failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resendVerificationCode: async (email) => {
    try {
      set({ loading: true });
      const data = await authService.resendVerificationCode(email);
      toast.success("A new verification code has been sent to your email");
      return data;
    } catch (error) {
      toast.error("Unable to resend verification code. Please try again.");
      console.error("Resend verification code failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ loading: true });
      const data = await authService.forgotPassword(email);
      toast.success("Password reset request has been sent to your email");
      return data;
    } catch (error) {
      toast.error("Unable to send password reset request. Please try again.");
      console.error("Password reset request failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      set({ loading: true });
      const data = await authService.resetPassword(token, newPassword);
      toast.success("Password reset successful! You can log in now.");
      return data;
    } catch (error) {
      toast.error("Password reset failed. Please try again.");
      console.error("Password reset failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

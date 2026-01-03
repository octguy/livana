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
      toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");

      return data;
    } catch (error) {
      toast.error("Đăng ký không thành công. Vui lòng thử lại.");
      console.error("Đăng ký thất bại:", error);
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
      toast.success("Đăng nhập thành công!");

      // Fetch user info after login (now includes roles)
      await get().fetchMe();

      return data;
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      toast.error("Đăng nhập không thành công. Vui lòng thử lại.");
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
      toast.success("Đăng xuất thành công!");
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
      toast.error("Không thể lấy thông tin người dùng. Vui lòng thử lại.");
      console.error("Lấy thông tin người dùng thất bại:", error);
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
      // toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
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
      toast.success("Xác thực email thành công!");
      return data;
    } catch (error) {
      toast.error("Xác thực email không thành công. Vui lòng thử lại.");
      console.error("Xác thực email thất bại:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resendVerificationCode: async (email) => {
    try {
      set({ loading: true });
      const data = await authService.resendVerificationCode(email);
      toast.success("Mã xác thực mới đã được gửi đến email của bạn");
      return data;
    } catch (error) {
      toast.error("Không thể gửi lại mã xác thực. Vui lòng thử lại.");
      console.error("Gửi lại mã xác thực thất bại:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ loading: true });
      const data = await authService.forgotPassword(email);
      toast.success("Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn");
      return data;
    } catch (error) {
      toast.error("Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.");
      console.error("Yêu cầu đặt lại mật khẩu thất bại:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      set({ loading: true });
      const data = await authService.resetPassword(token, newPassword);
      toast.success(
        "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ."
      );
      return data;
    } catch (error) {
      toast.error("Đặt lại mật khẩu không thành công. Vui lòng thử lại.");
      console.error("Đặt lại mật khẩu thất bại:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

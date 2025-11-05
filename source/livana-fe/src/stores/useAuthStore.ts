import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  signUp: async (username, email, password) => {
    try {
      set({ loading: true });

      // Call the signUp service
      const data = await authService.signUp(username, email, password);
      console.log("SignUp response data:", data);

      // On success
      toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
    } catch (error) {
      toast.error("Đăng ký không thành công. Vui lòng thử lại.");
      console.error("Đăng ký thất bại:", error);
    } finally {
      set({ loading: false });
    }
  },

  login: async (username, password) => {
    try {
      set({ loading: true });

      // Call the login service
      const data = await authService.login(username, password);
      console.log("Login response data:", data);

      // On success
      set({ accessToken: data.data.accessToken, user: data.data.user });
      toast.success("Đăng nhập thành công!");

      console.log("Access Token", get().accessToken);
    } catch (error) {
      toast.error("Đăng nhập không thành công. Vui lòng thử lại.");
      console.error("Đăng nhập thất bại:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => set({ accessToken: null, user: null, loading: false }),

  signUp: async (username, email, password) => {
    try {
      set({ loading: true });

      // Call the signUp service
      const data = await authService.signUp(username, email, password);
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

      // Fetch user info after login
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
      get().clearState();
      await authService.logOut();
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      toast.error("Đăng xuất không thành công. Vui lòng thử lại.");
      console.error("Đăng xuất thất bại:", error);
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      // console.log("fetchMe response data:", user);
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
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      console.error(error);
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));

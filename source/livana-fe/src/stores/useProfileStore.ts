import { create } from "zustand";
import type { ProfileState } from "@/types/state/profileState";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { cloudinaryService } from "@/services/cloudinaryService";

export const useProfileStore = create<ProfileState>((set) => ({
  loading: false,

  update: async (updatedProfile) => {
    try {
      set({ loading: true });
      const response = await userService.update(updatedProfile);
      console.log("Cập nhật hồ sơ response:", response);
      // await useAuthStore.getState().fetchMe();
      toast.success("Cập nhật hồ sơ thành công!");
      return response;
    } catch (error) {
      toast.error("Cập nhật hồ sơ không thành công. Vui lòng thử lại.");
      console.error("Cập nhật hồ sơ thất bại:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  uploadAvatar: async (file) => {
    try {
      set({ loading: true });
      const response = await cloudinaryService.uploadImage(file);
      console.log("Tải ảnh đại diện response:", response);
      toast.success("Cập nhật ảnh đại diện thành công!");
      return response;
    } catch (error) {
      toast.error("Cập nhật ảnh đại diện không thành công. Vui lòng thử lại.");
      console.error("Cập nhật ảnh đại diện thất bại:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

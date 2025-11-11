import { create } from "zustand";
import type { ProfileState } from "@/types/state/profileState";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { useAuthStore } from "./useAuthStore";

export const useProfileStore = create<ProfileState>((set) => ({
  loading: false,

  update: async (id, updatedProfile) => {
    try {
      set({ loading: true });
      const response = await userService.update(id, updatedProfile);
      console.log("Cập nhật hồ sơ response:", response);
      const fetchMe = useAuthStore.getState().fetchMe;
      await fetchMe();
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      toast.error("Cập nhật hồ sơ không thành công. Vui lòng thử lại.");
      console.error("Cập nhật hồ sơ thất bại:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

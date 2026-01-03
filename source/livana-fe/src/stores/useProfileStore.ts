import { create } from "zustand";
import type { ProfileState } from "@/types/state/profileState";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { cloudinaryService } from "@/services/cloudinaryService";

export const useProfileStore = create<ProfileState>((set) => ({
  loading: false,

  clearState: () => set({ loading: false }),

  update: async (updatedProfile) => {
    try {
      set({ loading: true });
      const response = await userService.update(updatedProfile);
      console.log("Profile update response:", response);
      // await useAuthStore.getState().fetchMe();
      toast.success("Profile updated successfully!");
      return response;
    } catch (error) {
      toast.error("Profile update failed. Please try again.");
      console.error("Profile update failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  uploadAvatar: async (file) => {
    try {
      set({ loading: true });
      const response = await cloudinaryService.uploadAvatar(file);
      console.log("Avatar upload response:", response);
      toast.success("Avatar updated successfully!");
      return response;
    } catch (error) {
      toast.error("Avatar update failed. Please try again.");
      console.error("Avatar update failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteAvatar: async () => {
    try {
      set({ loading: true });
      const response = await cloudinaryService.deleteAvatar();
      console.log("Avatar delete response:", response);
      toast.success("Avatar deleted successfully!");
      return response;
    } catch (error) {
      toast.error("Avatar deletion failed. Please try again.");
      console.error("Avatar deletion failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

import { create } from "zustand";
import type { InterestState } from "@/types/state/interestState";
import { interestService } from "@/services/interestService";
import { userService } from "@/services/userService";

export const useInterestStore = create<InterestState>((set, get) => ({
  loading: false,
  interests: [],
  userInterests: null,

  clearState: () => set({ loading: false, interests: [], userInterests: null }),

  setListInterests: (interests) => {
    set({ interests });
  },

  setUserInterests: (userInterests) => {
    set({ userInterests });
  },

  getAllInterests: async () => {
    try {
      set({ loading: true });
      const response = await interestService.getAllInterests();
      get().setListInterests(response.data);
      // console.log("Lấy tất cả sở thích response:", response);
      return response;
    } catch (error) {
      // toast.error("Cập nhật hồ sơ không thành công. Vui lòng thử lại.");
      console.error("Lấy tất cả sở thích thất bại:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getUserInterests: async () => {
    try {
      set({ loading: true });
      const response = await userService.getUserInterests();
      // console.log("Lấy sở thích người dùng response:", response);
      get().setUserInterests(response.data);
      return response;
    } catch (error) {
      console.error("Lấy sở thích người dùng thất bại:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateUserInterests: async (interestIds: string[]) => {
    try {
      const response = await userService.updateUserInterests(interestIds);
      get().setUserInterests(response.data);
      console.log("Cập nhật sở thích người dùng response:", response);
      return response;
    } catch (error) {
      console.error("Error updating user interests:", error);
      throw error;
    }
  },
}));

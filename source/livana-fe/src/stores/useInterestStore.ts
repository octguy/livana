import { create } from "zustand";
import type { InterestState } from "@/types/state/interestState";
import { interestService } from "@/services/interestService";

export const useInterestStore = create<InterestState>((set, get) => ({
  loading: false,
  interests: [],

  setListInterests: (interests) => {
    set({ interests });
  },

  getAllInterests: async () => {
    try {
      set({ loading: true });
      const response = await interestService.getAllInterests();
      get().setListInterests(response.data);
      console.log("Lấy tất cả sở thích response:", response);
      return response;
    } catch (error) {
      // toast.error("Cập nhật hồ sơ không thành công. Vui lòng thử lại.");
      console.error("Lấy tất cả sở thích thất bại:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

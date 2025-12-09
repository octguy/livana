import { create } from "zustand";
import type { InterestState } from "@/types/state/interestState";
import { interestService } from "@/services/interestService";
import { userService } from "@/services/userService";

export const useInterestStore = create<InterestState>((set, get) => ({
  loading: false,
  interests: [],
  userInterests: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,

  clearState: () =>
    set({
      loading: false,
      interests: [],
      userInterests: null,
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
    }),

  setListInterests: (interests) => {
    set({ interests });
  },

  setUserInterests: (userInterests) => {
    set({ userInterests });
  },

  setPage: (page) => {
    set({ currentPage: page });
  },

  setPaginationInfo: (totalPages, totalElements) => {
    set({ totalPages, totalElements });
  },

  getAllInterests: async (page = 0, size = 20) => {
    try {
      set({ loading: true });
      const response = await interestService.getAllInterests(page, size);
      // Handle paginated response structure
      const paginatedData = response.data as any;
      get().setListInterests(paginatedData.content || []);
      get().setPage(paginatedData.number || page);
      get().setPaginationInfo(
        paginatedData.totalPages || 0,
        paginatedData.totalElements || 0
      );
      return response;
    } catch (error) {
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

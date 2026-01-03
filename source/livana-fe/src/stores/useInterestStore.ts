import { create } from "zustand";
import type { InterestState } from "@/types/state/interestState";
import type { PaginatedResponse } from "@/types/response/paginatedResponse";
import type { InterestResponse } from "@/types/response/interestResponse";
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
      const paginatedData =
        response.data as unknown as PaginatedResponse<InterestResponse>;
      get().setListInterests(paginatedData.content || []);
      get().setPage(paginatedData.number || page);
      get().setPaginationInfo(
        paginatedData.totalPages || 0,
        paginatedData.totalElements || 0
      );
      return response;
    } catch (error) {
      console.error("Failed to get all interests:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getAllInterestsWithoutPagination: async () => {
    try {
      set({ loading: true });
      const response = await interestService.getAllInterestsWithoutPagination();
      get().setListInterests(response.data || []);
      return response;
    } catch (error) {
      console.error("Failed to get all interests:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getUserInterests: async () => {
    try {
      set({ loading: true });
      const response = await userService.getUserInterests();
      // console.log("Get user interests response:", response);
      get().setUserInterests(response.data);
      return response;
    } catch (error) {
      console.error("Failed to get user interests:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateUserInterests: async (interestIds: string[]) => {
    try {
      const response = await userService.updateUserInterests(interestIds);
      get().setUserInterests(response.data);
      console.log("Update user interests response:", response);
      return response;
    } catch (error) {
      console.error("Error updating user interests:", error);
      throw error;
    }
  },

  createInterest: async (name: string, icon: string) => {
    try {
      const response = await interestService.createInterest(name, icon);
      return response;
    } catch (error) {
      console.error("Error creating interest:", error);
      throw error;
    }
  },

  updateInterest: async (id: string, name: string, icon: string) => {
    try {
      const response = await interestService.updateInterest(id, name, icon);
      return response;
    } catch (error) {
      console.error("Error updating interest:", error);
      throw error;
    }
  },

  deleteInterest: async (id: string) => {
    try {
      const response = await interestService.deleteInterest(id);
      return response;
    } catch (error) {
      console.error("Error deleting interest:", error);
      throw error;
    }
  },
}));

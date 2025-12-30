import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ExperienceListingState } from "@/types/state/experienceListingState";
import { createExperienceListing } from "@/services/experienceListingService";

export const useExperienceListingStore = create<ExperienceListingState>()(
  persist(
    (set) => ({
      // Loading state
      loading: false,

      // Form state
      experienceCategoryId: null,
      location: null,
      capacity: 1,
      photos: [],
      title: "",
      description: "",
      basePrice: 0,
      sessions: [],

      // Form setters
      setExperienceCategory: (experienceCategoryId) =>
        set({ experienceCategoryId }),

      setLocation: (location) => set({ location }),

      setCapacity: (capacity) => set({ capacity }),

      setPhotos: (photos) => set({ photos }),

      setTitle: (title) => set({ title }),

      setDescription: (description) => set({ description }),

      setBasePrice: (basePrice) => set({ basePrice }),

      setSessions: (sessions) => set({ sessions }),

      clearState: () => {
        set({
          loading: false,
          experienceCategoryId: null,
          location: null,
          capacity: 1,
          photos: [],
          title: "",
          description: "",
          basePrice: 0,
          sessions: [],
        });
        // Also clear from localStorage
        localStorage.removeItem("experience-listing-storage");
      },

      resetListing: () => {
        set({
          loading: false,
          experienceCategoryId: null,
          location: null,
          capacity: 1,
          photos: [],
          title: "",
          description: "",
          basePrice: 0,
          sessions: [],
        });
        // Also clear from localStorage
        localStorage.removeItem("experience-listing-storage");
      },

      // API action
      createListing: async (payload) => {
        try {
          set({ loading: true });
          const response = await createExperienceListing(payload);
          return response;
        } catch (error) {
          console.error("Failed to create experience listing:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "experience-listing-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Reset photos to empty array after loading from storage
          if (parsed.state) {
            parsed.state.photos = [];
          }
          return str;
        },
        setItem: (name, value) => {
          const parsed = JSON.parse(value);
          // Remove photos before saving to storage
          if (parsed.state) {
            delete parsed.state.photos;
          }
          localStorage.setItem(name, JSON.stringify(parsed));
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);

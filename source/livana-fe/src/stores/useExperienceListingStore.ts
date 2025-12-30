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
        getItem: async (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Convert base64 strings back to data URLs for display
          if (parsed.state && parsed.state.photoDataUrls) {
            parsed.state.photos = parsed.state.photoDataUrls;
            delete parsed.state.photoDataUrls;
          } else if (parsed.state) {
            parsed.state.photos = [];
          }
          return JSON.stringify(parsed);
        },
        setItem: async (name, value) => {
          const parsed = JSON.parse(value);
          // Convert File objects to base64 data URLs for storage
          if (parsed.state && parsed.state.photos && parsed.state.photos.length > 0) {
            const photoPromises = parsed.state.photos.map((photo: File) => {
              return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(photo);
              });
            });
            parsed.state.photoDataUrls = await Promise.all(photoPromises);
            delete parsed.state.photos;
          }
          localStorage.setItem(name, JSON.stringify(parsed));
        },
        removeItem: async (name) => localStorage.removeItem(name),
      })),
    }
  )
);

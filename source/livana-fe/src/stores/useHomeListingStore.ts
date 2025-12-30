import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { HomeListingState } from "@/types/state/homeListingState";
import { createHomeListing } from "@/services/homeListingService";

export const useHomeListingStore = create<HomeListingState>()(
  persist(
    (set) => ({
      // Loading state
      loading: false,

      // Form state
      propertyTypeId: null,
      roomType: null,
      location: null,
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: [],
      facilities: [],
      photos: [],
      title: "",
      description: "",
      basePrice: 0,

      // Form setters
      setPropertyType: (propertyTypeId) => set({ propertyTypeId }),

      setRoomType: (roomType) => set({ roomType }),

      setLocation: (location) => set({ location }),

      setBasicInfo: (guests, bedrooms, beds, bathrooms) =>
        set({ guests, bedrooms, beds, bathrooms }),

      setAmenities: (amenities) => set({ amenities }),

      setFacilities: (facilities) => set({ facilities }),

      setPhotos: (photos) => set({ photos }),

      setTitle: (title) => set({ title }),

      setDescription: (description) => set({ description }),

      setBasePrice: (basePrice) => set({ basePrice }),

      clearState: () => {
        set({
          loading: false,
          propertyTypeId: null,
          roomType: null,
          location: null,
          guests: 1,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1,
          amenities: [],
          facilities: [],
          photos: [],
          title: "",
          description: "",
          basePrice: 0,
        });
        // Also clear from localStorage
        localStorage.removeItem("home-listing-storage");
      },

      resetListing: () => {
        set({
          loading: false,
          propertyTypeId: null,
          roomType: null,
          location: null,
          guests: 1,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1,
          amenities: [],
          facilities: [],
          photos: [],
          title: "",
          description: "",
          basePrice: 0,
        });
        // Also clear from localStorage
        localStorage.removeItem("home-listing-storage");
      },

      // API action
      createListing: async (payload) => {
        try {
          set({ loading: true });
          const response = await createHomeListing(payload);
          return response;
        } catch (error) {
          console.error("Failed to create home listing:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "home-listing-storage",
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

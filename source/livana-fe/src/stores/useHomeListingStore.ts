import { create } from "zustand";
import type { HomeListingState } from "@/types/state/homeListingState";
import { createHomeListing } from "@/services/homeListingService";

export const useHomeListingStore = create<HomeListingState>((set) => ({
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

  clearState: () =>
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
    }),

  resetListing: () =>
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
    }),

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
}));

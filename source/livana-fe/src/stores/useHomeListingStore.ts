import { create } from "zustand";
import type { HomeListingState } from "@/types/state/homeListingState";

export const useHomeListingStore = create<HomeListingState>((set) => ({
  propertyTypeId: null,
  roomType: null,
  location: null,
  guests: 1,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  amenities: [],
  photos: [],
  title: "",
  description: "",
  basePrice: 0,

  setPropertyType: (propertyTypeId) => set({ propertyTypeId }),

  setRoomType: (roomType) => set({ roomType }),

  setLocation: (location) => set({ location }),

  setBasicInfo: (guests, bedrooms, beds, bathrooms) =>
    set({ guests, bedrooms, beds, bathrooms }),

  setAmenities: (amenities) => set({ amenities }),

  setPhotos: (photos) => set({ photos }),

  setTitle: (title) => set({ title }),

  setDescription: (description) => set({ description }),

  setBasePrice: (basePrice) => set({ basePrice }),

  clearState: () =>
    set({
      propertyTypeId: null,
      roomType: null,
      location: null,
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: [],
      photos: [],
      title: "",
      description: "",
      basePrice: 0,
    }),

  resetListing: () =>
    set({
      propertyTypeId: null,
      roomType: null,
      location: null,
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: [],
      photos: [],
      title: "",
      description: "",
      basePrice: 0,
    }),
}));

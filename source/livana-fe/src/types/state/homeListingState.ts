import type { ApiResponse } from "../response/apiResponse";
import type { HomeListingResponse } from "../response/homeListingResponse";
import type { CreateHomeListingPayload } from "@/services/homeListingService";

export interface HomeListingState {
  // Loading state
  loading: boolean;

  // Form state - Step 1: Property type and room type
  propertyTypeId: string | null;
  roomType: "entire-place" | "room" | "shared-room" | null;

  // Step 2: Location
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;

  // Step 3: Basic info
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;

  // Step 4: Amenities
  amenities: string[];

  // Step 4.5: Facilities with quantities
  facilities: { facilityId: string; quantity: number }[];

  // Step 5: Photos
  photos: File[];

  // Step 6: Title and Description
  title: string;
  description: string;

  // Step 7: Pricing
  basePrice: number;

  // Form Actions
  setPropertyType: (propertyTypeId: string) => void;
  setRoomType: (roomType: "entire-place" | "room" | "shared-room") => void;
  setLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setBasicInfo: (
    guests: number,
    bedrooms: number,
    beds: number,
    bathrooms: number
  ) => void;
  setAmenities: (amenities: string[]) => void;
  setFacilities: (
    facilities: { facilityId: string; quantity: number }[]
  ) => void;
  setPhotos: (photos: File[]) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setBasePrice: (basePrice: number) => void;
  clearState: () => void;
  resetListing: () => void;

  // API Actions
  createListing: (
    payload: CreateHomeListingPayload
  ) => Promise<ApiResponse<HomeListingResponse>>;
}

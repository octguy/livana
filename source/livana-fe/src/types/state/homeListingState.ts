export interface HomeListingState {
  // Step 1: Property type and room type
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

  // Actions
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
  clearState: () => void;
  resetListing: () => void;
}

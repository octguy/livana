export interface FacilityQuantityDto {
  quantity: number;
  facilityId: string;
}

export interface ImageOrderResponse {
  image: {
    url: string;
    publicId: string;
  };
  order: number;
}

export interface ListingHostDto {
  hostId: string;
  hostDisplayName: string;
  avatarUrl: string;
  phoneNumber: string;
}

export interface HomeListingResponse {
  listingId: string;
  host: ListingHostDto;
  title: string;
  price: number;
  description: string;
  capacity: number;
  address: string;
  latitude: number;
  longitude: number;
  propertyTypeId: string;
  amenityIds: string[];
  facilities: FacilityQuantityDto[];
  images: ImageOrderResponse[];
}

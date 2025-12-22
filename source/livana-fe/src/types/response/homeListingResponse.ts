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

export interface HomeListingResponse {
  listingId: string;
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

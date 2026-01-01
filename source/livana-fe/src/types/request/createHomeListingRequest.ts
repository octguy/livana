export interface HomeFacilityRequest {
  facilityId: string;
  quantity: number;
}

export interface ImageOrderDto {
  image: string; // Cloudinary URL
  publicId: string; // Cloudinary public ID
  order: number;
}

export interface CreateHomeListingRequest {
  title: string;
  price: number;
  description: string;
  capacity: number;
  address: string;
  latitude: number;
  longitude: number;
  propertyTypeId: string;
  facilityRequests: HomeFacilityRequest[];
  amenityIds: string[];
  images: ImageOrderDto[];
}

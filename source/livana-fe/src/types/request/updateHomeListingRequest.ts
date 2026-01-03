import type {
  HomeFacilityRequest,
  ImageOrderDto,
} from "./createHomeListingRequest";

export interface UpdateHomeListingRequest {
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

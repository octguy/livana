import type { ImageOrderDto } from "./createExperienceListingRequest";

export interface UpdateExperienceListingRequest {
  title: string;
  price: number;
  description: string;
  capacity: number;
  address: string;
  latitude: number;
  longitude: number;
  experienceCategoryId: string;
  images: ImageOrderDto[];
}

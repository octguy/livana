import type { ExperienceCategoryResponse } from "./experienceCategoryResponse";

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

export interface ExperienceListingResponse {
  listingId: string;
  host: ListingHostDto;
  title: string;
  price: number;
  description: string;
  capacity: number;
  address: string;
  latitude: number;
  longitude: number;
  experienceCategory: ExperienceCategoryResponse;
  images: ImageOrderResponse[];
}

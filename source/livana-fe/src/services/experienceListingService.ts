import api from "@/lib/axios";
import type { ExperienceListingResponse } from "@/types/response/experienceListingResponse";
import type { ApiResponse } from "@/types/response/apiResponse";
import type { CreateExperienceListingRequest } from "@/types/request/createExperienceListingRequest";
import type { UpdateExperienceListingRequest } from "@/types/request/updateExperienceListingRequest";

export const createExperienceListing = async (
  payload: CreateExperienceListingRequest
): Promise<ApiResponse<ExperienceListingResponse>> => {
  const formData = new FormData();

  // Append basic fields
  formData.append("title", payload.title);
  formData.append("price", payload.price.toString());
  formData.append("description", payload.description);
  formData.append("capacity", payload.capacity.toString());
  formData.append("address", payload.address);
  formData.append("latitude", payload.latitude.toString());
  formData.append("longitude", payload.longitude.toString());
  formData.append("experienceCategoryId", payload.experienceCategoryId);

  // Append images with their order
  payload.images.forEach((imageDto, index) => {
    formData.append(`images[${index}].image`, imageDto.image);
    formData.append(`images[${index}].publicId`, imageDto.publicId);
    formData.append(`images[${index}].order`, imageDto.order.toString());
  });

  const response = await api.post<ApiResponse<ExperienceListingResponse>>(
    "/listings/experiences",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getAllExperienceListings = async (): Promise<
  ApiResponse<ExperienceListingResponse[]>
> => {
  const response = await api.get<ApiResponse<ExperienceListingResponse[]>>(
    "/listings/experiences"
  );

  return response.data;
};

export const getExperienceListingById = async (
  id: string
): Promise<ApiResponse<ExperienceListingResponse>> => {
  const response = await api.get<ApiResponse<ExperienceListingResponse>>(
    `/listings/experiences/${id}`
  );

  return response.data;
};

export const getExperienceListingsByHostId = async (
  hostId: string
): Promise<ApiResponse<ExperienceListingResponse[]>> => {
  const response = await api.get<ApiResponse<ExperienceListingResponse[]>>(
    `/listings/experiences/host/${hostId}`
  );

  return response.data;
};

export const updateExperienceListing = async (
  id: string,
  payload: UpdateExperienceListingRequest
): Promise<ApiResponse<ExperienceListingResponse>> => {
  const formData = new FormData();

  // Append basic fields
  formData.append("title", payload.title);
  formData.append("price", payload.price.toString());
  formData.append("description", payload.description);
  formData.append("capacity", payload.capacity.toString());
  formData.append("address", payload.address);
  formData.append("latitude", payload.latitude.toString());
  formData.append("longitude", payload.longitude.toString());
  formData.append("experienceCategoryId", payload.experienceCategoryId);

  // Append images with their order
  payload.images.forEach((imageDto, index) => {
    formData.append(`images[${index}].image`, imageDto.image);
    formData.append(`images[${index}].publicId`, imageDto.publicId);
    formData.append(`images[${index}].order`, imageDto.order.toString());
  });

  const response = await api.put<ApiResponse<ExperienceListingResponse>>(
    `/listings/experiences/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export interface LocationSearchParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  experienceCategoryId?: string;
}

export interface ListingSearchResult<T> {
  listing: T;
  distanceKm: number;
}

export const searchExperienceListingsByLocation = async (
  params: LocationSearchParams
): Promise<ApiResponse<ListingSearchResult<ExperienceListingResponse>[]>> => {
  const response = await api.get<
    ApiResponse<ListingSearchResult<ExperienceListingResponse>[]>
  >("/listings/experiences/search", { params });

  return response.data;
};

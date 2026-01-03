import api from "@/lib/axios";
import type { HomeListingResponse } from "@/types/response/homeListingResponse";
import type { ApiResponse } from "@/types/response/apiResponse";
import type { CreateHomeListingRequest } from "@/types/request/createHomeListingRequest";
import type { UpdateHomeListingRequest } from "@/types/request/updateHomeListingRequest";

export const createHomeListing = async (
  payload: CreateHomeListingRequest
): Promise<ApiResponse<HomeListingResponse>> => {
  const formData = new FormData();

  // Append basic fields
  formData.append("title", payload.title);
  formData.append("price", payload.price.toString());
  formData.append("description", payload.description);
  formData.append("capacity", payload.capacity.toString());
  formData.append("address", payload.address);
  formData.append("latitude", payload.latitude.toString());
  formData.append("longitude", payload.longitude.toString());
  formData.append("propertyTypeId", payload.propertyTypeId);

  // Append amenityIds as indexed array for Spring Boot @ModelAttribute
  payload.amenityIds.forEach((amenityId, index) => {
    formData.append(`amenityIds[${index}]`, amenityId);
  });

  // Append facilityRequests as indexed objects for Spring Boot @ModelAttribute
  payload.facilityRequests.forEach((facility, index) => {
    formData.append(
      `facilityRequests[${index}].facilityId`,
      facility.facilityId
    );
    formData.append(
      `facilityRequests[${index}].quantity`,
      facility.quantity.toString()
    );
  });

  // Append images with their order
  payload.images.forEach((imageDto, index) => {
    formData.append(`images[${index}].image`, imageDto.image);
    formData.append(`images[${index}].publicId`, imageDto.publicId);
    formData.append(`images[${index}].order`, imageDto.order.toString());
  });

  const response = await api.post<ApiResponse<HomeListingResponse>>(
    "/listings/homes",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getAllHomeListings = async (): Promise<
  ApiResponse<HomeListingResponse[]>
> => {
  const response = await api.get<ApiResponse<HomeListingResponse[]>>(
    "/listings/homes"
  );

  return response.data;
};

export const getHomeListingById = async (
  id: string
): Promise<ApiResponse<HomeListingResponse>> => {
  const response = await api.get<ApiResponse<HomeListingResponse>>(
    `/listings/homes/${id}`
  );

  return response.data;
};

export const getHomeListingsByHostId = async (
  hostId: string
): Promise<ApiResponse<HomeListingResponse[]>> => {
  const response = await api.get<ApiResponse<HomeListingResponse[]>>(
    `/listings/homes/host/${hostId}`
  );

  return response.data;
};

export const updateHomeListing = async (
  id: string,
  payload: UpdateHomeListingRequest
): Promise<ApiResponse<HomeListingResponse>> => {
  const formData = new FormData();

  // Append basic fields
  formData.append("title", payload.title);
  formData.append("price", payload.price.toString());
  formData.append("description", payload.description);
  formData.append("capacity", payload.capacity.toString());
  formData.append("address", payload.address);
  formData.append("latitude", payload.latitude.toString());
  formData.append("longitude", payload.longitude.toString());
  formData.append("propertyTypeId", payload.propertyTypeId);

  // Append amenityIds as indexed array for Spring Boot @ModelAttribute
  payload.amenityIds.forEach((amenityId, index) => {
    formData.append(`amenityIds[${index}]`, amenityId);
  });

  // Append facilityRequests as indexed objects for Spring Boot @ModelAttribute
  payload.facilityRequests.forEach((facility, index) => {
    formData.append(
      `facilityRequests[${index}].facilityId`,
      facility.facilityId
    );
    formData.append(
      `facilityRequests[${index}].quantity`,
      facility.quantity.toString()
    );
  });

  // Append images with their order
  payload.images.forEach((imageDto, index) => {
    formData.append(`images[${index}].image`, imageDto.image);
    formData.append(`images[${index}].publicId`, imageDto.publicId);
    formData.append(`images[${index}].order`, imageDto.order.toString());
  });

  const response = await api.put<ApiResponse<HomeListingResponse>>(
    `/listings/homes/${id}`,
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
  propertyTypeId?: string;
}

export interface ListingSearchResult<T> {
  listing: T;
  distanceKm: number;
}

export const searchHomeListingsByLocation = async (
  params: LocationSearchParams
): Promise<ApiResponse<ListingSearchResult<HomeListingResponse>[]>> => {
  const response = await api.get<
    ApiResponse<ListingSearchResult<HomeListingResponse>[]>
  >("/listings/homes/search", { params });

  return response.data;
};

// Admin functions
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const getAllHomeListingsPaginated = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  sortDir: string = "desc"
): Promise<ApiResponse<PaginatedResponse<HomeListingResponse>>> => {
  const response = await api.get<
    ApiResponse<PaginatedResponse<HomeListingResponse>>
  >("/listings/homes/admin/paginated", {
    params: { page, size, sortBy, sortDir },
  });
  return response.data;
};

export const deleteHomeListing = async (
  id: string
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    `/listings/homes/admin/${id}`
  );
  return response.data;
};

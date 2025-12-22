import api from "@/lib/axios";
import type { HomeListingResponse } from "@/types/response/homeListingResponse";
import type { ApiResponse } from "@/types/response/apiResponse";
import type {
  HomeFacilityRequest,
  ImageOrderDto,
} from "@/types/request/createHomeListingRequest";

export interface CreateHomeListingPayload {
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

export const createHomeListing = async (
  payload: CreateHomeListingPayload
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

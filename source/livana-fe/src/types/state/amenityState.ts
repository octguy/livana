import type { ApiResponse } from "../response/apiResponse";
import type { AmenityResponse } from "../response/amenityResponse";

export interface AmenityState {
  loading: boolean;
  amenities: AmenityResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;

  clearState: () => void;
  setAmenities: (amenities: AmenityResponse[]) => void;
  setPage: (page: number) => void;
  setPaginationInfo: (totalPages: number, totalElements: number) => void;
  getAllAmenities: (
    page?: number,
    size?: number
  ) => Promise<ApiResponse<AmenityResponse[]>>;
  createAmenity: (
    name: string,
    icon: string
  ) => Promise<ApiResponse<AmenityResponse>>;
  updateAmenity: (
    id: string,
    name: string,
    icon: string
  ) => Promise<ApiResponse<AmenityResponse>>;
  deleteAmenity: (id: string) => Promise<ApiResponse<void>>;
}

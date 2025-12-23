import type { ApiResponse } from "../response/apiResponse";
import type { FacilityResponse } from "../response/facilityResponse";

export interface FacilityState {
  loading: boolean;
  facilities: FacilityResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;

  clearState: () => void;
  setFacilities: (facilities: FacilityResponse[]) => void;
  setPage: (page: number) => void;
  setPaginationInfo: (totalPages: number, totalElements: number) => void;
  getAllFacilities: (
    page?: number,
    size?: number
  ) => Promise<ApiResponse<FacilityResponse[]>>;
  getAllFacilitiesComplete: () => Promise<FacilityResponse[]>;
  createFacility: (
    name: string,
    icon: string
  ) => Promise<ApiResponse<FacilityResponse>>;
  updateFacility: (
    id: string,
    name: string,
    icon: string
  ) => Promise<ApiResponse<FacilityResponse>>;
  deleteFacility: (id: string) => Promise<ApiResponse<void>>;
}

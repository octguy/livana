import type { ApiResponse } from "../response/apiResponse";
import type { FacilityResponse } from "../response/facilityResponse";

export interface FacilityState {
  loading: boolean;
  facilities: FacilityResponse[];

  setFacilities: (facilities: FacilityResponse[]) => void;
  getAllFacilities: () => Promise<ApiResponse<FacilityResponse[]>>;
}

import type { ApiResponse } from "../response/apiResponse";
import type { AmenityResponse } from "../response/amenityResponse";

export interface AmenityState {
  loading: boolean;
  amenities: AmenityResponse[];

  clearState: () => void;
  setAmenities: (amenities: AmenityResponse[]) => void;
  getAllAmenities: () => Promise<ApiResponse<AmenityResponse[]>>;
}

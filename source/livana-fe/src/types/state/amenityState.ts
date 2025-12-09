import type { ApiResponse } from "../response/apiResponse";
import type { AmenityResponse } from "../response/amenityResponse";

export interface AmenityState {
  loading: boolean;
  amenities: AmenityResponse[];

  setAmenities: (amenities: AmenityResponse[]) => void;
  getAllAmenities: () => Promise<ApiResponse<AmenityResponse[]>>;
}

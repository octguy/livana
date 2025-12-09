import type { ApiResponse } from "../response/apiResponse";
import type { PropertyTypeResponse } from "../response/propertyTypeResponse";

export interface PropertyTypeState {
  loading: boolean;
  propertyTypes: PropertyTypeResponse[];

  clearState: () => void;
  setPropertyTypes: (propertyTypes: PropertyTypeResponse[]) => void;
  getAllPropertyTypes: () => Promise<ApiResponse<PropertyTypeResponse[]>>;
}

import type { ApiResponse } from "../response/apiResponse";
import type { PropertyTypeResponse } from "../response/propertyTypeResponse";

export interface PropertyTypeState {
  loading: boolean;
  propertyTypes: PropertyTypeResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;

  clearState: () => void;
  setPropertyTypes: (propertyTypes: PropertyTypeResponse[]) => void;
  setPage: (page: number) => void;
  setPaginationInfo: (totalPages: number, totalElements: number) => void;
  getAllPropertyTypes: (
    page?: number,
    size?: number
  ) => Promise<ApiResponse<PropertyTypeResponse[]>>;
}

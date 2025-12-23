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
  createPropertyType: (
    name: string,
    icon: string
  ) => Promise<ApiResponse<PropertyTypeResponse>>;
  updatePropertyType: (
    id: string,
    name: string,
    icon: string
  ) => Promise<ApiResponse<PropertyTypeResponse>>;
  deletePropertyType: (id: string) => Promise<ApiResponse<void>>;
}

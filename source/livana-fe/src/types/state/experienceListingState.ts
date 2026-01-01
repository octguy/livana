import type { ApiResponse } from "../response/apiResponse";
import type { ExperienceListingResponse } from "../response/experienceListingResponse";
import type { CreateExperienceListingRequest } from "../request/createExperienceListingRequest";

export interface ExperienceListingState {
  // Loading state
  loading: boolean;

  // Form state - Step 1: Experience category
  experienceCategoryId: string | null;

  // Step 2: Location
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;

  // Step 3: Basic info
  capacity: number;

  // Step 4: Photos
  photos: File[];

  // Step 5: Title and Description
  title: string;
  description: string;

  // Step 6: Pricing
  basePrice: number;

  // Step 7: Sessions
  sessions: {
    startTime: string; // ISO string
    endTime: string; // ISO string
  }[];

  // Form Actions
  setExperienceCategory: (experienceCategoryId: string) => void;
  setLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setCapacity: (capacity: number) => void;
  setPhotos: (photos: File[]) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setBasePrice: (basePrice: number) => void;
  setSessions: (sessions: { startTime: string; endTime: string }[]) => void;
  clearState: () => void;
  resetListing: () => void;

  // API Actions
  createListing: (
    payload: CreateExperienceListingRequest
  ) => Promise<ApiResponse<ExperienceListingResponse>>;
}

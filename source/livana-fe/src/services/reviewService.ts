import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response/apiResponse";
import type {
  ReviewResponse,
  ListingRatingSummary,
} from "@/types/response/reviewResponse";
import type { CreateReviewRequest } from "@/types/request/reviewRequest";

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const reviewService = {
  // Create a new review
  createReview: async (request: CreateReviewRequest) => {
    const response = await api.post<ApiResponse<ReviewResponse>>(
      "/reviews",
      request
    );
    return response.data;
  },

  // Get all reviews for a listing (public)
  getListingReviews: async (listingId: string) => {
    const response = await api.get<ApiResponse<ListingRatingSummary>>(
      `/reviews/listing/${listingId}`
    );
    return response.data;
  },

  // Get current user's reviews
  getMyReviews: async () => {
    const response = await api.get<ApiResponse<ReviewResponse[]>>(
      "/reviews/my-reviews"
    );
    return response.data;
  },

  // Check if current user has reviewed a listing
  hasUserReviewedListing: async (listingId: string) => {
    const response = await api.get<ApiResponse<boolean>>(
      `/reviews/check/${listingId}`
    );
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId: string, request: CreateReviewRequest) => {
    const response = await api.put<ApiResponse<ReviewResponse>>(
      `/reviews/${reviewId}`,
      request
    );
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId: string) => {
    const response = await api.delete<ApiResponse<void>>(
      `/reviews/${reviewId}`
    );
    return response.data;
  },

  // Admin functions
  getAllReviewsPaginated: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = "createdAt",
    sortDir: string = "desc"
  ) => {
    const response = await api.get<
      ApiResponse<PaginatedResponse<ReviewResponse>>
    >("/reviews/admin/paginated", { params: { page, size, sortBy, sortDir } });
    return response.data;
  },

  adminDeleteReview: async (reviewId: string) => {
    const response = await api.delete<ApiResponse<void>>(
      `/reviews/admin/${reviewId}`
    );
    return response.data;
  },
};

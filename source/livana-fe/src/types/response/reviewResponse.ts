export interface ReviewResponse {
  id: string;
  listingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  rating: number;
  comment: string | null;
  reviewType: "HOME_LISTING" | "EXPERIENCE_LISTING";
  createdAt: string;
}

export interface ListingRatingSummary {
  averageRating: number;
  totalReviews: number;
  reviews: ReviewResponse[];
}

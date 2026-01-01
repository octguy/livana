export interface CreateReviewRequest {
  listingId: string;
  rating: number;
  comment?: string;
  reviewType: "HOME_LISTING" | "EXPERIENCE_LISTING";
}

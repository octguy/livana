import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { reviewService } from "@/services/reviewService";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import type { ListingRatingSummary } from "@/types/response/reviewResponse";
import { Star, MessageSquare, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ReviewSectionProps {
  listingId: string;
  reviewType: "HOME_LISTING" | "EXPERIENCE_LISTING";
  ratingSummary: ListingRatingSummary | null;
  onReviewSubmitted: () => void;
  isHostOwner?: boolean;
}

export function ReviewSection({
  listingId,
  reviewType,
  ratingSummary,
  onReviewSubmitted,
  isHostOwner = false,
}: ReviewSectionProps) {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingReview, setCheckingReview] = useState(false);

  // Check if user has already reviewed this listing
  const checkUserReview = async () => {
    if (!isLoggedIn || !user) return;

    setCheckingReview(true);
    try {
      const response = await reviewService.hasUserReviewedListing(listingId);
      setHasReviewed(response.data);
    } catch (error) {
      console.error("Error checking review status:", error);
    } finally {
      setCheckingReview(false);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.createReview({
        listingId,
        rating,
        comment: comment.trim() || undefined,
        reviewType,
      });
      toast.success("Review submitted successfully!");
      setShowReviewDialog(false);
      setRating(0);
      setComment("");
      setHasReviewed(true);
      onReviewSubmitted();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy", { locale: enUS });
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews
          </CardTitle>
          {ratingSummary && ratingSummary.totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">
                {ratingSummary.averageRating}
              </span>
              <span className="text-muted-foreground">
                ({ratingSummary.totalReviews} reviews)
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Write Review Button */}
        {!isHostOwner && (
          <div className="mb-6">
            {isLoggedIn ? (
              <Dialog
                open={showReviewDialog}
                onOpenChange={(open) => {
                  setShowReviewDialog(open);
                  if (open) checkUserReview();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={checkingReview}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Write a review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Your review</DialogTitle>
                    <DialogDescription>
                      Share your experience to help others
                    </DialogDescription>
                  </DialogHeader>

                  {hasReviewed ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        You have already reviewed this place.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Star rating
                        </label>
                        <div className="flex justify-center py-2">
                          <StarRating
                            rating={rating}
                            size="lg"
                            interactive
                            onRatingChange={setRating}
                          />
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                          {rating === 0 && "Select stars"}
                          {rating === 1 && "Very poor"}
                          {rating === 2 && "Poor"}
                          {rating === 3 && "Average"}
                          {rating === 4 && "Good"}
                          {rating === 5 && "Excellent"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Comment (optional)
                        </label>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your experience..."
                          rows={4}
                          maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          {comment.length}/1000
                        </p>
                      </div>

                      <Button
                        onClick={handleSubmitReview}
                        className="w-full"
                        disabled={submitting || rating === 0}
                      >
                        {submitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit review
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ) : (
              <p className="text-muted-foreground text-sm">
                <a href="/login" className="text-primary underline">
                  Log in
                </a>{" "}
                to write a review
              </p>
            )}
          </div>
        )}

        <Separator className="my-4" />

        {/* Reviews List */}
        {ratingSummary && ratingSummary.reviews.length > 0 ? (
          <div className="space-y-6">
            {ratingSummary.reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.reviewerAvatar || undefined} />
                    <AvatarFallback>
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{review.reviewerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-gray-700">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to leave a review!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

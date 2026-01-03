import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  Home,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import {
  reviewService,
  type PaginatedResponse,
} from "@/services/reviewService";
import type { ReviewResponse } from "@/types/response/reviewResponse";
import { format } from "date-fns";

export function RatingsManagement() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(
    null
  );

  // View detail dialog state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailReview, setDetailReview] = useState<ReviewResponse | null>(null);

  const fetchReviews = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const response = await reviewService.getAllReviewsPaginated(
          page,
          pageSize
        );
        const data = response.data as PaginatedResponse<ReviewResponse>;
        setReviews(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setCurrentPage(data.number);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        toast.error("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchReviews(currentPage);
  }, [fetchReviews, currentPage]);

  const handleDelete = async () => {
    if (!selectedReview || isDeleting) return;

    setIsDeleting(true);
    try {
      await reviewService.adminDeleteReview(selectedReview.id);
      toast.success("Review deleted successfully");
      await fetchReviews(currentPage);
      setIsDeleteOpen(false);
      setSelectedReview(null);
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (review: ReviewResponse) => {
    setSelectedReview(review);
    setIsDeleteOpen(true);
  };

  const openDetailDialog = (review: ReviewResponse) => {
    setDetailReview(review);
    setIsDetailOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return "No comment";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getReviewTypeIcon = (reviewType: string) => {
    if (reviewType === "HOME_LISTING") {
      return <Home className="h-4 w-4" />;
    }
    return <Compass className="h-4 w-4" />;
  };

  const getReviewTypeBadge = (reviewType: string) => {
    return (
      <Badge
        variant={reviewType === "HOME_LISTING" ? "default" : "secondary"}
        className="flex items-center gap-1"
      >
        {getReviewTypeIcon(reviewType)}
        {reviewType === "HOME_LISTING" ? "Home" : "Experience"}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ratings Management</CardTitle>
            <CardDescription>
              View and manage all ratings and reviews for listings
            </CardDescription>
          </div>
          <Select
            value={pageSize.toString()}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reviews found
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {review.reviewerAvatar ? (
                          <img
                            src={review.reviewerAvatar}
                            alt={review.reviewerName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {review.reviewerName?.charAt(0).toUpperCase() ||
                                "?"}
                            </span>
                          </div>
                        )}
                        <span className="font-medium">
                          {review.reviewerName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          ({review.rating})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="text-sm text-muted-foreground">
                        {truncateText(review.comment, 40)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getReviewTypeBadge(review.reviewType)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openDetailDialog(review)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(review)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {reviews.length} of {totalElements} reviews
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage + 1} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Review</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this review from{" "}
                {selectedReview?.reviewerName}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedReview && (
              <div className="py-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rating:</span>
                  {renderStars(selectedReview.rating)}
                </div>
                {selectedReview.comment && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Comment:
                    </span>
                    <p className="text-sm mt-1">{selectedReview.comment}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail View Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            {detailReview && (
              <div className="space-y-4">
                {/* Reviewer Info */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  {detailReview.reviewerAvatar ? (
                    <img
                      src={detailReview.reviewerAvatar}
                      alt={detailReview.reviewerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                      <span className="text-lg font-medium">
                        {detailReview.reviewerName?.charAt(0).toUpperCase() ||
                          "?"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{detailReview.reviewerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(detailReview.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rating</p>
                  <div className="flex items-center gap-2">
                    {renderStars(detailReview.rating)}
                    <span className="font-medium">
                      {detailReview.rating} / 5
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Comment</p>
                  <p className="text-sm">
                    {detailReview.comment || "No comment provided"}
                  </p>
                </div>

                {/* Review Type */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Review Type
                  </p>
                  {getReviewTypeBadge(detailReview.reviewType)}
                </div>

                {/* Listing ID */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Listing ID
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {detailReview.listingId}
                  </code>
                </div>

                {/* Reviewer ID */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Reviewer ID
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {detailReview.reviewerId}
                  </code>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

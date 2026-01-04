import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header.tsx";
import { Footer } from "@/components/layout/footer";
import { HomeBookingDialog } from "@/components/booking/home-booking-dialog";
import { ReviewSection } from "@/components/review/review-section";
import { ChatButton } from "@/components/chat";
import { getHomeListingById } from "@/services/homeListingService";
import { facilityService } from "@/services/facilityService";
import { amenityService } from "@/services/amenityService";
import { reviewService } from "@/services/reviewService";
import type { HomeListingResponse } from "@/types/response/homeListingResponse";
import type { FacilityResponse } from "@/types/response/facilityResponse";
import type { AmenityResponse } from "@/types/response/amenityResponse";
import type { ListingRatingSummary } from "@/types/response/reviewResponse";
import { MapPin, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [listing, setListing] = useState<HomeListingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [facilities, setFacilities] = useState<Map<string, FacilityResponse>>(
    new Map()
  );
  const [amenities, setAmenities] = useState<Map<string, AmenityResponse>>(
    new Map()
  );
  const [ratingSummary, setRatingSummary] =
    useState<ListingRatingSummary | null>(null);

  const fetchReviews = async (listingId: string) => {
    try {
      const response = await reviewService.getListingReviews(listingId);
      setRatingSummary(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const response = await getHomeListingById(id);
        setListing(response.data);

        // Fetch reviews
        fetchReviews(id);

        // Fetch facility details
        const facilityMap = new Map<string, FacilityResponse>();
        for (const facility of response.data.facilities) {
          try {
            const facilityResponse = await facilityService.getFacilityById(
              facility.facilityId
            );
            facilityMap.set(facility.facilityId, facilityResponse.data);
          } catch (error) {
            console.error(
              `Error fetching facility ${facility.facilityId}:`,
              error
            );
          }
        }
        setFacilities(facilityMap);

        // Fetch amenity details
        const amenityMap = new Map<string, AmenityResponse>();
        for (const amenityId of response.data.amenityIds) {
          try {
            const amenityResponse = await amenityService.getAmenityById(
              amenityId
            );
            amenityMap.set(amenityId, amenityResponse.data);
          } catch (error) {
            console.error(`Error fetching amenity ${amenityId}:`, error);
          }
        }
        setAmenities(amenityMap);
      } catch (error) {
        toast.error("Failed to load listing details");
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-muted-foreground">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-xl text-muted-foreground mb-4">
            Listing not found
          </p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto py-8 px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-4">{listing.title}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{listing.address}</span>
              </div>
              {ratingSummary && ratingSummary.totalReviews > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {ratingSummary.averageRating}
                  </span>
                  <span className="text-muted-foreground">
                    ({ratingSummary.totalReviews} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-12">
            {/* Photos Grid */}
            <div>
              {listing.images && listing.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
                  <div className="col-span-2 row-span-2 h-[400px]">
                    <img
                      src={listing.images[0].image.url}
                      alt="Main"
                      className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
                      onClick={() => setShowAllPhotos(true)}
                    />
                  </div>
                  {listing.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="h-[196px] relative">
                      <img
                        src={image.image.url}
                        alt={`Photo ${index + 2}`}
                        className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
                        onClick={() => setShowAllPhotos(true)}
                      />
                      {index === 3 && listing.images.length > 5 && (
                        <button
                          onClick={() => setShowAllPhotos(true)}
                          className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-all flex items-center justify-center text-white font-semibold"
                        >
                          +{listing.images.length - 5} more photos
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-[400px] bg-muted rounded-2xl flex items-center justify-center">
                  <span className="text-muted-foreground">
                    No images available
                  </span>
                </div>
              )}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-10">
                {/* Property Info */}
                <div className="pb-8 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold mb-4">
                    Home hosted by {listing.host?.hostDisplayName || "Host"}
                  </h2>
                  <div className="flex items-center gap-3 text-lg text-muted-foreground">
                    <span>{listing.capacity} guests</span>
                  </div>
                </div>

                {/* Description */}
                <div className="pb-8 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold mb-4">
                    About this place
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>

                {/* Facilities */}
                {listing.facilities && listing.facilities.length > 0 && (
                  <div className="pb-8 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold mb-6">
                      Basic facilities
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {listing.facilities.slice(0, 6).map((facility) => {
                        const facilityData = facilities.get(
                          facility.facilityId
                        );
                        return (
                          <div
                            key={facility.facilityId}
                            className="flex items-center gap-4"
                          >
                            {facilityData && (
                              <>
                                <span className="text-3xl">
                                  {facilityData.icon}
                                </span>
                                <div>
                                  <p className="text-base font-medium">
                                    {facilityData.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {facility.quantity}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {listing.facilities.length > 6 && (
                      <button className="mt-6 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                        Show all {listing.facilities.length} facilities
                      </button>
                    )}
                  </div>
                )}

                {/* Amenities */}
                {listing.amenityIds && listing.amenityIds.length > 0 && (
                  <div className="pb-8 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold mb-6">
                      What this place offers
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {listing.amenityIds.slice(0, 10).map((amenityId) => {
                        const amenityData = amenities.get(amenityId);
                        return (
                          <div
                            key={amenityId}
                            className="flex items-center gap-4"
                          >
                            {amenityData && (
                              <>
                                <span className="text-2xl">
                                  {amenityData.icon}
                                </span>
                                <span className="text-base">
                                  {amenityData.name}
                                </span>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {listing.amenityIds.length > 10 && (
                      <button className="mt-6 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                        Show all {listing.amenityIds.length} amenities
                      </button>
                    )}
                  </div>
                )}

                {/* Location */}
                {listing.latitude && listing.longitude && (
                  <div className="pb-8 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold mb-6">Location</h2>
                    <div className="w-full h-[480px] rounded-2xl overflow-hidden mb-6 border">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${listing.latitude},${listing.longitude}&zoom=15`}
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-lg">{listing.address}</p>
                      <p className="text-sm text-muted-foreground">
                        Coordinates: {listing.latitude.toFixed(6)},{" "}
                        {listing.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Host Profile - Moved below map */}
                {listing.host && (
                  <div className="pb-8">
                    <h2 className="text-2xl font-semibold mb-6">
                      Meet the host
                    </h2>
                    <div className="flex items-center gap-6 mb-6">
                      {listing.host.avatarUrl ? (
                        <img
                          src={listing.host.avatarUrl}
                          alt={listing.host.hostDisplayName}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-medium">
                          {listing.host.hostDisplayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-2xl font-semibold">
                          {listing.host.hostDisplayName}
                        </p>
                        {listing.host.phoneNumber && (
                          <p className="text-sm text-muted-foreground">
                            {listing.host.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        navigate(`/host/${listing.host.hostId}/listings`)
                      }
                    >
                      View all listings from {listing.host.hostDisplayName}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Column - Sticky Price Card */}
              <div className="lg:col-span-1">
                <div className="border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24 bg-white">
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-semibold">
                        ${formatPrice(listing.price)}
                      </span>
                      <span className="text-muted-foreground text-lg">
                        / night
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {user?.id === listing.host.hostId ? (
                      <div className="text-center py-3 px-4 bg-muted rounded-lg">
                        <p className="text-muted-foreground">
                          This is your listing
                        </p>
                      </div>
                    ) : (
                      <>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={() => {
                            if (!user) {
                              toast.error("Please log in to book");
                              navigate("/login");
                              return;
                            }
                            setShowBookingDialog(true);
                          }}
                        >
                          Reserve
                        </Button>
                        <ChatButton
                          hostId={listing.host.hostId}
                          variant="outline"
                          className="w-full"
                        />
                        <p className="text-sm text-center text-muted-foreground">
                          You won't be charged yet
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">
                        Maximum guests
                      </span>
                      <span className="font-medium text-sm">
                        {listing.capacity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewSection
            listingId={listing.listingId}
            reviewType="HOME_LISTING"
            ratingSummary={ratingSummary}
            onReviewSubmitted={() => fetchReviews(listing.listingId)}
            isHostOwner={user?.id === listing.host.hostId}
          />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200">
            <Button variant="outline" onClick={() => navigate("/")} size="lg">
              Back to listings
            </Button>
            <Button size="lg" className="px-8">
              Contact host
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      {listing && (
        <HomeBookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          listingId={listing.listingId}
          listingTitle={listing.title}
          pricePerNight={listing.price}
          maxGuests={listing.capacity}
          onBookingSuccess={() => {
            toast.success("Booking successful!");
          }}
        />
      )}

      {/* All Photos Modal */}
      {showAllPhotos && listing.images && listing.images.length > 0 && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <X className="w-5 h-5" />
              Close
            </button>
          </div>
          <div className="container max-w-4xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 gap-4">
              {listing.images.map((image, index) => (
                <img
                  key={index}
                  src={image.image.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

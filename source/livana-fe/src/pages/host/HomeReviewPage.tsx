import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useHomeListingStore } from "@/stores/useHomeListingStore";
import { useFacilityStore } from "@/stores/useFacilityStore";
import { useAmenityStore } from "@/stores/useAmenityStore";
import { usePropertyTypeStore } from "@/stores/usePropertyTypeStore";
import { MapPin, X } from "lucide-react";

export function HomeReviewPage() {
  const navigate = useNavigate();
  const listing = useHomeListingStore();
  const { facilities } = useFacilityStore();
  const { amenities: amenitiesList } = useAmenityStore();
  const { propertyTypes } = usePropertyTypeStore();
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Get selected amenities details
  const selectedAmenities = amenitiesList.filter((a) =>
    listing.amenities.includes(a.id)
  );

  // Get property type name
  const propertyType = propertyTypes.find(
    (pt) => pt.id === listing.propertyTypeId
  );

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  useEffect(() => {
    // Console log all collected data
    const reviewData = {
      propertyTypeId: listing.propertyTypeId,
      roomType: listing.roomType,
      location: listing.location,
      guests: listing.guests,
      bedrooms: listing.bedrooms,
      beds: listing.beds,
      bathrooms: listing.bathrooms,
      amenities: listing.amenities,
      selectedAmenities: selectedAmenities.map((a) => ({
        id: a.id,
        name: a.name,
        icon: a.icon,
      })),
      photos: listing.photos.map((photo) => ({
        name: photo.name,
        size: photo.size,
        type: photo.type,
      })),
      title: listing.title,
      description: listing.description,
      basePrice: listing.basePrice,
    };

    console.log("========== HOME LISTING REVIEW DATA ==========");
    console.log(JSON.stringify(reviewData, null, 2));
    console.log("==============================================");
  }, [listing, selectedAmenities]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePublish = () => {
    // Here you would call the backend API to save the listing
    console.log("Publishing listing...");
    alert("Listing data logged to console. Ready for backend integration!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm text-muted-foreground mb-2">Preview</p>
          <h1 className="text-4xl font-semibold mb-8">{listing.title}</h1>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {propertyType?.name || "Property"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {listing.location?.address || "Location not set"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Photos Grid */}
          <div>
            <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
              {listing.photos[0] && (
                <div className="col-span-2 row-span-2 h-[400px]">
                  <img
                    src={URL.createObjectURL(listing.photos[0])}
                    alt="Main"
                    className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  />
                </div>
              )}
              {listing.photos.slice(1, 5).map((photo, index) => (
                <div key={index} className="h-[196px] relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Photo ${index + 2}`}
                    className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  />
                  {index === 3 && listing.photos.length > 5 && (
                    <button
                      onClick={() => setShowAllPhotos(true)}
                      className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-all flex items-center justify-center text-white font-semibold"
                    >
                      +{listing.photos.length - 5} more photos
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Property Info */}
              <div className="pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-semibold mb-4">
                  {listing.roomType === "entire-place"
                    ? "Entire place"
                    : "Private room"}
                </h2>
                <div className="flex items-center gap-3 text-lg text-muted-foreground">
                  <span>{listing.guests} guests</span>
                  <span>•</span>
                  <span>{listing.bedrooms} bedrooms</span>
                  <span>•</span>
                  <span>{listing.beds} beds</span>
                  <span>•</span>
                  <span>{listing.bathrooms} baths</span>
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
              {facilities.length > 0 && (
                <div className="pb-8 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold mb-6">Facilities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {facilities.slice(0, 6).map((facility) => (
                      <div
                        key={facility.id}
                        className="flex items-center gap-4"
                      >
                        <span className="text-3xl">{facility.icon}</span>
                        <div>
                          <p className="text-base font-medium">
                            {facility.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: 1
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {facilities.length > 6 && (
                    <button className="mt-6 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Show all {facilities.length} facilities
                    </button>
                  )}
                </div>
              )}

              {/* Amenities */}
              {selectedAmenities.length > 0 && (
                <div className="pb-8 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold mb-6">
                    What this place offers
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedAmenities.slice(0, 10).map((amenity) => (
                      <div key={amenity.id} className="flex items-center gap-4">
                        <span className="text-2xl">{amenity.icon}</span>
                        <span className="text-base">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                  {selectedAmenities.length > 10 && (
                    <button className="mt-6 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Show all {selectedAmenities.length} amenities
                    </button>
                  )}
                </div>
              )}

              {/* Location */}
              {listing.location && (
                <div className="pb-8">
                  <h2 className="text-2xl font-semibold mb-6">
                    Where you'll be
                  </h2>
                  <div className="w-full h-[480px] rounded-2xl overflow-hidden mb-6 border">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${listing.location.latitude},${listing.location.longitude}&zoom=15`}
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">
                      {listing.location.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {listing.location.latitude.toFixed(6)},{" "}
                      {listing.location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sticky Price Card */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24 bg-white">
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-semibold">
                      ₫{formatPrice(listing.basePrice)}
                    </span>
                    <span className="text-muted-foreground text-lg">
                      / night
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Base price per night
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-muted-foreground">
                      Property type
                    </span>
                    <span className="font-medium text-sm">
                      {propertyType?.name || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-muted-foreground">
                      Room type
                    </span>
                    <span className="font-medium text-sm">
                      {listing.roomType === "entire-place"
                        ? "Entire place"
                        : "Private room"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-muted-foreground">
                      Max guests
                    </span>
                    <span className="font-medium text-sm">
                      {listing.guests}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200">
          <Button variant="outline" onClick={handleBack} size="lg">
            Back
          </Button>
          <Button onClick={handlePublish} size="lg" className="px-8">
            Publish Listing
          </Button>
        </div>
      </div>

      {/* All Photos Modal */}
      {showAllPhotos && (
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
              {listing.photos.map((photo, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(photo)}
                  alt={`Photo ${index + 1}`}
                  className="w-full rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

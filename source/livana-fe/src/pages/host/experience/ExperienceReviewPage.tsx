import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useExperienceListingStore } from "@/stores/useExperienceListingStore";
import { useExperienceCategoryStore } from "@/stores/useExperienceCategoryStore";
import { MapPin, Users, X, Pencil } from "lucide-react";
import { toast } from "sonner";

export function ExperienceReviewPage() {
  const navigate = useNavigate();
  const listing = useExperienceListingStore();
  const { experienceCategories } = useExperienceCategoryStore();
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const category = experienceCategories.find(
    (c) => c.id === listing.experienceCategoryId
  );

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  useEffect(() => {
    console.log("========== EXPERIENCE LISTING STATE ==========");
    console.log("Experience Category ID:", listing.experienceCategoryId);
    console.log("Capacity:", listing.capacity);
    console.log("Location:", listing.location);
    console.log("Photos count:", listing.photos.length);
    console.log("Title:", listing.title);
    console.log("Description:", listing.description);
    console.log("Base Price:", listing.basePrice);
    console.log("Sessions count:", listing.sessions.length);
    console.log("Sessions:", listing.sessions);
    console.log("==============================================");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePublish = async () => {
    console.log("========== VALIDATING REQUIRED FIELDS ==========");
    console.log("Location:", listing.location);
    console.log("Experience Category ID:", listing.experienceCategoryId);
    console.log("==============================================");

    if (!listing.location || !listing.experienceCategoryId) {
      toast.error("Missing required information");
      console.error("MISSING:", {
        location: listing.location ? "✓" : "✗ MISSING",
        experienceCategoryId: listing.experienceCategoryId ? "✓" : "✗ MISSING",
      });
      return;
    }

    // Map photos to images with order (List<ImageOrderDto>)
    const images = listing.photos.map((photo, index) => ({
      image: photo,
      order: index + 1,
    }));

    const payload = {
      title: listing.title,
      price: listing.basePrice,
      description: listing.description,
      capacity: listing.capacity,
      address: listing.location.address,
      latitude: listing.location.latitude,
      longitude: listing.location.longitude,
      experienceCategoryId: listing.experienceCategoryId,
      images,
    };

    console.log("========== PAYLOAD TO BACKEND ==========");
    console.log(JSON.stringify(payload, null, 2));
    console.log("==============================================");
    console.log("Photos as File objects:", listing.photos);
    console.log("==============================================");
    console.log("========== SESSIONS DATA TO CREATE ==========");
    console.log("Sessions count:", listing.sessions.length);
    console.log("Sessions data:", JSON.stringify(listing.sessions, null, 2));
    console.log("==============================================");

    // COMMENTED OUT API CALL - LOGGING DATA INSTEAD
    /*
    try {
      const response = await listing.createListing(payload);
      console.log("Experience listing created successfully:", response.data);
      toast.success("Experience published successfully!");
      listing.clearState();
      navigate("/my-listings");
    } catch (error: any) {
      console.error("Error creating listing:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to publish experience";
      toast.error(errorMessage);
    }
    */

    // Instead, just show success message for validation
    toast.success("Payload validated! Check console for data.");
    console.log("✅ All data validated successfully!");
    console.log(
      "📦 Ready to send to API endpoint: POST /api/v1/listings/experiences"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm text-muted-foreground mb-2">Preview</p>
          <div className="flex items-center justify-between mb-8 group">
            <h1 className="text-4xl font-semibold">{listing.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/host/experiences/title?edit=true")}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category?.icon}</span>
              <span className="font-semibold">
                {category?.name || "Experience"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Up to {listing.capacity} guests
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
            <div className="flex items-center justify-between mb-4 group">
              <h2 className="text-2xl font-semibold">Photos</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/host/experiences/photos?edit=true")}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
              {listing.photos[0] && (
                <div className="col-span-2 row-span-2 h-[400px]">
                  <img
                    src={
                      typeof listing.photos[0] === "string"
                        ? listing.photos[0]
                        : URL.createObjectURL(listing.photos[0])
                    }
                    alt="Main"
                    className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  />
                </div>
              )}
              {listing.photos.slice(1, 5).map((photo, index) => (
                <div key={index} className="h-[196px] relative">
                  <img
                    src={
                      typeof photo === "string" ? photo : URL.createObjectURL(photo)
                    }
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
              {/* Experience Info */}
              <div className="pb-8 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4 group">
                  <h2 className="text-2xl font-semibold">
                    {category?.name || "Experience"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigate("/host/experiences/capacity?edit=true")
                    }
                    title="Edit Capacity"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 text-lg text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>Up to {listing.capacity} guests</span>
                </div>
              </div>

              {/* Description */}
              <div className="pb-8 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4 group">
                  <h2 className="text-2xl font-semibold">
                    About this experience
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigate("/host/experiences/description?edit=true")
                    }
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Available Sessions */}
              {listing.sessions.length > 0 && (
                <div className="pb-8 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4 group">
                    <h2 className="text-2xl font-semibold">
                      Available Sessions
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate("/host/experience-listings/sessions?edit=true")
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listing.sessions.map((session, index) => {
                      const start = new Date(session.startTime);
                      const end = new Date(session.endTime);
                      const duration = Math.floor(
                        (end.getTime() - start.getTime()) / (1000 * 60)
                      );
                      const hours = Math.floor(duration / 60);
                      const minutes = duration % 60;
                      const durationText =
                        hours > 0 && minutes > 0
                          ? `${hours}h ${minutes}m`
                          : hours > 0
                          ? `${hours}h`
                          : `${minutes}m`;

                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </div>
                              <span className="font-medium text-gray-900">
                                Session {index + 1}
                              </span>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {durationText}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>
                                {start.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>
                                {start.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                {" - "}
                                {end.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Location */}
              {listing.location && (
                <div className="pb-8">
                  <div className="flex items-center justify-between mb-6 group">
                    <h2 className="text-2xl font-semibold">Where you'll be</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate("/host/experiences/location?edit=true")
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
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

            {/* Right Column - Pricing Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 border border-gray-200 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6 group">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold">
                        ₫{formatPrice(listing.basePrice)}
                      </span>
                      <span className="text-base text-muted-foreground">
                        per person
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Before taxes: ₫
                      {formatPrice(Math.round(listing.basePrice * 1.14))}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigate("/host/experiences/price?edit=true")
                    }
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category?.icon}</span>
                    <span className="font-medium">{category?.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <span>Up to {listing.capacity} guests</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
          <Button variant="ghost" onClick={handleBack} size="lg">
            Back
          </Button>
          <Button onClick={handlePublish} size="lg">
            Publish Experience
          </Button>
        </div>
      </div>

      {/* Full screen photo modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen p-8">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-4xl mx-auto space-y-4 pt-16">
              {listing.photos.map((photo, index) => (
                <img
                  key={index}
                  src={
                    typeof photo === "string" ? photo : URL.createObjectURL(photo)
                  }
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

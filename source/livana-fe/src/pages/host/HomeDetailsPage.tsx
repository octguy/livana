import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useHomeListingStore } from "@/stores/useHomeListingStore";
import { useFacilityStore } from "@/stores/useFacilityStore";
import { useAmenityStore } from "@/stores/useAmenityStore";
import { Minus, Plus } from "lucide-react";

export function HomeDetailsPage() {
  const navigate = useNavigate();
  const { guests, amenities, setBasicInfo, setAmenities } =
    useHomeListingStore();

  const {
    facilities,
    loading: facilitiesLoading,
    getAllFacilities,
  } = useFacilityStore();
  const {
    amenities: amenitiesList,
    loading: amenitiesLoading,
    getAllAmenities,
  } = useAmenityStore();

  const [guestsCount, setGuestsCount] = useState(guests);
  const [facilityValues, setFacilityValues] = useState<Record<string, number>>(
    {}
  );
  const [selectedAmenities, setSelectedAmenities] =
    useState<string[]>(amenities);

  useEffect(() => {
    getAllFacilities();
    getAllAmenities();
  }, [getAllFacilities, getAllAmenities]);

  // Initialize facility values from store or defaults
  useEffect(() => {
    if (facilities.length > 0) {
      const initialValues: Record<string, number> = {};
      facilities.forEach((facility) => {
        initialValues[facility.id] = 1; // Default value
      });
      setFacilityValues(initialValues);
    }
  }, [facilities]);

  // Split amenities into three groups
  const guestFavorites = amenitiesList.slice(0, 8);
  const standoutAmenities = amenitiesList.slice(8, 22);
  const safetyItems = amenitiesList.slice(22, 26);

  const handleAmenityToggle = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleFacilityChange = (facilityId: string, value: number) => {
    setFacilityValues((prev) => ({
      ...prev,
      [facilityId]: Math.max(1, value),
    }));
  };

  const handleNext = () => {
    // Collect facility values and store them
    // facilityValues contains {facilityId: quantity}
    // This will be used later when saving the listing to the database

    setBasicInfo(guestsCount, 0, 0, 0); // Only guests is set, others come from facilities
    setAmenities(selectedAmenities);

    // You can store facilityValues in the listing store if needed
    // For now, navigate to next step (e.g., photos, title, description)
    navigate("/host/homes/photos");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-16 px-6">
        {/* Section 1: Share basics */}
        <div className="mb-16">
          <h1 className="text-3xl font-semibold mb-4">
            Share some basics about your place
          </h1>
          <p className="text-muted-foreground mb-8">
            You'll add more details later, like bed types.
          </p>

          {facilitiesLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading facilities...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Guests - separate field */}
              <div className="flex items-center justify-between py-6 border-b border-gray-300">
                <span className="text-lg">Guests</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                    className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={guestsCount <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{guestsCount}</span>
                  <button
                    onClick={() => setGuestsCount(guestsCount + 1)}
                    className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:border-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic facilities from API */}
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="flex items-center justify-between py-6 border-b border-gray-300"
                >
                  <span className="text-lg">{facility.name}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        handleFacilityChange(
                          facility.id,
                          (facilityValues[facility.id] || 1) - 1
                        )
                      }
                      className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={(facilityValues[facility.id] || 1) <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">
                      {facilityValues[facility.id] || 1}
                    </span>
                    <button
                      onClick={() =>
                        handleFacilityChange(
                          facility.id,
                          (facilityValues[facility.id] || 1) + 1
                        )
                      }
                      className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:border-foreground transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Guest favorites */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">
            Tell guests what your place has to offer
          </h2>
          <p className="text-muted-foreground mb-6">
            You can add more amenities after you publish your listing.
          </p>

          <h3 className="text-lg font-medium mb-4">
            What about these guest favorites?
          </h3>
          {amenitiesLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading amenities...
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {guestFavorites.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => handleAmenityToggle(amenity.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedAmenities.includes(amenity.id)
                      ? "border-foreground bg-muted/50"
                      : "border-gray-300 hover:border-foreground/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{amenity.icon}</div>
                  <div className="text-sm font-medium">{amenity.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Standout amenities */}
        <div className="mb-16">
          <h3 className="text-lg font-medium mb-4">
            Do you have any standout amenities?
          </h3>
          {amenitiesLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading amenities...
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {standoutAmenities.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => handleAmenityToggle(amenity.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedAmenities.includes(amenity.id)
                      ? "border-foreground bg-muted/50"
                      : "border-gray-300 hover:border-foreground/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{amenity.icon}</div>
                  <div className="text-sm font-medium">{amenity.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Safety items */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold mb-6">
            Do you have any of these safety items?
          </h3>
          {amenitiesLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading amenities...
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {safetyItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAmenityToggle(item.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedAmenities.includes(item.id)
                      ? "border-foreground bg-muted/50"
                      : "border-gray-300 hover:border-foreground/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium">{item.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} size="lg">
            Back
          </Button>
          <Button onClick={handleNext} size="lg">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

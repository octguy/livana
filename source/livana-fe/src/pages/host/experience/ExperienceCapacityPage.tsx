import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router";
import { useExperienceListingStore } from "@/stores/useExperienceListingStore";
import { Minus, Plus } from "lucide-react";

export function ExperienceCapacityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const { capacity, setCapacity } = useExperienceListingStore();
  const [capacityValue, setCapacityValue] = useState(capacity || 1);

  const handleIncrement = () => {
    setCapacityValue((prev) => Math.min(prev + 1, 100));
  };

  const handleDecrement = () => {
    setCapacityValue((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCapacity(capacityValue);
    navigate(
      isEditMode ? "/host/experiences/review" : "/host/experiences/photos"
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-semibold mb-4">
          How many guests can join your experience?
        </h1>
        <p className="text-muted-foreground mb-12">
          Set the maximum number of guests who can participate at once.
        </p>

        <div className="mb-12">
          <div className="flex items-center justify-between py-6 border-b">
            <div>
              <p className="font-medium text-lg">Maximum guests</p>
              <p className="text-sm text-muted-foreground">
                Number of people who can attend
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={capacityValue <= 1}
                className="rounded-full w-10 h-10"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-medium w-12 text-center">
                {capacityValue}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={capacityValue >= 100}
                className="rounded-full w-10 h-10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

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

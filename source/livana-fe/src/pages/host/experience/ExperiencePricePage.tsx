import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router";
import { useExperienceListingStore } from "@/stores/useExperienceListingStore";

export function ExperiencePricePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const { basePrice, setBasePrice } = useExperienceListingStore();

  const [priceValue, setPriceValue] = useState(basePrice || 0);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = value === "" ? 0 : parseInt(value, 10);
    setPriceValue(numValue);
  };

  const handleNext = () => {
    if (priceValue <= 0) {
      alert("Please enter a valid price");
      return;
    }
    setBasePrice(priceValue);
    navigate(
      isEditMode
        ? "/host/experiences/review"
        : "/host/experience-listings/sessions"
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const priceWithTax = Math.round(priceValue * 1.14);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-semibold mb-4">
          Now, set your price per person
        </h1>
        <p className="text-muted-foreground mb-12">
          You can change it anytime.
        </p>

        <div className="text-center mb-8">
          <div className="mb-4">
            <input
              type="text"
              value={priceValue === 0 ? "" : formatPrice(priceValue)}
              onChange={handlePriceChange}
              className="text-6xl font-semibold text-center w-full border-none outline-none focus:ring-0 bg-transparent"
              placeholder="₫0"
            />
          </div>
          <p className="text-muted-foreground">
            Guest price before taxes ₫{formatPrice(priceWithTax)}
          </p>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
            <svg
              className="w-4 h-4 text-pink-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">
              Competitive pricing for experiences
            </span>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-6">
          <h3 className="font-semibold mb-4">Pricing tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Research similar experiences in your area</li>
            <li>• Consider your costs and time commitment</li>
            <li>• Factor in materials or supplies included</li>
            <li>• Remember that guests pay per person</li>
          </ul>
        </div>

        <div className="flex gap-2 mb-8 mt-16">
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div className="flex-1 h-1 bg-foreground rounded"></div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} size="lg">
            Back
          </Button>
          <Button onClick={handleNext} size="lg" disabled={priceValue <= 0}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

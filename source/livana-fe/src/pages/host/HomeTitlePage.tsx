import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useHomeListingStore } from "@/stores/useHomeListingStore";

export function HomeTitlePage() {
  const navigate = useNavigate();
  const { title, setTitle } = useHomeListingStore();

  const [titleValue, setTitleValue] = useState(title || "");
  const maxLength = 50;

  const handleNext = () => {
    if (titleValue.trim().length === 0) {
      alert("Please enter a title for your listing");
      return;
    }
    setTitle(titleValue);
    navigate("/host/homes/description");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-semibold mb-4">
          Now, let's give your house a title
        </h1>
        <p className="text-muted-foreground mb-8">
          Short titles work best. Have fun with it—you can always change it
          later.
        </p>

        {/* Title input */}
        <div className="mb-4">
          <textarea
            value={titleValue}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setTitleValue(e.target.value);
              }
            }}
            className="w-full min-h-[200px] p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-foreground transition-colors text-lg"
            placeholder="Example: Cozy apartment with amazing city views"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {titleValue.length}/{maxLength}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8 mt-16">
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div
            className={`flex-1 h-1 rounded ${
              titleValue.trim().length > 0 ? "bg-foreground" : "bg-gray-300"
            }`}
          ></div>
          <div className="flex-1 h-1 bg-gray-300 rounded"></div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} size="lg">
            Back
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            disabled={titleValue.trim().length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

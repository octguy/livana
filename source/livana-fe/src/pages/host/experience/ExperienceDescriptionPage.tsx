import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router";
import { useExperienceListingStore } from "@/stores/useExperienceListingStore";

export function ExperienceDescriptionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const { description, setDescription } = useExperienceListingStore();

  const [descriptionValue, setDescriptionValue] = useState(description || "");
  const maxLength = 500;

  const handleNext = () => {
    if (descriptionValue.trim().length === 0) {
      alert("Please enter a description for your experience");
      return;
    }
    setDescription(descriptionValue);
    navigate(
      isEditMode ? "/host/experiences/review" : "/host/experiences/price"
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-semibold mb-4">Create your description</h1>
        <p className="text-muted-foreground mb-8">
          Share what makes your experience unique. What will guests do? What
          will they learn?
        </p>

        <div className="mb-4">
          <textarea
            value={descriptionValue}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setDescriptionValue(e.target.value);
              }
            }}
            className="w-full min-h-[300px] p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-foreground transition-colors text-base"
            placeholder="Describe your experience, what guests will do, what they'll learn, and what makes it special..."
          />
          <p className="text-sm text-muted-foreground mt-2">
            {descriptionValue.length}/{maxLength}
          </p>
        </div>

        <div className="flex gap-2 mb-8 mt-16">
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div
            className={`flex-1 h-1 rounded ${
              descriptionValue.trim().length > 0
                ? "bg-foreground"
                : "bg-gray-300"
            }`}
          ></div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} size="lg">
            Back
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            disabled={descriptionValue.trim().length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router";
import { useExperienceListingStore } from "@/stores/useExperienceListingStore";

export function ExperienceTitlePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const { title, setTitle } = useExperienceListingStore();

  const [titleValue, setTitleValue] = useState(title || "");
  const maxLength = 50;

  const handleNext = () => {
    if (titleValue.trim().length === 0) {
      alert("Please enter a title for your experience");
      return;
    }
    setTitle(titleValue);
    navigate(
      isEditMode ? "/host/experiences/review" : "/host/experiences/description"
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-semibold mb-4">
          Now, let's give your experience a title
        </h1>
        <p className="text-muted-foreground mb-8">
          Short titles work best. Have fun with it—you can always change it
          later.
        </p>

        <div className="mb-4">
          <textarea
            value={titleValue}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setTitleValue(e.target.value);
              }
            }}
            className="w-full min-h-[200px] p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-foreground transition-colors text-lg"
            placeholder="Example: Traditional Cooking Class with Local Chef"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {titleValue.length}/{maxLength}
          </p>
        </div>

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

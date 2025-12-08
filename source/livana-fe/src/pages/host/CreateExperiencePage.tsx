import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useExperienceCategoryStore } from "@/stores/useExperienceCategoryStore";

type ExperienceType = string | null;

export function CreateExperiencePage() {
  const navigate = useNavigate();
  const [experienceType, setExperienceType] = useState<ExperienceType>(null);
  const { experienceCategories, loading, getAllExperienceCategories } =
    useExperienceCategoryStore();

  useEffect(() => {
    getAllExperienceCategories();
  }, [getAllExperienceCategories]);

  const handleNext = () => {
    if (experienceType) {
      console.log("Creating experience listing:", { experienceType });
      navigate("/host/experiences/details");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-5xl">
          <h1 className="text-5xl font-semibold mb-16 text-center">
            What experience will you offer guests?
          </h1>

          {loading ? (
            <div className="text-center py-12">
              Loading experience categories...
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-6 mb-16">
              {experienceCategories.map((category) => {
                const isSelected = experienceType === category.id;
                return (
                  <button
                    key={category.id}
                    className={`
                      relative flex flex-col items-start gap-6 p-6 rounded-xl border-2 transition-all bg-white
                      ${
                        isSelected
                          ? "border-foreground bg-muted/50"
                          : "border-border hover:border-foreground/50"
                      }
                    `}
                    onClick={() => setExperienceType(category.id)}
                  >
                    <span className="text-4xl">{category.icon}</span>
                    <span className="text-base font-medium">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} size="lg">
              Back
            </Button>
            <Button onClick={handleNext} disabled={!experienceType} size="lg">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

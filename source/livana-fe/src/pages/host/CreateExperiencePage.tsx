import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
          <h1 className="text-5xl font-semibold mb-16 text-center text-primary-foreground">
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
                  <Card
                    key={category.id}
                    className={`
                      relative flex flex-col items-center justify-center gap-4 p-10 cursor-pointer transition-all hover:shadow-lg
                      ${
                        isSelected
                          ? "border-2 border-foreground bg-muted/50"
                          : "border-2 border-transparent hover:border-foreground/30"
                      }
                    `}
                    onClick={() => setExperienceType(category.id)}
                  >
                    <div className="text-7xl mb-2">{category.icon}</div>
                    <span className="text-base font-medium text-center">
                      {category.name}
                    </span>
                  </Card>
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

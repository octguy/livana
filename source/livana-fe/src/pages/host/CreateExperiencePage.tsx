import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { Palette, Pizza, Landmark, TentTree, WavesLadder } from "lucide-react";

type ExperienceType =
  | "art-design"
  | "fitness-wellness"
  | "food-drink"
  | "history-culture"
  | "nature-outdoors"
  | null;

const experienceTypes = [
  {
    value: "art-design",
    label: "Art and design",
    image: <Palette className="h-12 w-12" />,
  },
  {
    value: "fitness-wellness",
    label: "Fitness and wellness",
    image: <WavesLadder className="h-12 w-12" />,
  },
  {
    value: "food-drink",
    label: "Food and drink",
    image: <Pizza className="h-12 w-12" />,
  },
  {
    value: "history-culture",
    label: "History and culture",
    image: <Landmark className="h-12 w-12" />,
  },
  {
    value: "nature-outdoors",
    label: "Nature and outdoors",
    image: <TentTree className="h-12 w-12" />,
  },
];

export function CreateExperiencePage() {
  const navigate = useNavigate();
  const [experienceType, setExperienceType] = useState<ExperienceType>(null);

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

          <div className="grid grid-cols-5 gap-6 mb-16">
            {experienceTypes.map((type) => {
              const isSelected = experienceType === type.value;
              return (
                <Card
                  key={type.value}
                  className={`
                    relative flex flex-col items-center justify-center gap-4 p-10 cursor-pointer transition-all hover:shadow-lg
                    ${
                      isSelected
                        ? "border-2 border-foreground bg-muted/50"
                        : "border-2 border-transparent hover:border-foreground/30"
                    }
                  `}
                  onClick={() =>
                    setExperienceType(type.value as ExperienceType)
                  }
                >
                  <div className="text-7xl mb-2">{type.image}</div>
                  <span className="text-base font-medium text-center">
                    {type.label}
                  </span>
                </Card>
              );
            })}
          </div>

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

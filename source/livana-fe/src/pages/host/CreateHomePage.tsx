import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import {
  Home as HomeIcon,
  Building2,
  Castle,
  Warehouse,
  Mountain,
  Ship,
  Caravan,
  Church,
  Container,
} from "lucide-react";

type HomeType =
  | "house"
  | "apartment"
  | "barn"
  | "bed-breakfast"
  | "boat"
  | "cabin"
  | "camper-rv"
  | "casa-particular"
  | "castle"
  | "cave"
  | "container"
  | "cycladic-home"
  | null;
type RoomType = "entire-place" | "room" | "shared-room" | null;

const homeTypes = [
  { value: "house", label: "House", icon: HomeIcon },
  { value: "apartment", label: "Apartment", icon: Building2 },
  { value: "barn", label: "Barn", icon: Warehouse },
  { value: "bed-breakfast", label: "Bed & breakfast", icon: HomeIcon },
  { value: "boat", label: "Boat", icon: Ship },
  { value: "cabin", label: "Cabin", icon: Mountain },
  { value: "camper-rv", label: "Camper/RV", icon: Caravan },
  { value: "casa-particular", label: "Casa particular", icon: HomeIcon },
  { value: "castle", label: "Castle", icon: Castle },
  { value: "cave", label: "Cave", icon: Mountain },
  { value: "container", label: "Container", icon: Container },
  { value: "cycladic-home", label: "Cycladic home", icon: Church },
];

export function CreateHomePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [homeType, setHomeType] = useState<HomeType>(null);
  const [roomType, setRoomType] = useState<RoomType>(null);

  const handleNext = () => {
    if (step === 1 && homeType) {
      setStep(2);
    } else if (step === 2 && roomType) {
      console.log("Creating home listing:", { homeType, roomType });
      navigate("/host/homes/details");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-16 px-6">
        {/* Step 1: Select home type */}
        {step === 1 && (
          <div>
            <h1 className="text-4xl font-semibold mb-12 text-center">
              Which of these best describes your place?
            </h1>

            <div className="grid grid-cols-3 gap-4 mb-16">
              {homeTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = homeType === type.value;
                return (
                  <button
                    key={type.value}
                    className={`
                      relative flex flex-col items-start gap-6 p-6 rounded-xl border-2 transition-all
                      ${
                        isSelected
                          ? "border-foreground bg-muted/50"
                          : "border-border hover:border-foreground/50"
                      }
                    `}
                    onClick={() => setHomeType(type.value as HomeType)}
                  >
                    <Icon className="h-8 w-8" />
                    <span className="text-base font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Select room type */}
        {step === 2 && (
          <div>
            <h1 className="text-4xl font-semibold mb-12 text-center">
              What type of place will guests have?
            </h1>

            <div className="space-y-4 mb-16">
              <button
                className={`
                  w-full flex items-start gap-4 p-6 rounded-xl border-2 transition-all text-left
                  ${
                    roomType === "entire-place"
                      ? "border-foreground bg-muted/50"
                      : "border-border hover:border-foreground/50"
                  }
                `}
                onClick={() => setRoomType("entire-place")}
              >
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1">
                    An entire place
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Guests have the whole place to themselves
                  </div>
                </div>
              </button>

              <button
                className={`
                  w-full flex items-start gap-4 p-6 rounded-xl border-2 transition-all text-left
                  ${
                    roomType === "room"
                      ? "border-foreground bg-muted/50"
                      : "border-border hover:border-foreground/50"
                  }
                `}
                onClick={() => setRoomType("room")}
              >
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1">A room</div>
                  <div className="text-sm text-muted-foreground">
                    Guests have their own room in a home, plus access to shared
                    spaces
                  </div>
                </div>
              </button>

              <button
                className={`
                  w-full flex items-start gap-4 p-6 rounded-xl border-2 transition-all text-left
                  ${
                    roomType === "shared-room"
                      ? "border-foreground bg-muted/50"
                      : "border-border hover:border-foreground/50"
                  }
                `}
                onClick={() => setRoomType("shared-room")}
              >
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1">
                    A shared room
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Guests sleep in a room or common area that may be shared
                    with you or others
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        <Button variant="ghost" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={step === 1 ? !homeType : !roomType}
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

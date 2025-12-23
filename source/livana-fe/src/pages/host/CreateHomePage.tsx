import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { usePropertyTypeStore } from "@/stores/usePropertyTypeStore";
import { useHomeListingStore } from "@/stores/useHomeListingStore";

type HomeType = string | null;
type RoomType = "entire-place" | "room" | "shared-room" | null;

export function CreateHomePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [homeType, setHomeType] = useState<HomeType>(null);
  const [roomType, setRoomType] = useState<RoomType>(null);
  const { propertyTypes, loading, getAllPropertyTypes } =
    usePropertyTypeStore();
  const { setPropertyType, setRoomType: setListingRoomType } =
    useHomeListingStore();

  useEffect(() => {
    getAllPropertyTypes();
  }, [getAllPropertyTypes]);

  const handleNext = () => {
    if (step === 1 && homeType) {
      setStep(2);
    } else if (step === 2 && roomType) {
      // Save to global store
      if (homeType) {
        setPropertyType(homeType);
      }
      setListingRoomType(roomType);

      console.log("Creating home listing:", { homeType, roomType });
      navigate("/host/homes/location");
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

            {loading ? (
              <div className="text-center py-12">Loading property types...</div>
            ) : (
              <div className="grid grid-cols-3 gap-4 mb-16">
                {propertyTypes.map((type) => {
                  const isSelected = homeType === type.id;
                  return (
                    <button
                      key={type.id}
                      className={`
                        relative flex flex-col items-start gap-6 p-6 rounded-xl border-2 transition-all
                        ${
                          isSelected
                            ? "border-foreground bg-muted/50"
                            : "border-border hover:border-foreground/50"
                        }
                      `}
                      onClick={() => setHomeType(type.id)}
                    >
                      <span className="text-4xl">{type.icon}</span>
                      <span className="text-base font-medium">{type.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
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

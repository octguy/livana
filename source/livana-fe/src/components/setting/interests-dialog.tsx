import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const INTERESTS = [
  { id: "food-scenes", label: "Food scenes", icon: "🍜" },
  { id: "live-music", label: "Live music", icon: "🎵" },
  { id: "outdoors", label: "Outdoors", icon: "⛰️" },
  { id: "photography", label: "Photography", icon: "📷" },
  { id: "coffee", label: "Coffee", icon: "☕" },
  { id: "movies", label: "Movies", icon: "🎬" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "animals", label: "Animals", icon: "🐾" },
  { id: "cooking", label: "Cooking", icon: "🍳" },
  { id: "reading", label: "Reading", icon: "📖" },
  { id: "museums", label: "Museums", icon: "🏛️" },
  { id: "architecture", label: "Architecture", icon: "🏛️" },
  { id: "history", label: "History", icon: "🌍" },
  { id: "walking", label: "Walking", icon: "🚶" },
  { id: "local-culture", label: "Local culture", icon: "📚" },
  { id: "live-sports", label: "Live sports", icon: "🏟️" },
];

interface InterestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInterests: string[];
  onSave: (interests: string[]) => void;
}

export function InterestsDialog({
  open,
  onOpenChange,
  selectedInterests: initialSelected,
  onSave,
}: InterestsDialogProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            What are you into?
          </DialogTitle>
          <p className="text-muted-foreground">
            Pick some interests you enjoy that you want to show on your profile.
          </p>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mt-4">
          {INTERESTS.map((interest) => (
            <Button
              key={interest.id}
              type="button"
              variant={selected.includes(interest.id) ? "default" : "outline"}
              className="rounded-full"
              onClick={() => toggleInterest(interest.id)}
            >
              <span className="mr-2">{interest.icon}</span>
              {interest.label}
            </Button>
          ))}
        </div>

        <Button variant="link" className="mt-2 w-fit">
          Show all
        </Button>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            {selected.length}/20 selected
          </span>
          <Button onClick={handleSave} size="lg" className="rounded-lg">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

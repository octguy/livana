import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X } from "lucide-react";
import { useInterestStore } from "@/stores/useInterestStore";

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
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { interests, getAllInterests, loading } = useInterestStore();

  useEffect(() => {
    if (open && interests.length === 0) {
      getAllInterests();
    }
  }, [open, interests.length, getAllInterests]);

  useEffect(() => {
    if (!open) {
      setShowAll(false);
      setSearchQuery("");
    }
  }, [open]);

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selected);
    onOpenChange(false);
  };

  const filteredInterests = interests.filter((interest) =>
    interest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedInterests = showAll
    ? filteredInterests
    : filteredInterests.slice(0, 20);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {showAll ? "Interests" : "What are you into?"}
          </DialogTitle>
          {!showAll && (
            <p className="text-muted-foreground">
              Pick some interests you enjoy that you want to show on your
              profile.
            </p>
          )}
        </DialogHeader>

        {showAll && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for interests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 rounded-full"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-muted-foreground">Loading interests...</p>
          ) : showAll ? (
            <div className="space-y-0">
              {displayedInterests.map((interest) => (
                <div
                  key={interest.id}
                  className="flex items-center space-x-3 py-4 border-b border-border last:border-b-0 cursor-pointer"
                  onClick={() => toggleInterest(interest.id)}
                >
                  <Checkbox
                    checked={selected.includes(interest.id)}
                    onCheckedChange={() => toggleInterest(interest.id)}
                    className="border-black cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-2xl">{interest.icon}</span>
                  <span className="flex-1">{interest.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {displayedInterests.map((interest) => (
                <Button
                  key={interest.id}
                  type="button"
                  variant={
                    selected.includes(interest.id) ? "default" : "outline"
                  }
                  className="rounded-full cursor-pointer"
                  onClick={() => toggleInterest(interest.id)}
                >
                  <span className="mr-2">{interest.icon}</span>
                  {interest.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {!showAll && (
          <Button
            variant="link"
            className="mt-2 w-fit cursor-pointer"
            onClick={() => setShowAll(true)}
          >
            Show all
          </Button>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            {selected.length}/20 selected
          </span>
          <Button
            onClick={handleSave}
            size="lg"
            className="rounded-lg cursor-pointer"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

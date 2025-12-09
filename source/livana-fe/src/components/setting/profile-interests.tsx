import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { InterestsDialog } from "./interests-dialog";
import { useInterestStore } from "@/stores/useInterestStore";
import { Badge } from "@/components/ui/badge";

export function ProfileInterests() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    userInterests,
    getUserInterests,
    updateUserInterests,
    interests,
    getAllInterestsWithoutPagination,
  } = useInterestStore();

  useEffect(() => {
    getUserInterests();
    if (interests.length === 0) {
      getAllInterestsWithoutPagination();
    }
  }, [getUserInterests, getAllInterestsWithoutPagination, interests.length]);

  const handleSave = async (interestIds: string[]) => {
    await updateUserInterests(interestIds);
    console.log("Selected interests to save:", interestIds);
  };

  const handleRemoveInterest = async (interestId: string) => {
    const updatedInterestIds =
      userInterests?.interests
        .filter((i) => i.id !== interestId)
        .map((i) => i.id) || [];
    await updateUserInterests(updatedInterestIds);
  };

  const selectedInterestIds = userInterests?.interests.map((i) => i.id) || [];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sở thích của tôi</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Tìm điểm chung với người dùng và chủ nhà khác bằng cách thêm sở thích
          vào hồ sơ của bạn.
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          {userInterests?.interests.map((interest) => (
            <Badge
              key={interest.id}
              variant="secondary"
              className="rounded-full px-4 py-2 text-base flex items-center gap-2"
            >
              <span>{interest.icon}</span>
              <span>{interest.name}</span>
              <button
                onClick={() => handleRemoveInterest(interest.id)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-dashed"
            onClick={() => setDialogOpen(true)}
          >
            <Heart className="h-4 w-4 mr-2" />
            Sửa sở thích
          </Button>
        </div>
      </div>

      <InterestsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedInterests={selectedInterestIds}
        onSave={handleSave}
      />
    </>
  );
}

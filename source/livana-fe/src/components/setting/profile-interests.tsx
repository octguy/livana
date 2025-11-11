import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function ProfileInterests() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Sở thích của tôi</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Tìm điểm chung với người dùng và chủ nhà khác bằng cách thêm sở thích
        vào hồ sơ của bạn.
      </p>

      <div className="flex gap-3 mb-4">
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-dashed"
        >
          <Heart className="h-4 w-4 mr-2" />
          Thêm sở thích
        </Button>
      </div>
    </div>
  );
}

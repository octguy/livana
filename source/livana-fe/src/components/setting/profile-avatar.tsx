import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

export function ProfileAvatar() {
  return (
    <div className="flex items-start gap-8 mb-12">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src="" alt="Avatar" />
          <AvatarFallback className="text-3xl">T</AvatarFallback>
        </Avatar>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-md"
        >
          <Camera className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Ảnh đại diện</h2>
        <p className="text-sm text-muted-foreground">
          Nhấn vào biểu tượng máy ảnh để thay đổi ảnh đại diện của bạn
        </p>
      </div>
    </div>
  );
}

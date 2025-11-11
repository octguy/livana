import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useRef } from "react";
import { cloudinaryService } from "@/services/cloudinaryService";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/stores/useAuthStore";

export function ProfileAvatar() {
  const user = useAuthStore((s) => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File name:", file.name);

      const response = await cloudinaryService.uploadImage(file);

      console.log("Cloudinary upload response:", response);

      const data = await response.json();

      console.log("Uploaded image URL:", data.secure_url);
      console.log("Uploaded image public ID:", data.public_id);

      const updatedData = {
        fullName: user?.fullName,
        phoneNumber: user?.phoneNumber,
        bio: user?.bio,
        avatarUrl: data.secure_url,
        avatarPublicId: data.public_id,
      };
      await userService.update(user!.id, updatedData);
    }
  };

  return (
    <div className="flex items-start gap-8 mb-12">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={user?.avatarUrl || ""} alt="Avatar" />
          <AvatarFallback className="text-3xl">
            {user?.fullName?.charAt(0).toUpperCase() || "T"}
          </AvatarFallback>
        </Avatar>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-md cursor-pointer"
          onClick={handleAvatarClick}
        >
          <Camera className="h-5 w-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
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

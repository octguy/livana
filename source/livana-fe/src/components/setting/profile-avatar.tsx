import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Camera, Upload, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { useProfileStore } from "@/stores/useProfileStore";

export function ProfileAvatar() {
  const user = useAuthStore((s) => s.user);
  const { uploadAvatar, deleteAvatar } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadPromise = async () => {
        await uploadAvatar(file);
        await useAuthStore.getState().fetchMe();
      };

      toast.promise(uploadPromise(), {
        loading: "Uploading image...",
        success: "Profile photo updated successfully!",
        error: "Failed to update profile photo. Please try again.",
        position: "top-center",
      });
    }
  };

  const handleDeleteAvatar = () => {
    const deletePromise = async () => {
      await deleteAvatar();
      await useAuthStore.getState().fetchMe();
    };

    toast.promise(deletePromise(), {
      loading: "Removing profile photo...",
      success: "Profile photo removed successfully!",
      error: "Failed to remove profile photo. Please try again.",
      position: "top-center",
    });
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-md cursor-pointer"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleAvatarClick}>
              <Upload className="mr-2 h-4 w-4" />
              Choose new photo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteAvatar}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove photo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
        <p className="text-sm text-muted-foreground">
          Click the camera icon to change your profile photo
        </p>
      </div>
    </div>
  );
}

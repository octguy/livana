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
        console.log("File name:", file.name);
        const response = await uploadAvatar(file);
        console.log("Cloudinary upload response:", response);
        await useAuthStore.getState().fetchMe();
      };

      toast.promise(uploadPromise(), {
        loading: "Đang tải ảnh lên...",
        success: "Cập nhật ảnh đại diện thành công!",
        error: "Cập nhật ảnh đại diện thất bại. Vui lòng thử lại.",
        position: "top-center",
      });
    }
  };

  const handleDeleteAvatar = () => {
    const deletePromise = async () => {
      const response = await deleteAvatar();
      console.log("Cloudinary delete response:", response);
      await useAuthStore.getState().fetchMe();
    };

    toast.promise(deletePromise(), {
      loading: "Đang xóa ảnh đại diện...",
      success: "Xóa ảnh đại diện thành công!",
      error: "Xóa ảnh đại diện thất bại. Vui lòng thử lại.",
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
              Chọn ảnh mới
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteAvatar}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa ảnh đại diện
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
        <h2 className="text-xl font-semibold mb-4">Ảnh đại diện</h2>
        <p className="text-sm text-muted-foreground">
          Nhấn vào biểu tượng máy ảnh để thay đổi ảnh đại diện của bạn
        </p>
      </div>
    </div>
  );
}

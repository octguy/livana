import api from "@/lib/axios";
import { toast } from "sonner";
import type { ApiResponse } from "@/types/response/apiResponse";
import type { User } from "@/types/response/userResponse";

export const cloudinaryService = {
  uploadImage: async (file: File): Promise<ApiResponse<User>> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("users/profiles/avatar", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
      toast.error("Lỗi khi tải ảnh đại diện. Vui lòng thử lại.");
      throw error;
    }
  },
};

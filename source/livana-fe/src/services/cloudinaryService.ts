import api from "@/lib/axios";
import { toast } from "sonner";
import type { ApiResponse } from "@/types/response/apiResponse";
import type { User } from "@/types/response/userResponse";

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder: string;
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

let cloudinaryConfig: CloudinaryConfig | null = null;

export const cloudinaryService = {
  // Get Cloudinary configuration from backend
  getConfig: async (): Promise<CloudinaryConfig> => {
    if (cloudinaryConfig) {
      return cloudinaryConfig;
    }

    try {
      const response = await api.get("/cloudinary/config");
      cloudinaryConfig = response.data;
      return cloudinaryConfig!;
    } catch (error) {
      console.error("Error fetching Cloudinary config:", error);
      toast.error("Failed to load image upload configuration");
      throw error;
    }
  },

  // Upload single image directly to Cloudinary
  uploadImage: async (file: File): Promise<CloudinaryUploadResult> => {
    try {
      const config = await cloudinaryService.getConfig();

      const timestamp = Math.floor(Date.now() / 1000);
      const folder = config.folder;

      // Generate signature: SHA256(folder=X&timestamp=Y + api_secret)
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
      const signature = await cloudinaryService.generateSignature(
        paramsToSign,
        config.apiSecret
      );

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("api_key", config.apiKey);

      // Upload directly to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary error response:", errorData);
        throw new Error(errorData.error?.message || "Failed to upload image");
      }

      const data = await response.json();
      const result = {
        url: data.secure_url,
        publicId: data.public_id,
      };
      return result;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  },

  // Generate signature for signed upload
  generateSignature: async (
    paramsToSign: string,
    apiSecret: string
  ): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(paramsToSign + apiSecret);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  },

  // Upload multiple images
  uploadImages: async (files: File[]): Promise<CloudinaryUploadResult[]> => {
    try {
      const uploadPromises = files.map((file) =>
        cloudinaryService.uploadImage(file)
      );
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images. Please try again.");
      throw error;
    }
  },

  uploadAvatar: async (file: File): Promise<ApiResponse<User>> => {
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

  deleteAvatar: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.delete("users/profiles/avatar", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa ảnh đại diện:", error);
      toast.error("Lỗi khi xóa ảnh đại diện. Vui lòng thử lại.");
      throw error;
    }
  },
};

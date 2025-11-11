import { toast } from "sonner";

export const cloudinaryService = {
  uploadImage: async (file: File): Promise<Response> => {
    const url = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      // toast.success("Tải ảnh đại diện thành công!");
      return response;
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
      toast.error("Lỗi khi tải ảnh đại diện. Vui lòng thử lại.");
      throw error;
    }
  },
};

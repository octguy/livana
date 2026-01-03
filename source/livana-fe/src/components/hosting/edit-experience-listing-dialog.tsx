import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, X, Upload } from "lucide-react";
import type { ExperienceListingResponse } from "@/types/response/experienceListingResponse";
import type { ExperienceCategoryResponse } from "@/types/response/experienceCategoryResponse";
import { experienceCategoryService } from "@/services/experienceCategoryService";
import { updateExperienceListing } from "@/services/experienceListingService";
import { cloudinaryService } from "@/services/cloudinaryService";

interface EditableImage {
  url: string;
  publicId: string;
  order: number;
  isNew?: boolean;
}

interface EditExperienceListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: ExperienceListingResponse;
  onSuccess: () => void;
}

export function EditExperienceListingDialog({
  open,
  onOpenChange,
  listing,
  onSuccess,
}: EditExperienceListingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ExperienceCategoryResponse[]>(
    []
  );
  const [loadingData, setLoadingData] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price.toString());
  const [capacity, setCapacity] = useState(listing.capacity.toString());
  const [address, setAddress] = useState(listing.address);
  const [categoryId, setCategoryId] = useState(
    listing.experienceCategory?.id || ""
  );

  // Image state
  const [images, setImages] = useState<EditableImage[]>([]);
  const [deletedPublicIds, setDeletedPublicIds] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset form with current listing data
      setTitle(listing.title);
      setDescription(listing.description);
      setPrice(listing.price.toString());
      setCapacity(listing.capacity.toString());
      setAddress(listing.address);
      setCategoryId(listing.experienceCategory?.id || "");
      // Initialize images from listing
      setImages(
        listing.images?.map((img) => ({
          url: img.image.url,
          publicId: img.image.publicId,
          order: img.order,
          isNew: false,
        })) || []
      );
      setDeletedPublicIds([]);
      fetchCategories();
    }
  }, [open, listing]);

  const fetchCategories = async () => {
    setLoadingData(true);
    try {
      const response =
        await experienceCategoryService.getAllExperienceCategories(0, 100);
      const paginatedData = response.data as any;
      setCategories(paginatedData.content || []);
    } catch (error) {
      toast.error("Không thể tải danh mục trải nghiệm");
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleImageDelete = (index: number) => {
    const imageToDelete = images[index];
    if (!imageToDelete.isNew && imageToDelete.publicId) {
      // Track for deletion from Cloudinary
      setDeletedPublicIds((prev) => [...prev, imageToDelete.publicId]);
    }
    // Remove from images array and reorder
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      return newImages.map((img, i) => ({ ...img, order: i + 1 }));
    });
  };

  const handleAddImages = async (files: FileList) => {
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const newImages: EditableImage[] = [];
      const currentMaxOrder = images.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await cloudinaryService.uploadImage(file);
        newImages.push({
          url: result.url,
          publicId: result.publicId,
          order: currentMaxOrder + i + 1,
          isNew: true,
        });
      }

      setImages((prev) => [...prev, ...newImages]);
      toast.success(`Đã tải lên ${files.length} ảnh`);
    } catch (error) {
      toast.error("Không thể tải ảnh lên");
      console.error(error);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error("Vui lòng nhập giá hợp lệ");
      return;
    }
    if (!categoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }
    if (images.length === 0) {
      toast.error("Vui lòng thêm ít nhất một ảnh");
      return;
    }

    setLoading(true);
    try {
      // Delete removed images from Cloudinary
      if (deletedPublicIds.length > 0) {
        await cloudinaryService.deleteImages(deletedPublicIds);
      }

      await updateExperienceListing(listing.listingId, {
        title,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        address,
        latitude: listing.latitude,
        longitude: listing.longitude,
        experienceCategoryId: categoryId,
        images: images.map((img) => ({
          image: img.url,
          publicId: img.publicId,
          order: img.order,
        })),
      });
      toast.success("Cập nhật trải nghiệm thành công");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Không thể cập nhật trải nghiệm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Chỉnh sửa trải nghiệm</DialogTitle>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 py-4">
              {/* Images Section */}
              <div className="space-y-2">
                <Label>Hình ảnh</Label>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <div
                      key={`${img.publicId}-${index}`}
                      className="relative aspect-square rounded-lg overflow-hidden border group"
                    >
                      <img
                        src={img.url}
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageDelete(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                  {/* Add Image Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImages}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-gray-400 transition-colors disabled:opacity-50"
                  >
                    {uploadingImages ? (
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500">Thêm ảnh</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleAddImages(e.target.files)
                  }
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề trải nghiệm"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả về trải nghiệm của bạn"
                  rows={4}
                />
              </div>

              {/* Price and Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (₫/người)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Số người tối đa</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Danh mục trải nghiệm</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || loadingData || uploadingImages}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

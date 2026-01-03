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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Plus, Minus, X, Upload } from "lucide-react";
import type { HomeListingResponse } from "@/types/response/homeListingResponse";
import type { PropertyTypeResponse } from "@/types/response/propertyTypeResponse";
import type { AmenityResponse } from "@/types/response/amenityResponse";
import type { FacilityResponse } from "@/types/response/facilityResponse";
import { propertyTypeService } from "@/services/propertyTypeService";
import { amenityService } from "@/services/amenityService";
import { facilityService } from "@/services/facilityService";
import { updateHomeListing } from "@/services/homeListingService";
import { cloudinaryService } from "@/services/cloudinaryService";

interface EditableImage {
  url: string;
  publicId: string;
  order: number;
  isNew?: boolean;
}

interface EditHomeListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: HomeListingResponse;
  onSuccess: () => void;
}

export function EditHomeListingDialog({
  open,
  onOpenChange,
  listing,
  onSuccess,
}: EditHomeListingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeResponse[]>(
    []
  );
  const [amenities, setAmenities] = useState<AmenityResponse[]>([]);
  const [facilities, setFacilities] = useState<FacilityResponse[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price.toString());
  const [capacity, setCapacity] = useState(listing.capacity.toString());
  const [address, setAddress] = useState(listing.address);
  const [propertyTypeId, setPropertyTypeId] = useState(listing.propertyTypeId);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    listing.amenityIds || []
  );
  const [selectedFacilities, setSelectedFacilities] = useState<
    { facilityId: string; quantity: number }[]
  >(
    listing.facilities?.map((f) => ({
      facilityId: f.facilityId,
      quantity: f.quantity,
    })) || []
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
      setPropertyTypeId(listing.propertyTypeId);
      setSelectedAmenities(listing.amenityIds || []);
      setSelectedFacilities(
        listing.facilities?.map((f) => ({
          facilityId: f.facilityId,
          quantity: f.quantity,
        })) || []
      );
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
      fetchData();
    }
  }, [open, listing]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [propRes, amenRes, facRes] = await Promise.all([
        propertyTypeService.getAllPropertyTypes(0, 100),
        amenityService.getAllAmenities(0, 100),
        facilityService.getAllFacilities(0, 100),
      ]);
      const propData = propRes.data as any;
      const amenData = amenRes.data as any;
      const facData = facRes.data as any;
      setPropertyTypes(propData.content || []);
      setAmenities(amenData.content || []);
      setFacilities(facData.content || []);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleFacilityQuantityChange = (facilityId: string, change: number) => {
    setSelectedFacilities((prev) => {
      const existing = prev.find((f) => f.facilityId === facilityId);
      if (existing) {
        const newQuantity = existing.quantity + change;
        if (newQuantity <= 0) {
          return prev.filter((f) => f.facilityId !== facilityId);
        }
        return prev.map((f) =>
          f.facilityId === facilityId ? { ...f, quantity: newQuantity } : f
        );
      } else if (change > 0) {
        return [...prev, { facilityId, quantity: 1 }];
      }
      return prev;
    });
  };

  const getFacilityQuantity = (facilityId: string): number => {
    return (
      selectedFacilities.find((f) => f.facilityId === facilityId)?.quantity || 0
    );
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
      toast.success(
        `Uploaded ${files.length} image${files.length > 1 ? "s" : ""}`
      );
    } catch (error) {
      toast.error("Failed to upload images");
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
      toast.error("Please enter a title");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setLoading(true);
    try {
      // Delete removed images from Cloudinary
      if (deletedPublicIds.length > 0) {
        await cloudinaryService.deleteImages(deletedPublicIds);
      }

      await updateHomeListing(listing.listingId, {
        title,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        address,
        latitude: listing.latitude,
        longitude: listing.longitude,
        propertyTypeId,
        amenityIds: selectedAmenities,
        facilityRequests: selectedFacilities,
        images: images.map((img) => ({
          image: img.url,
          publicId: img.publicId,
          order: img.order,
        })),
      });
      toast.success("Listing updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update listing");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit home listing</DialogTitle>
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
                <Label>Images</Label>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <div
                      key={`${img.publicId}-${index}`}
                      className="relative aspect-square rounded-lg overflow-hidden border group"
                    >
                      <img
                        src={img.url}
                        alt={`Image ${index + 1}`}
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
                        <span className="text-xs text-gray-500">Add image</span>
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter listing title"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your place"
                  rows={4}
                />
              </div>

              {/* Price and Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($/night)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Maximum guests</Label>
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
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                />
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label>Property type</Label>
                <Select
                  value={propertyTypeId}
                  onValueChange={setPropertyTypeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`amenity-${amenity.id}`}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={() => handleAmenityToggle(amenity.id)}
                      />
                      <label
                        htmlFor={`amenity-${amenity.id}`}
                        className="text-sm flex items-center gap-1 cursor-pointer"
                      >
                        <span>{amenity.icon}</span>
                        <span>{amenity.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-2">
                <Label>Facilities</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {facilities.map((facility) => (
                    <div
                      key={facility.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm flex items-center gap-1">
                        <span>{facility.icon}</span>
                        <span>{facility.name}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleFacilityQuantityChange(facility.id, -1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {getFacilityQuantity(facility.id)}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleFacilityQuantityChange(facility.id, 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || loadingData || uploadingImages}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

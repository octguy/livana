export interface ImageOrderDto {
  image: string; // Cloudinary URL
  publicId: string; // Cloudinary public ID
  order: number;
}

export interface CreateExperienceListingRequest {
  title: string;
  price: number;
  description: string;
  capacity: number;
  address: string;
  latitude: number;
  longitude: number;
  experienceCategoryId: string;
  images: ImageOrderDto[];
}

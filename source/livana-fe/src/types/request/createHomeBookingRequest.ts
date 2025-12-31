export interface CreateHomeBookingRequest {
  homeListingId: string;
  checkInTime: string; // ISO 8601 format
  checkOutTime: string; // ISO 8601 format
  guests: number;
}

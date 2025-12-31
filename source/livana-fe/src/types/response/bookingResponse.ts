export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface BookingResponse {
  id: string;
  customerId: string;
  customerName: string;
  totalPrice: number;
  status: BookingStatus;
  isPaid: boolean;
  createdAt: string;
}

export interface HomeBookingResponse extends BookingResponse {
  homeListingId: string;
  homeListingTitle: string;
  checkInTime: string;
  checkOutTime: string;
  guests: number;
}

export interface ExperienceBookingResponse extends BookingResponse {
  sessionId: string;
  experienceListingId: string;
  experienceListingTitle: string;
  sessionStartTime: string;
  sessionEndTime: string;
  quantity: number;
}

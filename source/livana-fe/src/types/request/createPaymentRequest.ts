export enum BookingType {
  HOME = "HOME",
  EXPERIENCE = "EXPERIENCE",
}

export interface CreatePaymentRequest {
  bookingId: string;
  bookingType: BookingType;
  amount: number;
  orderInfo?: string;
  bankCode?: string;
  language?: string;
}

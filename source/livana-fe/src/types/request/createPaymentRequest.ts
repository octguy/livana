export const BookingType = {
  HOME: "HOME",
  EXPERIENCE: "EXPERIENCE",
} as const;

export type BookingType = (typeof BookingType)[keyof typeof BookingType];

export interface CreatePaymentRequest {
  bookingId: string;
  bookingType: BookingType;
  amount: number;
  orderInfo?: string;
  bankCode?: string;
  language?: string;
}

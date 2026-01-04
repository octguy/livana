export const PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  VNPAY: "VNPAY",
  CASH: "CASH",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const BookingType = {
  HOME: "HOME",
  EXPERIENCE: "EXPERIENCE",
} as const;

export type BookingType = (typeof BookingType)[keyof typeof BookingType];

export interface PaymentResponse {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  vnpayTransactionNo: string | null;
  bankCode: string | null;
  cardType: string | null;
  orderInfo: string;
  paymentTime: string | null;
  createdAt: string;
}

export interface VNPayCreateResponse {
  paymentUrl: string;
  transactionId: string;
}

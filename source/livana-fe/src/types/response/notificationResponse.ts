export interface NotificationMessage {
  id: string;
  recipientId: string;
  type: "BOOKING_HOME" | "BOOKING_EXPERIENCE";
  title: string;
  message: string;
  data: HomeBookingNotificationData | ExperienceBookingNotificationData;
  read: boolean;
  createdAt: string;
}

export interface HomeBookingNotificationData {
  id: string;
  customerId: string;
  customerName: string;
  homeListingId: string;
  homeListingTitle: string;
  checkInTime: string;
  checkOutTime: string;
  guests: number;
  totalPrice: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

export interface ExperienceBookingNotificationData {
  id: string;
  customerId: string;
  customerName: string;
  sessionId: string;
  experienceListingId: string;
  experienceListingTitle: string;
  sessionStartTime: string;
  sessionEndTime: string;
  quantity: number;
  totalPrice: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

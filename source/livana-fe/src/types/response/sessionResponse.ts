export interface SessionResponse {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  price: number;
  status: string;
  createdAt: string;
}

export interface BulkCreateSessionResponse {
  createdCount: number;
  sessions: SessionResponse[];
}

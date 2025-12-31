export interface SessionResponse {
  id: string;
  startTime: string;
  endTime: string;
}

export interface BulkCreateSessionResponse {
  createdCount: number;
  sessions: SessionResponse[];
}

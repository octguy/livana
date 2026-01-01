export interface CreateSessionRequest {
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
}

export interface BulkCreateSessionRequest {
  sessions: CreateSessionRequest[];
}

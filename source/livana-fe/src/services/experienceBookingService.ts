import axios from "@/lib/axios";
import type { CreateExperienceBookingRequest } from "@/types/request/createExperienceBookingRequest";
import type { ExperienceBookingResponse } from "@/types/response/bookingResponse";
import type { ResponseData } from "@/types/response";

export const createExperienceBooking = async (
  request: CreateExperienceBookingRequest
) => {
  return axios.post<ResponseData<ExperienceBookingResponse>>(
    "/experience-bookings",
    request
  );
};

export const getExperienceBooking = async (bookingId: string) => {
  return axios.get<ResponseData<ExperienceBookingResponse>>(
    `/experience-bookings/${bookingId}`
  );
};

export const getMyExperienceBookings = async () => {
  return axios.get<ResponseData<ExperienceBookingResponse[]>>(
    "/experience-bookings/my-bookings"
  );
};

export const getSessionExperienceBookings = async (sessionId: string) => {
  return axios.get<ResponseData<ExperienceBookingResponse[]>>(
    `/experience-bookings/session/${sessionId}`
  );
};

export const cancelExperienceBooking = async (bookingId: string) => {
  return axios.put<ResponseData<ExperienceBookingResponse>>(
    `/experience-bookings/${bookingId}/cancel`
  );
};

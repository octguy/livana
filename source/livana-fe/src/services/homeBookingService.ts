import axios from "@/lib/axios";
import type { CreateHomeBookingRequest } from "@/types/request/createHomeBookingRequest";
import type { HomeBookingResponse } from "@/types/response/bookingResponse";
import type { ResponseData } from "@/types/response";

export const createHomeBooking = async (request: CreateHomeBookingRequest) => {
  return axios.post<ResponseData<HomeBookingResponse>>(
    "/home-bookings",
    request
  );
};

export const getHomeBooking = async (bookingId: string) => {
  return axios.get<ResponseData<HomeBookingResponse>>(
    `/home-bookings/${bookingId}`
  );
};

export const getMyHomeBookings = async () => {
  return axios.get<ResponseData<HomeBookingResponse[]>>(
    "/home-bookings/my-bookings"
  );
};

export const getListingHomeBookings = async (listingId: string) => {
  return axios.get<ResponseData<HomeBookingResponse[]>>(
    `/home-bookings/listing/${listingId}`
  );
};

export const getHostHomeBookings = async () => {
  return axios.get<ResponseData<HomeBookingResponse[]>>(
    "/home-bookings/host-bookings"
  );
};

export const cancelHomeBooking = async (bookingId: string) => {
  return axios.put<ResponseData<HomeBookingResponse>>(
    `/home-bookings/${bookingId}/cancel`
  );
};

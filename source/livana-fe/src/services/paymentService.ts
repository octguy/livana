import axios from "@/lib/axios";
import type { CreatePaymentRequest } from "@/types/request/createPaymentRequest";
import type {
  PaymentResponse,
  VNPayCreateResponse,
} from "@/types/response/paymentResponse";
import type { ResponseData } from "@/types/response";

export const createVNPayPayment = async (request: CreatePaymentRequest) => {
  return axios.post<ResponseData<VNPayCreateResponse>>(
    "/payments/vnpay/create",
    request
  );
};

export const getPaymentById = async (paymentId: string) => {
  return axios.get<ResponseData<PaymentResponse>>(`/payments/${paymentId}`);
};

export const getPaymentByTransactionId = async (transactionId: string) => {
  return axios.get<ResponseData<PaymentResponse>>(
    `/payments/transaction/${transactionId}`
  );
};

export const getPaymentsByBookingId = async (bookingId: string) => {
  return axios.get<ResponseData<PaymentResponse[]>>(
    `/payments/booking/${bookingId}`
  );
};

export const getMyPayments = async () => {
  return axios.get<ResponseData<PaymentResponse[]>>("/payments/my-payments");
};

package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreatePaymentRequest;
import octguy.livanabe.dto.response.PaymentResponse;
import octguy.livanabe.dto.response.VNPayCreateResponse;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface IPaymentService {
    
    VNPayCreateResponse createVNPayPayment(CreatePaymentRequest request, UUID userId, HttpServletRequest servletRequest);
    
    PaymentResponse processVNPayCallback(Map<String, String> params);
    
    PaymentResponse getPaymentById(UUID paymentId);
    
    List<PaymentResponse> getPaymentsByBookingId(UUID bookingId);
    
    List<PaymentResponse> getPaymentsByUserId(UUID userId);
    
    PaymentResponse getPaymentByTransactionId(String transactionId);
}

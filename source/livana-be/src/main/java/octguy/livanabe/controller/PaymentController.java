package octguy.livanabe.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.dto.request.CreatePaymentRequest;
import octguy.livanabe.dto.response.PaymentResponse;
import octguy.livanabe.dto.response.VNPayCreateResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IPaymentService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final IPaymentService paymentService;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @PostMapping("/vnpay/create")
    public ResponseEntity<ApiResponse<VNPayCreateResponse>> createVNPayPayment(
            @Valid @RequestBody CreatePaymentRequest request,
            HttpServletRequest servletRequest
    ) {
        UUID userId = SecurityUtils.getCurrentUser().getId();
        VNPayCreateResponse paymentUrl = paymentService.createVNPayPayment(request, userId, servletRequest);

        ApiResponse<VNPayCreateResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "VNPay payment URL created successfully",
                paymentUrl,
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay/callback")
    public void vnPayCallback(
            @RequestParam Map<String, String> params,
            HttpServletResponse response
    ) throws IOException {
        log.info("VNPay callback received with params: {}", params);

        try {
            PaymentResponse paymentResponse = paymentService.processVNPayCallback(new HashMap<>(params));
            
            String redirectUrl;
            if ("SUCCESS".equals(paymentResponse.getStatus().name())) {
                redirectUrl = frontendUrl + "/payment/success?transactionId=" + paymentResponse.getTransactionId();
            } else {
                redirectUrl = frontendUrl + "/payment/failed?transactionId=" + paymentResponse.getTransactionId();
            }
            
            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            log.error("Error processing VNPay callback", e);
            response.sendRedirect(frontendUrl + "/payment/failed?error=" + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(@PathVariable UUID id) {
        PaymentResponse payment = paymentService.getPaymentById(id);

        ApiResponse<PaymentResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Payment retrieved successfully",
                payment,
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByTransactionId(
            @PathVariable String transactionId
    ) {
        PaymentResponse payment = paymentService.getPaymentByTransactionId(transactionId);

        ApiResponse<PaymentResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Payment retrieved successfully",
                payment,
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByBookingId(
            @PathVariable UUID bookingId
    ) {
        List<PaymentResponse> payments = paymentService.getPaymentsByBookingId(bookingId);

        ApiResponse<List<PaymentResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Payments retrieved successfully",
                payments,
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-payments")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getMyPayments() {
        UUID userId = SecurityUtils.getCurrentUser().getId();
        List<PaymentResponse> payments = paymentService.getPaymentsByUserId(userId);

        ApiResponse<List<PaymentResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Payments retrieved successfully",
                payments,
                null
        );

        return ResponseEntity.ok(response);
    }
}

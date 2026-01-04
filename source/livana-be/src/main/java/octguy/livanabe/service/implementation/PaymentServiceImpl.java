package octguy.livanabe.service.implementation;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.config.VNPayConfig;
import octguy.livanabe.dto.request.CreatePaymentRequest;
import octguy.livanabe.dto.response.PaymentResponse;
import octguy.livanabe.dto.response.VNPayCreateResponse;
import octguy.livanabe.entity.*;
import octguy.livanabe.enums.BookingType;
import octguy.livanabe.enums.PaymentMethod;
import octguy.livanabe.enums.PaymentStatus;
import octguy.livanabe.exception.AppException;
import octguy.livanabe.repository.*;
import octguy.livanabe.service.IPaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements IPaymentService {

    private final VNPayConfig vnPayConfig;
    private final PaymentRepository paymentRepository;
    private final HomeBookingRepository homeBookingRepository;
    private final ExperienceBookingRepository experienceBookingRepository;
    private final UserRepository userRepository;

    private static final String VNPAY_DATE_FORMAT = "yyyyMMddHHmmss";

    @Override
    @Transactional
    public VNPayCreateResponse createVNPayPayment(CreatePaymentRequest request, UUID userId, HttpServletRequest servletRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        Booking booking = getBookingByTypeAndId(request.getBookingId(), request.getBookingType());

        if (booking.getIsPaid() != null && booking.getIsPaid()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Booking has already been paid");
        }

        // Create payment record
        String transactionId = generateTransactionId();
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setUser(user);
        payment.setAmount(booking.getTotalPrice());
        payment.setPaymentMethod(PaymentMethod.VNPAY);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTransactionId(transactionId);
        payment.setOrderInfo("Payment for booking " + booking.getId());
        paymentRepository.save(payment);

        // Generate VNPay URL
        String paymentUrl = generateVNPayUrl(payment, servletRequest, request.getBankCode(), request.getLanguage());

        return VNPayCreateResponse.builder()
                .paymentUrl(paymentUrl)
                .transactionId(transactionId)
                .build();
    }

    @Override
    @Transactional
    public PaymentResponse processVNPayCallback(Map<String, String> params) {
        String vnpSecureHash = params.get("vnp_SecureHash");
        
        // Remove hash params for validation
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        
        // Validate signature
        String signValue = hashAllFields(params);
        if (!signValue.equals(vnpSecureHash)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Invalid signature");
        }

        String transactionId = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");
        String cardType = params.get("vnp_CardType");
        String payDateStr = params.get("vnp_PayDate");

        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Payment not found"));

        // Update payment info
        payment.setVnpayTransactionNo(transactionNo);
        payment.setBankCode(bankCode);
        payment.setCardType(cardType);
        payment.setResponseCode(responseCode);

        if (payDateStr != null && !payDateStr.isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(VNPAY_DATE_FORMAT);
            payment.setPaymentTime(LocalDateTime.parse(payDateStr, formatter));
        }

        // Check response code
        if ("00".equals(responseCode)) {
            payment.setStatus(PaymentStatus.SUCCESS);
            
            // Update booking isPaid status
            Booking booking = payment.getBooking();
            booking.setIsPaid(true);
            if (booking instanceof HomeBooking) {
                homeBookingRepository.save((HomeBooking) booking);
            } else if (booking instanceof ExperienceBooking) {
                experienceBookingRepository.save((ExperienceBooking) booking);
            }
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        paymentRepository.save(payment);

        return mapToPaymentResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentById(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Payment not found"));
        return mapToPaymentResponse(payment);
    }

    @Override
    public List<PaymentResponse> getPaymentsByBookingId(UUID bookingId) {
        return paymentRepository.findByBookingId(bookingId).stream()
                .map(this::mapToPaymentResponse)
                .toList();
    }

    @Override
    public List<PaymentResponse> getPaymentsByUserId(UUID userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(this::mapToPaymentResponse)
                .toList();
    }

    @Override
    public PaymentResponse getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Payment not found"));
        return mapToPaymentResponse(payment);
    }

    private Booking getBookingByTypeAndId(UUID bookingId, BookingType bookingType) {
        return switch (bookingType) {
            case HOME -> homeBookingRepository.findById(bookingId)
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Home booking not found"));
            case EXPERIENCE -> experienceBookingRepository.findById(bookingId)
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Experience booking not found"));
        };
    }

    private String generateVNPayUrl(Payment payment, HttpServletRequest request, String bankCode, String language) {
        Map<String, String> vnpParams = new TreeMap<>();
        
        vnpParams.put("vnp_Version", vnPayConfig.getVersion());
        vnpParams.put("vnp_Command", vnPayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        
        // Amount in VND (multiply by 100 as per VNPay requirement)
        long amount = payment.getAmount().multiply(BigDecimal.valueOf(100)).longValue();
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        
        vnpParams.put("vnp_CurrCode", "VND");
        
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParams.put("vnp_BankCode", bankCode);
        }
        
        vnpParams.put("vnp_TxnRef", payment.getTransactionId());
        vnpParams.put("vnp_OrderInfo", payment.getOrderInfo());
        vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());
        vnpParams.put("vnp_Locale", language != null ? language : "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", getIpAddress(request));
        
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(VNPAY_DATE_FORMAT);
        vnpParams.put("vnp_CreateDate", now.format(formatter));
        vnpParams.put("vnp_ExpireDate", now.plusMinutes(15).format(formatter));

        // Build query string
        StringBuilder query = new StringBuilder();
        StringBuilder hashData = new StringBuilder();
        
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            if (hashData.length() > 0) {
                hashData.append("&");
                query.append("&");
            }
            hashData.append(entry.getKey()).append("=").append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
            query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII))
                 .append("=")
                 .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
        }

        String secureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        return vnPayConfig.getPayUrl() + "?" + query.toString();
    }

    private String hashAllFields(Map<String, String> fields) {
        StringBuilder hashData = new StringBuilder();
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        
        for (String fieldName : fieldNames) {
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                if (hashData.length() > 0) {
                    hashData.append("&");
                }
                hashData.append(fieldName).append("=").append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            }
        }
        
        return hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA512", e);
        }
    }

    private String generateTransactionId() {
        return System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        return ipAddress != null ? ipAddress : "127.0.0.1";
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .userId(payment.getUser().getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .vnpayTransactionNo(payment.getVnpayTransactionNo())
                .bankCode(payment.getBankCode())
                .cardType(payment.getCardType())
                .orderInfo(payment.getOrderInfo())
                .paymentTime(payment.getPaymentTime())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}

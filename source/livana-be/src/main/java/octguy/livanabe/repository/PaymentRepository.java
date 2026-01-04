package octguy.livanabe.repository;

import octguy.livanabe.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    List<Payment> findByBookingId(UUID bookingId);
    
    List<Payment> findByUserId(UUID userId);
    
    Optional<Payment> findByBookingIdAndTransactionId(UUID bookingId, String transactionId);
}

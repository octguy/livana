package octguy.livanabe.repository;

import octguy.livanabe.entity.User;
import octguy.livanabe.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    // eager fetch roles with user, to avoid lazy loading issues (default fetch type for @ManyToMany is LAZY)
//    @Query("select u from User u left join fetch u.roleUsers ru left join fetch ru.role where u.email = :email")
//    Optional<User> findByEmailWithRoles(@Param("email") String email);

    @Query("""
        select distinct u from User u
        left join fetch u.roleUsers ru
        left join fetch ru.role
        left join fetch u.userInterests ui
        left join fetch ui.interest
        where u.username = :username
    """)
    Optional<User> findByUsernameWithRolesAndInterests(@Param("username") String username);

    Boolean existsByEmail(String email);

    Boolean existsByUsername(String username);

    @Query(value = "select * from \"user\" where status = 'PENDING_VERIFICATION' and created_at + INTERVAL '24 hours' <= NOW();", nativeQuery = true)
    List<User> findPendingUserExceedOneDay();
    
    // Dashboard statistics queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.deletedAt IS NULL")
    Long countAllActiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate AND u.deletedAt IS NULL")
    Long countUsersCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate AND u.createdAt < :endDate AND u.deletedAt IS NULL")
    Long countUsersCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Admin user management queries
    @Query("""
        SELECT DISTINCT u FROM User u 
        LEFT JOIN FETCH u.roleUsers ru 
        LEFT JOIN FETCH ru.role 
        WHERE u.deletedAt IS NULL
    """)
    Page<User> findAllWithRoles(Pageable pageable);
    
    @Query("""
        SELECT DISTINCT u FROM User u 
        LEFT JOIN FETCH u.roleUsers ru 
        LEFT JOIN FETCH ru.role 
        WHERE u.deletedAt IS NULL 
        AND (LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) 
             OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    Page<User> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("""
        SELECT DISTINCT u FROM User u 
        LEFT JOIN FETCH u.roleUsers ru 
        LEFT JOIN FETCH ru.role 
        WHERE u.deletedAt IS NULL AND u.status = :status
    """)
    Page<User> findByStatus(@Param("status") UserStatus status, Pageable pageable);
    
    @Query("""
        SELECT DISTINCT u FROM User u 
        LEFT JOIN FETCH u.roleUsers ru 
        LEFT JOIN FETCH ru.role 
        WHERE u.id = :id AND u.deletedAt IS NULL
    """)
    Optional<User> findByIdWithRoles(@Param("id") UUID id);
}

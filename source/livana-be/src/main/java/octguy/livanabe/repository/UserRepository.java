package octguy.livanabe.repository;

import octguy.livanabe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}

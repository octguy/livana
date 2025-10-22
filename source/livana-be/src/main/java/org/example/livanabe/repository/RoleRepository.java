package org.example.livanabe.repository;

import org.example.livanabe.enums.UserRole;
import org.example.livanabe.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByName(UserRole name);
}

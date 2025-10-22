package org.example.livanabe.repository;

import org.example.livanabe.model.RoleUser;
import org.example.livanabe.model.composite_key.RoleUserId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleUserRepository extends JpaRepository<RoleUser, RoleUserId> {
}

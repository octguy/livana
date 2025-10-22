package org.example.livanabe.repository;

import org.example.livanabe.model.AuthCredential;
import org.example.livanabe.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AuthCredentialRepository extends JpaRepository<AuthCredential, UUID> {

    Optional<AuthCredential> findByUser(User user);

    List<AuthCredential> findAllByUserIn(List<User> users);
}

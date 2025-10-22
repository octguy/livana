package org.example.livanabe.service;

import org.example.livanabe.model.RefreshToken;
import org.example.livanabe.model.User;

public interface IRefreshTokenService {

    RefreshToken findByToken(String token);

    RefreshToken createRefreshToken(User user);

    boolean verifyExpiration(RefreshToken token);

    void delete(RefreshToken token);

    void deleteByUser(User user);
}

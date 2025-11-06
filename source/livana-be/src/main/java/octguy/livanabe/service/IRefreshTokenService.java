package octguy.livanabe.service;

import octguy.livanabe.entity.RefreshToken;
import octguy.livanabe.entity.User;

public interface IRefreshTokenService {

    RefreshToken findByToken(String token);

    RefreshToken createRefreshToken(User user);

    boolean verifyExpiration(RefreshToken token);

    void deleteByToken(String token);

    void deleteByUser(User user);
}

package octguy.livanabe.service;

import octguy.livanabe.dto.request.UpdateUserRolesRequest;
import octguy.livanabe.dto.request.UpdateUserStatusRequest;
import octguy.livanabe.dto.response.AdminUserResponse;
import octguy.livanabe.enums.UserStatus;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface IAdminUserService {
    
    Page<AdminUserResponse> getAllUsers(int page, int size, String keyword, UserStatus status);
    
    AdminUserResponse getUserById(UUID userId);
    
    AdminUserResponse updateUserRoles(UUID userId, UpdateUserRolesRequest request);
    
    AdminUserResponse updateUserStatus(UUID userId, UpdateUserStatusRequest request);
    
    AdminUserResponse toggleUserEnabled(UUID userId);
    
    void deleteUser(UUID userId);
}

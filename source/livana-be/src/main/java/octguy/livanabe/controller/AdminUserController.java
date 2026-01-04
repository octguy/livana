package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.UpdateUserRolesRequest;
import octguy.livanabe.dto.request.UpdateUserStatusRequest;
import octguy.livanabe.dto.response.AdminUserResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.enums.UserStatus;
import octguy.livanabe.service.IAdminUserService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    
    private final IAdminUserService adminUserService;
    
    public AdminUserController(IAdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<AdminUserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status
    ) {
        Page<AdminUserResponse> users = adminUserService.getAllUsers(page, size, keyword, status);
        
        ApiResponse<Page<AdminUserResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Users fetched successfully",
                users,
                null
        );
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> getUserById(@PathVariable UUID id) {
        AdminUserResponse user = adminUserService.getUserById(id);
        
        ApiResponse<AdminUserResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "User fetched successfully",
                user,
                null
        );
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/roles")
    public ResponseEntity<ApiResponse<AdminUserResponse>> updateUserRoles(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRolesRequest request
    ) {
        AdminUserResponse user = adminUserService.updateUserRoles(id, request);
        
        ApiResponse<AdminUserResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "User roles updated successfully",
                user,
                null
        );
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdminUserResponse>> updateUserStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        AdminUserResponse user = adminUserService.updateUserStatus(id, request);
        
        ApiResponse<AdminUserResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "User status updated successfully",
                user,
                null
        );
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/toggle-enabled")
    public ResponseEntity<ApiResponse<AdminUserResponse>> toggleUserEnabled(@PathVariable UUID id) {
        AdminUserResponse user = adminUserService.toggleUserEnabled(id);
        
        ApiResponse<AdminUserResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "User enabled status toggled successfully",
                user,
                null
        );
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable UUID id) {
        adminUserService.deleteUser(id);
        
        ApiResponse<String> response = new ApiResponse<>(
                HttpStatus.OK,
                "User deleted successfully",
                "User deleted successfully",
                null
        );
        
        return ResponseEntity.ok(response);
    }
}

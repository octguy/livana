package octguy.livanabe.controller;

import octguy.livanabe.dto.response.UserProfileResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.service.IUserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final IUserProfileService userProfileService;

    public UserController(IUserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser() {
        UserProfileResponse me = userProfileService.getMe();

        ApiResponse<UserProfileResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Current user fetched",
                me,
                null
        );

        return ResponseEntity.ok(response);
    }

    // --- UserProfile CRUD ---

//    @PostMapping("/profiles")
//    public ResponseEntity<ApiResponse<UserProfile>> createProfile(@RequestBody UserProfile profile) {
//        UserProfile saved = userProfileService.create(profile);
//
//        ApiResponse<UserProfile> response = new ApiResponse<>(
//                HttpStatus.CREATED,
//                "Profile created",
//                saved,
//                null
//        );
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }

    @GetMapping("/profiles")
    public ResponseEntity<ApiResponse<List<UserProfile>>> listProfiles() {
        List<UserProfile> profiles = userProfileService.findAll();
        ApiResponse<List<UserProfile>> response = new ApiResponse<>(HttpStatus.OK, "Profiles fetched", profiles, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profiles/{id}")
    public ResponseEntity<ApiResponse<UserProfile>> getProfile(@PathVariable("id") UUID id) {
        UserProfile profile = userProfileService.findById(id);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(HttpStatus.NOT_FOUND, "Profile not found", null, null));
        }
        ApiResponse<UserProfile> response = new ApiResponse<>(HttpStatus.OK, "Profile fetched", profile, null);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profiles/{id}")
    public ResponseEntity<ApiResponse<UserProfile>> updateProfile(@PathVariable("id") UUID id, @RequestBody UserProfile update) {
        UserProfile updated = userProfileService.update(id, update);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(HttpStatus.NOT_FOUND, "Profile not found", null, null));
        }
        ApiResponse<UserProfile> response = new ApiResponse<>(HttpStatus.OK, "Profile updated", updated, null);
        return ResponseEntity.ok(response);
    }

//    @DeleteMapping("/profiles/{id}")
//    public ResponseEntity<ApiResponse<Void>> deleteProfile(@PathVariable("id") UUID id) {
//        userProfileService.delete(id);
//        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.NO_CONTENT, "Profile deleted", null, null);
//        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
//    }
}

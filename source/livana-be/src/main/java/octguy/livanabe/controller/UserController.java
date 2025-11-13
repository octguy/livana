package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.SetInterestRequest;
import octguy.livanabe.dto.request.UpdateUserProfileRequest;
import octguy.livanabe.dto.response.UserInterestsResponse;
import octguy.livanabe.dto.response.UserProfileResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.service.IInterestService;
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

    private final IInterestService interestService;

    public UserController(IUserProfileService userProfileService, IInterestService interestService) {
        this.interestService = interestService;
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
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(@PathVariable("id") UUID id,
                                                                          @Valid @RequestBody UpdateUserProfileRequest updatedProfile) {
        UserProfileResponse updated = userProfileService.update(id, updatedProfile);

        ApiResponse<UserProfileResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Profile updated",
                updated,
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/interests")
    public ResponseEntity<ApiResponse<UserInterestsResponse>> getUserInterests() {
        UserInterestsResponse interests = interestService.getUserInterests();

        ApiResponse<UserInterestsResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "User interests fetched",
                interests,
                null
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/me/interests")
    public ResponseEntity<ApiResponse<UserInterestsResponse>> setInterests(@Valid @RequestBody SetInterestRequest setInterestRequest) {
        UserInterestsResponse updatedInterests = interestService.setUserInterests(setInterestRequest);

        ApiResponse<UserInterestsResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Interests updated",
                updatedInterests,
                null
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/profiles/{id}/avatar")
    public ResponseEntity<ApiResponse<Void>> deleteAvatar(@PathVariable("id") UUID id) {
        userProfileService.deleteAvatar(id);
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.NO_CONTENT, "Avatar deleted", null, null);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }
}

package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreateInterestRequest;
import octguy.livanabe.dto.response.InterestResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IInterestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interests")
public class InterestController {

    private final IInterestService interestService;

    public InterestController(IInterestService interestService) {
        this.interestService = interestService;
    }

    @GetMapping
    public ResponseEntity<?> getAllInterests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<InterestResponse> interests = interestService.findAll(page, size);

        ApiResponse<Page<InterestResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Interests fetched successfully",
                interests,
                null
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<InterestResponse>>> getAllInterestsNoPagination() {
        List<InterestResponse> interests = interestService.findAll();

        ApiResponse<List<InterestResponse>> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Interests fetched successfully",
                interests,
                null
        );

        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InterestResponse>> create(@Valid @RequestBody CreateInterestRequest request) {
        InterestResponse createdInterest = interestService.create(request);

        ApiResponse<InterestResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Interest created successfully",
                createdInterest,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InterestResponse>> update(
            @PathVariable("id") UUID id,
            @Valid @RequestBody CreateInterestRequest request
    ) {
        InterestResponse updatedInterest = interestService.update(id, request.getName(), request.getIcon());

        ApiResponse<InterestResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Interest updated successfully",
                updatedInterest,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}/soft")
    public ResponseEntity<ApiResponse<String>> softDelete(@PathVariable("id") UUID id) {
        interestService.softDelete(id);

        ApiResponse<String> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Interest soft deleted successfully",
                "Interest soft deleted successfully",
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<String>> hardDelete(@PathVariable("id") UUID id) {
        interestService.hardDelete(id);

        ApiResponse<String> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Interest hard deleted successfully",
                "Interest hard deleted successfully",
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/soft/all")
    public ResponseEntity<ApiResponse<String>> softDeleteAll() {
        interestService.softDeleteAll();

        ApiResponse<String> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "All interests soft deleted successfully",
                "All interests soft deleted successfully",
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/hard/all")
    public ResponseEntity<ApiResponse<String>> hardDeleteAll() {
        interestService.hardDeleteAll();

        ApiResponse<String> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "All interests hard deleted successfully",
                "All interests hard deleted successfully",
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

}


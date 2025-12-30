package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.BulkCreateSessionRequest;
import octguy.livanabe.dto.response.BulkCreateSessionResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IExperienceSessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/listings/experiences/{experienceId}/sessions")
public class ExperienceSessionController {

    private final IExperienceSessionService experienceSessionService;

    public ExperienceSessionController(IExperienceSessionService experienceSessionService) {
        this.experienceSessionService = experienceSessionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BulkCreateSessionResponse>> createSessions(
            @PathVariable UUID experienceId,
            @Valid @RequestBody BulkCreateSessionRequest request
    ) {
        BulkCreateSessionResponse response = experienceSessionService.createSessions(experienceId, request);

        ApiResponse<BulkCreateSessionResponse> apiResponse = new ApiResponse<>(
                HttpStatus.CREATED,
                "Sessions created successfully",
                response,
                null
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
}

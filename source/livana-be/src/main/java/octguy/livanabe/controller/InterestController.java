package octguy.livanabe.controller;

import octguy.livanabe.dto.response.InterestResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IInterestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;

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

}

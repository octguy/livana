package octguy.livanabe.controller;

import octguy.livanabe.dto.response.InterestResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IInterestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interests")
public class InterestController {

    private final IInterestService interestService;

    public InterestController(IInterestService interestService) {
        this.interestService = interestService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InterestResponse>>> getAllInterests() {
        List<InterestResponse> interests = interestService.findAll();

        ApiResponse<List<InterestResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Interests fetched successfully",
                interests,
                null
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}

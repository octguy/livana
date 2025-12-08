package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreateExperienceCategoryRequest;
import octguy.livanabe.dto.response.ExperienceCategoryResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IExperienceCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/experience-categories")
public class ExperienceCategoryController {

    private final IExperienceCategoryService experienceCategoryService;

    public ExperienceCategoryController(IExperienceCategoryService experienceCategoryService) {
        this.experienceCategoryService = experienceCategoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExperienceCategoryResponse>>> getAllExperienceCategories() {
        List<ExperienceCategoryResponse> experienceCategories = experienceCategoryService.findAll();

        ApiResponse<List<ExperienceCategoryResponse>> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Experience categories fetched successfully",
                experienceCategories,
                null
        );

        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExperienceCategoryResponse>> create(@Valid @RequestBody CreateExperienceCategoryRequest request) {
        ExperienceCategoryResponse createdExperienceCategory = experienceCategoryService.create(request.getName(), request.getIcon());

        ApiResponse<ExperienceCategoryResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Experience category created successfully",
                createdExperienceCategory,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExperienceCategoryResponse>> update(@PathVariable("id") UUID id,
                                                                          @Valid @RequestBody CreateExperienceCategoryRequest request) {
        ExperienceCategoryResponse updatedExperienceCategory = experienceCategoryService.update(id, request.getName(), request.getIcon());

        ApiResponse<ExperienceCategoryResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Experience category updated successfully",
                updatedExperienceCategory,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }
}

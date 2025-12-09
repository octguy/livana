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

    @DeleteMapping("/{id}/soft")
    public ResponseEntity<ApiResponse<Void>> softDelete(@PathVariable("id") UUID id) {
        experienceCategoryService.softDelete(id);

        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Experience category soft deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDelete(@PathVariable("id") UUID id) {
        experienceCategoryService.hardDelete(id);

        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Experience category hard deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/soft/all")
    public ResponseEntity<ApiResponse<Void>> softDeleteAll() {
        experienceCategoryService.softDeleteAll();

        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "All experience categories soft deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/hard/all")
    public ResponseEntity<ApiResponse<Void>> hardDeleteAll() {
        experienceCategoryService.hardDeleteAll();

        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "All experience categories hard deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }
}

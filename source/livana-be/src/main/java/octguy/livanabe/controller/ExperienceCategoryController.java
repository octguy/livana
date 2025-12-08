package octguy.livanabe.controller;

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
    public ResponseEntity<ApiResponse<ExperienceCategoryResponse>> create(@RequestParam String name) {
        ExperienceCategoryResponse createdExperienceCategory = experienceCategoryService.create(name);

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
                                                                          @RequestParam String name) {
        ExperienceCategoryResponse updatedExperienceCategory = experienceCategoryService.update(id, name);

        ApiResponse<ExperienceCategoryResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Experience category updated successfully",
                updatedExperienceCategory,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }
}

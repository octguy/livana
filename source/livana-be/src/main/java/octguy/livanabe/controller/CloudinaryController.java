package octguy.livanabe.controller;

import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.ICloudinaryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cloudinary")
public class CloudinaryController {

    @Value("${spring.cloudinary.cloud-name}")
    private String cloudName;

    @Value("${spring.cloudinary.api-key}")
    private String apiKey;

    @Value("${spring.cloudinary.api-secret}")
    private String apiSecret;

    @Value("${spring.cloudinary.folder}")
    private String folder;

    private final ICloudinaryService cloudinaryService;

    public CloudinaryController(ICloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping("/config")
    public ResponseEntity<?> getCloudinaryConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("cloudName", cloudName);
        config.put("apiKey", apiKey);
        config.put("apiSecret", apiSecret);
        config.put("folder", folder);

        return ResponseEntity.ok(config);
    }

    @DeleteMapping("/images/{publicId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@PathVariable String publicId) {
        cloudinaryService.deleteImage(publicId);

        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Image deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/images")
    public ResponseEntity<ApiResponse<Void>> deleteImages(@RequestBody List<String> publicIds) {
        cloudinaryService.deleteImages(publicIds);

        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Images deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(response);
    }
}

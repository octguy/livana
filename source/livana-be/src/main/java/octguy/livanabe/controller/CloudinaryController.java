package octguy.livanabe.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
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

    @GetMapping("/config")
    public ResponseEntity<?> getCloudinaryConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("cloudName", cloudName);
        config.put("apiKey", apiKey);
        config.put("apiSecret", apiSecret);
        config.put("folder", folder);

        return ResponseEntity.ok(config);
    }
}

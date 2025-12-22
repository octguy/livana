package octguy.livanabe.service.implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.dto.response.CloudinaryResponse;
import octguy.livanabe.service.ICloudinaryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
public class CloudinaryServiceImpl implements ICloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${spring.cloudinary.folder}")
    private String folder;

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public CloudinaryResponse uploadImage(MultipartFile image) {
        if (image == null) {
            return null;
        }

        String imageUrl;
        String imagePublicId;

        try {
            var uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.asMap(
                    "folder", folder,
                    "overwrite", true,
                    "resource_type", "image"
            ));
            imageUrl = uploadResult.get("secure_url").toString();
            imagePublicId = uploadResult.get("public_id").toString();
        } catch (Exception e) {
            log.error("Failed to upload avatar to Cloudinary: {}", e.getMessage());
            throw new RuntimeException("Failed to upload avatar to Cloudinary: " + e.getMessage());
        }

        log.info("Uploaded image to Cloudinary: {}", imageUrl);

        return CloudinaryResponse.builder()
                .url(imageUrl)
                .publicId(imagePublicId)
                .build();
    }

    @Override
    public List<CloudinaryResponse> uploadImages(List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            return List.of();
        }

        // Sử dụng parallelStream thay vì stream
        return images.parallelStream()
                .map(this::uploadImage)
                .toList();
    }

    @Override
    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            // Log error but continue to delete in database
            throw new RuntimeException("Failed to delete avatar from Cloudinary: " + e.getMessage());
        }
    }

    @Override
    public void deleteImages(List<String> publicIds) {
        if (publicIds == null || publicIds.isEmpty()) {
            return;
        }

        // Sử dụng parallelStream để xóa nhiều ảnh cùng lúc cho nhanh
        publicIds.parallelStream().forEach(id -> {
            try {
                // Gọi trực tiếp cloudinary để xóa
                cloudinary.uploader().destroy(id, ObjectUtils.emptyMap());

                // Hoặc gọi lại hàm đơn lẻ nếu muốn tái sử dụng logic (nhưng cần handle exception)
                // this.deleteImage(id);
            } catch (Exception e) {
                // Quan trọng: Chỉ log lỗi, KHÔNG ném Exception.
                // Để đảm bảo nếu 1 ảnh lỗi, các ảnh khác vẫn được xóa tiếp.
                log.error("Failed to delete image with publicId {}: {}", id, e.getMessage());
            }
        });
    }
}

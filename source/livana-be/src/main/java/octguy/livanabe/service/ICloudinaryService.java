package octguy.livanabe.service;

import octguy.livanabe.dto.response.CloudinaryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ICloudinaryService {

    CloudinaryResponse uploadImage(MultipartFile image);

    List<CloudinaryResponse> uploadImages(List<MultipartFile> images);

    void deleteImage(String publicId);

    void deleteImages(List<String> publicIds);
}

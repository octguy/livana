package octguy.livanabe.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class SendMessageRequest {
    
    @NotNull(message = "Receiver ID is required")
    private UUID receiverId;
    
    @NotBlank(message = "Message type is required")
    private String messageType; // TEXT, IMAGE, FILE
    
    @Size(max = 2000, message = "Content must be at most 2000 characters")
    private String content;
    
    @Size(max = 500, message = "File URL must be at most 500 characters")
    private String fileUrl;
    
    @Size(max = 255, message = "File name must be at most 255 characters")
    private String fileName;
    
    private Long fileSize;
    
    @Size(max = 100, message = "File type must be at most 100 characters")
    private String fileType;
}

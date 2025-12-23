package octguy.livanabe.service;

import octguy.livanabe.dto.response.AmenityResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface IAmenityService {

    Page<AmenityResponse> findAll(int page, int size);

    List<AmenityResponse> findAll();

    AmenityResponse findById(UUID id);

    AmenityResponse create(String name, String icon);

    AmenityResponse update(UUID id, String name, String icon);

    void softDelete(UUID id);

    void hardDelete(UUID id);

    void softDeleteAll();

    void hardDeleteAll();
}

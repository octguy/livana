package octguy.livanabe.service;

import octguy.livanabe.dto.response.FacilityResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface IFacilityService {

    Page<FacilityResponse> findAll(int page, int size);

    List<FacilityResponse> findAll();

    FacilityResponse create(String name, String icon);

    FacilityResponse update(UUID id, String name, String icon);

    void softDelete(UUID id);

    void hardDelete(UUID id);

    void softDeleteAll();

    void hardDeleteAll();
}

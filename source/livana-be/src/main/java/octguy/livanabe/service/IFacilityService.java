package octguy.livanabe.service;

import octguy.livanabe.dto.response.FacilityResponse;

import java.util.List;
import java.util.UUID;

public interface IFacilityService {

    List<FacilityResponse> findAll();

    FacilityResponse create(String name, String icon);

    FacilityResponse update(UUID id, String name, String icon);

    void softDelete(UUID id);

    void hardDelete(UUID id);

    void softDeleteAll();

    void hardDeleteAll();
}

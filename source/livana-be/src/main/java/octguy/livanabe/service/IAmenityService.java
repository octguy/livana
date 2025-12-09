package octguy.livanabe.service;

import octguy.livanabe.dto.response.AmenityResponse;

import java.util.List;
import java.util.UUID;

public interface IAmenityService {

    List<AmenityResponse> findAll();

    AmenityResponse create(String name, String icon);

    AmenityResponse update(UUID id, String name, String icon);
}

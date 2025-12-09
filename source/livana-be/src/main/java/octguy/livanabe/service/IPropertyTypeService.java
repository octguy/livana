package octguy.livanabe.service;

import octguy.livanabe.dto.response.PropertyTypeResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface IPropertyTypeService {

    Page<PropertyTypeResponse> findAll(int page, int size);

    List<PropertyTypeResponse> findAll();

    PropertyTypeResponse create(String name, String icon);

    PropertyTypeResponse update(UUID id, String name, String icon);

    void softDelete(UUID id);

    void hardDelete(UUID id);

    void softDeleteAll();

    void hardDeleteAll();

//    UserInterestsResponse setUserInterests(SetInterestRequest request);

//    UserInterestsResponse getUserInterests();
}

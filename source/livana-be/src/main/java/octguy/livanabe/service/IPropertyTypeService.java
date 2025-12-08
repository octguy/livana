package octguy.livanabe.service;

import octguy.livanabe.dto.response.PropertyTypeResponse;

import java.util.List;
import java.util.UUID;

public interface IPropertyTypeService {

    List<PropertyTypeResponse> findAll();

    PropertyTypeResponse create(String name);

    PropertyTypeResponse update(UUID id, String name);

//    UserInterestsResponse setUserInterests(SetInterestRequest request);

//    UserInterestsResponse getUserInterests();
}

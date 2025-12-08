package octguy.livanabe.service;

import octguy.livanabe.dto.response.PropertyTypeResponse;

import java.util.List;
import java.util.UUID;

public interface IPropertyTypeService {

    List<PropertyTypeResponse> findAll();

    PropertyTypeResponse create(String name, String icon);

    PropertyTypeResponse update(UUID id, String name, String icon);

//    UserInterestsResponse setUserInterests(SetInterestRequest request);

//    UserInterestsResponse getUserInterests();
}

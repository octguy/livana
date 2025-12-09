package octguy.livanabe.service;

import octguy.livanabe.dto.response.ExperienceCategoryResponse;

import java.util.List;
import java.util.UUID;

public interface IExperienceCategoryService {

    List<ExperienceCategoryResponse> findAll();

    ExperienceCategoryResponse create(String name, String icon);

    ExperienceCategoryResponse update(UUID id, String name, String icon);

    void softDelete(UUID id);

    void hardDelete(UUID id);

    void softDeleteAll();

    void hardDeleteAll();
}

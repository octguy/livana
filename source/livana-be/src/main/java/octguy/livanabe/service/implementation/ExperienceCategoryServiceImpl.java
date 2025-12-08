package octguy.livanabe.service.implementation;

import octguy.livanabe.dto.response.ExperienceCategoryResponse;
import octguy.livanabe.entity.ExperienceCategory;
import octguy.livanabe.repository.ExperienceCategoryRepository;
import octguy.livanabe.service.IExperienceCategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExperienceCategoryServiceImpl implements IExperienceCategoryService {

    private final ExperienceCategoryRepository experienceCategoryRepository;

    public ExperienceCategoryServiceImpl(ExperienceCategoryRepository experienceCategoryRepository) {
        this.experienceCategoryRepository = experienceCategoryRepository;
    }

    @Override
    public List<ExperienceCategoryResponse> findAll() {
        return experienceCategoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ExperienceCategoryResponse create(String name, String icon) {
        ExperienceCategory experienceCategory = new ExperienceCategory();
        experienceCategory.setName(name);
        experienceCategory.setIcon(icon);
        experienceCategory.setUpdatedAt(LocalDateTime.now());
        experienceCategoryRepository.save(experienceCategory);

        return toResponse(experienceCategory);
    }

    @Override
    public ExperienceCategoryResponse update(UUID id, String name, String icon) {
        Optional<ExperienceCategory> experienceCategory = experienceCategoryRepository.findById(id);

        if (experienceCategory.isEmpty()) return null;

        ExperienceCategory updatedExperienceCategory = experienceCategory.get();
        updatedExperienceCategory.setName(name);
        updatedExperienceCategory.setIcon(icon);
        experienceCategoryRepository.save(updatedExperienceCategory);

        return toResponse(updatedExperienceCategory);
    }

    private ExperienceCategoryResponse toResponse(ExperienceCategory experienceCategory) {
        return ExperienceCategoryResponse.builder()
                .id(experienceCategory.getId())
                .name(experienceCategory.getName())
                .icon(experienceCategory.getIcon())
                .build();
    }
}

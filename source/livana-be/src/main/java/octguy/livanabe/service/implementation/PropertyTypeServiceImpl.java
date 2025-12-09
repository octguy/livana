package octguy.livanabe.service.implementation;

import octguy.livanabe.dto.response.PropertyTypeResponse;
import octguy.livanabe.entity.PropertyType;
import octguy.livanabe.repository.PropertyTypeRepository;
import octguy.livanabe.service.IPropertyTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PropertyTypeServiceImpl implements IPropertyTypeService {

    private final PropertyTypeRepository propertyTypeRepository;

    public PropertyTypeServiceImpl(PropertyTypeRepository propertyTypeRepository) {
        this.propertyTypeRepository = propertyTypeRepository;
    }

    @Override
    public List<PropertyTypeResponse> findAll() {
        return propertyTypeRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public PropertyTypeResponse create(String name, String icon) {
        PropertyType propertyType = new PropertyType();
        propertyType.setName(name);
        propertyType.setIcon(icon);
        propertyType.setUpdatedAt(LocalDateTime.now());
        propertyTypeRepository.save(propertyType);

        return toResponse(propertyType);
    }

    @Override
    public PropertyTypeResponse update(UUID id, String name, String icon) {
        Optional<PropertyType> propertyType = propertyTypeRepository.findById(id);

        if (propertyType.isEmpty()) return null;

        PropertyType updatedPropertyType = propertyType.get();
        updatedPropertyType.setName(name);
        updatedPropertyType.setIcon(icon);
        propertyTypeRepository.save(updatedPropertyType);

        return toResponse(updatedPropertyType);
    }

    @Override
    @Transactional
    public void softDelete(UUID id) {
        Optional<PropertyType> propertyType = propertyTypeRepository.findById(id);
        if (propertyType.isPresent()) {
            PropertyType entity = propertyType.get();
            entity.setDeletedAt(LocalDateTime.now());
            propertyTypeRepository.save(entity);
        }
    }

    @Override
    @Transactional
    public void hardDelete(UUID id) {
        propertyTypeRepository.hardDeleteById(id);
    }

    @Override
    @Transactional
    public void softDeleteAll() {
        List<PropertyType> propertyTypes = propertyTypeRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        propertyTypes.forEach(propertyType -> propertyType.setDeletedAt(now));
        propertyTypeRepository.saveAll(propertyTypes);
    }

    @Override
    @Transactional
    public void hardDeleteAll() {
        propertyTypeRepository.hardDeleteAll();
    }

    private PropertyTypeResponse toResponse(PropertyType propertyType) {
        return PropertyTypeResponse.builder()
                .id(propertyType.getId())
                .name(propertyType.getName())
                .icon(propertyType.getIcon())
                .build();
    }
}

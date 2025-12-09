package octguy.livanabe.service.implementation;

import octguy.livanabe.dto.response.AmenityResponse;
import octguy.livanabe.entity.Amenity;
import octguy.livanabe.repository.AmenityRepository;
import octguy.livanabe.service.IAmenityService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AmenityServiceImpl implements IAmenityService {

    private final AmenityRepository amenityRepository;

    public AmenityServiceImpl(AmenityRepository amenityRepository) {
        this.amenityRepository = amenityRepository;
    }

    @Override
    public Page<AmenityResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        return amenityRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Override
    public List<AmenityResponse> findAll() {
        return amenityRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AmenityResponse create(String name, String icon) {
        Amenity amenity = new Amenity();
        amenity.setName(name);
        amenity.setIcon(icon);
        amenity.setUpdatedAt(LocalDateTime.now());
        amenityRepository.save(amenity);

        return toResponse(amenity);
    }

    @Override
    public AmenityResponse update(UUID id, String name, String icon) {
        Optional<Amenity> amenity = amenityRepository.findById(id);

        if (amenity.isEmpty()) return null;

        Amenity updatedAmenity = amenity.get();
        updatedAmenity.setName(name);
        updatedAmenity.setIcon(icon);
        amenityRepository.save(updatedAmenity);

        return toResponse(updatedAmenity);
    }

    @Override
    @Transactional
    public void softDelete(UUID id) {
        Optional<Amenity> amenity = amenityRepository.findById(id);
        if (amenity.isPresent()) {
            Amenity entity = amenity.get();
            entity.setDeletedAt(LocalDateTime.now());
            amenityRepository.save(entity);
        }
    }

    @Override
    @Transactional
    public void hardDelete(UUID id) {
        amenityRepository.hardDeleteById(id);
    }

    @Override
    @Transactional
    public void softDeleteAll() {
        List<Amenity> amenities = amenityRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        amenities.forEach(amenity -> amenity.setDeletedAt(now));
        amenityRepository.saveAll(amenities);
    }

    @Override
    @Transactional
    public void hardDeleteAll() {
        amenityRepository.hardDeleteAll();
    }

    private AmenityResponse toResponse(Amenity amenity) {
        return AmenityResponse.builder()
                .id(amenity.getId())
                .name(amenity.getName())
                .icon(amenity.getIcon())
                .build();
    }
}

package octguy.livanabe.service.implementation;

import octguy.livanabe.dto.response.AmenityResponse;
import octguy.livanabe.entity.Amenity;
import octguy.livanabe.repository.AmenityRepository;
import octguy.livanabe.service.IAmenityService;
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

    private AmenityResponse toResponse(Amenity amenity) {
        return AmenityResponse.builder()
                .id(amenity.getId())
                .name(amenity.getName())
                .icon(amenity.getIcon())
                .build();
    }
}

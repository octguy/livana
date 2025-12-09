package octguy.livanabe.service.implementation;

import octguy.livanabe.dto.response.FacilityResponse;
import octguy.livanabe.entity.Facility;
import octguy.livanabe.repository.FacilityRepository;
import octguy.livanabe.service.IFacilityService;
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
public class FacilityServiceImpl implements IFacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityServiceImpl(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    @Override
    public Page<FacilityResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        return facilityRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Override
    public List<FacilityResponse> findAll() {
        return facilityRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public FacilityResponse create(String name, String icon) {
        Facility facility = new Facility();
        facility.setName(name);
        facility.setIcon(icon);
        facility.setUpdatedAt(LocalDateTime.now());
        facilityRepository.save(facility);

        return toResponse(facility);
    }

    @Override
    public FacilityResponse update(UUID id, String name, String icon) {
        Optional<Facility> facility = facilityRepository.findById(id);

        if (facility.isEmpty()) return null;

        Facility updatedFacility = facility.get();
        updatedFacility.setName(name);
        updatedFacility.setIcon(icon);
        facilityRepository.save(updatedFacility);

        return toResponse(updatedFacility);
    }

    @Override
    @Transactional
    public void softDelete(UUID id) {
        Optional<Facility> facility = facilityRepository.findById(id);
        if (facility.isPresent()) {
            Facility entity = facility.get();
            entity.setDeletedAt(LocalDateTime.now());
            facilityRepository.save(entity);
        }
    }

    @Override
    @Transactional
    public void hardDelete(UUID id) {
        facilityRepository.hardDeleteById(id);
    }

    @Override
    @Transactional
    public void softDeleteAll() {
        List<Facility> facilities = facilityRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        facilities.forEach(facility -> facility.setDeletedAt(now));
        facilityRepository.saveAll(facilities);
    }

    @Override
    @Transactional
    public void hardDeleteAll() {
        facilityRepository.hardDeleteAll();
    }

    private FacilityResponse toResponse(Facility facility) {
        return FacilityResponse.builder()
                .id(facility.getId())
                .name(facility.getName())
                .icon(facility.getIcon())
                .build();
    }
}

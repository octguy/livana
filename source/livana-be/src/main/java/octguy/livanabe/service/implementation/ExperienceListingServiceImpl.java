package octguy.livanabe.service.implementation;

import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.dto.dto.ImageOrderDto;
import octguy.livanabe.dto.dto.ImageOrderResponse;
import octguy.livanabe.dto.dto.ListingHostDto;
import octguy.livanabe.dto.request.CreateExperienceListingRequest;
import octguy.livanabe.dto.request.LocationSearchRequest;
import octguy.livanabe.dto.request.UpdateExperienceListingRequest;
import octguy.livanabe.dto.response.CloudinaryResponse;
import octguy.livanabe.dto.response.ExperienceCategoryResponse;
import octguy.livanabe.dto.response.ExperienceListingResponse;
import octguy.livanabe.dto.response.ListingSearchResult;
import octguy.livanabe.dto.response.SessionResponse;
import octguy.livanabe.entity.*;
import octguy.livanabe.exception.ResourceNotFoundException;
import octguy.livanabe.repository.ExperienceCategoryRepository;
import octguy.livanabe.repository.ExperienceListingRepository;
import octguy.livanabe.repository.ExperienceSessionRepository;
import octguy.livanabe.repository.ListingImageRepository;
import octguy.livanabe.repository.UserProfileRepository;
import octguy.livanabe.service.IExperienceListingService;
import octguy.livanabe.utils.GeoUtils;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ExperienceListingServiceImpl implements IExperienceListingService {

    private final ExperienceListingRepository experienceListingRepository;
    private final ExperienceCategoryRepository experienceCategoryRepository;
    private final ListingImageRepository listingImageRepository;
    private final ExperienceSessionRepository experienceSessionRepository;
    private final UserProfileRepository userProfileRepository;

    public ExperienceListingServiceImpl(ExperienceListingRepository experienceListingRepository,
                                        ExperienceCategoryRepository experienceCategoryRepository,
                                        ListingImageRepository listingImageRepository,
                                        ExperienceSessionRepository experienceSessionRepository,
                                        UserProfileRepository userProfileRepository) {
        this.experienceListingRepository = experienceListingRepository;
        this.experienceCategoryRepository = experienceCategoryRepository;
        this.listingImageRepository = listingImageRepository;
        this.experienceSessionRepository = experienceSessionRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    @Transactional
    public ExperienceListingResponse createExperienceListing(CreateExperienceListingRequest request) {
        User user = SecurityUtils.getCurrentUser();

        ExperienceCategory category = experienceCategoryRepository.findById(request.getExperienceCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Experience category not found: " + request.getExperienceCategoryId()));

        ExperienceListing experienceListing = buildExperienceListing(user, request, category);
        ExperienceListing savedListing = experienceListingRepository.save(experienceListing);

        List<ListingImage> listingImages = createListingImages(savedListing, request.getImages());

        return buildResponse(savedListing, user, category, listingImages);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceListingResponse> getAllExperienceListings() {
        log.info("Fetching all experience listings");
        List<ExperienceListing> listings = experienceListingRepository.findAll();

        if (listings.isEmpty()) {
            return Collections.emptyList();
        }

        return convertToResponsesBatch(listings);
    }

    @Override
    @Transactional(readOnly = true)
    public ExperienceListingResponse getExperienceListingById(UUID id) {
        log.info("Fetching experience listing with id {}", id);
        ExperienceListing listing = experienceListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience listing not found: " + id));

        return convertToResponse(listing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceListingResponse> getExperienceListingsByHostId(UUID hostId) {
        log.info("Fetching experience listings for host {}", hostId);
        List<ExperienceListing> listings = experienceListingRepository.findByHostId(hostId);

        if (listings.isEmpty()) {
            return Collections.emptyList();
        }

        return convertToResponsesBatch(listings);
    }

    @Override
    @Transactional
    public ExperienceListingResponse updateExperienceListing(UUID id, UpdateExperienceListingRequest request) {
        log.info("Updating experience listing with id {}", id);
        
        // Get current user and verify ownership
        User currentUser = SecurityUtils.getCurrentUser();
        
        ExperienceListing listing = experienceListingRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Experience listing not found with id {}", id);
                    return new ResourceNotFoundException("Experience listing not found: " + id);
                });
        
        // Verify the current user is the owner
        if (!listing.getHost().getId().equals(currentUser.getId())) {
            log.error("User {} is not the owner of listing {}", currentUser.getId(), id);
            throw new RuntimeException("You are not authorized to update this listing");
        }
        
        // Update category if changed
        if (request.getExperienceCategoryId() != null) {
            ExperienceCategory category = experienceCategoryRepository.findById(request.getExperienceCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Experience category not found: " + request.getExperienceCategoryId()));
            listing.setExperienceCategory(category);
        }
        
        // Update basic fields
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setCapacity(request.getCapacity());
        listing.setAddress(request.getAddress());
        listing.setLatitude(request.getLatitude());
        listing.setLongitude(request.getLongitude());
        listing.setBasePrice(request.getPrice());
        
        ExperienceListing savedListing = experienceListingRepository.save(listing);
        
        // Update images - delete existing and create new
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            listingImageRepository.deleteByListingId(savedListing.getId());
            createListingImages(savedListing, request.getImages());
        }
        
        return convertToResponse(savedListing);
    }

//    @Override
//    @Transactional(readOnly = true)
//    public List<ExperienceListingResponse> getAllExperienceListings() {
//        log.info("Fetching all experience listings");
//        List<ExperienceListing> listings = experienceListingRepository.findAll();
//
//        if (listings.isEmpty()) {
//            return Collections.emptyList();
//        }
//
//        return convertToResponsesBatch(listings);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public ExperienceListingResponse getExperienceListingById(UUID id) {
//        log.info("Fetching experience listing with id {}", id);
//        ExperienceListing listing = experienceListingRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Experience listing not found: " + id));
//
//        return convertToResponse(listing);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<ExperienceListingResponse> getExperienceListingsByHostId(UUID hostId) {
//        log.info("Fetching experience listings for host {}", hostId);
//        List<ExperienceListing> listings = experienceListingRepository.findByHostId(hostId);
//
//        if (listings.isEmpty()) {
//            return Collections.emptyList();
//        }
//
//        return convertToResponsesBatch(listings);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<ExperienceListingResponse> getExperienceListingsByCategoryId(UUID categoryId) {
//        log.info("Fetching experience listings for category {}", categoryId);
//
//        // Validate category exists
//        if (!experienceCategoryRepository.existsById(categoryId)) {
//            throw new ResourceNotFoundException("Experience category not found: " + categoryId);
//        }
//
//        List<ExperienceListing> listings = experienceListingRepository.findByExperienceCategoryId(categoryId);
//
//        if (listings.isEmpty()) {
//            return Collections.emptyList();
//        }
//
//        return convertToResponsesBatch(listings);
//    }

    // ==================== Private Helper Methods ====================

    private ExperienceListing buildExperienceListing(User user, CreateExperienceListingRequest request,
                                                     ExperienceCategory category) {
        ExperienceListing listing = new ExperienceListing();
        listing.setHost(user);
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setCapacity(request.getCapacity());
        listing.setAddress(request.getAddress());
        listing.setLatitude(request.getLatitude());
        listing.setLongitude(request.getLongitude());
        listing.setBasePrice(request.getPrice());
        listing.setExperienceCategory(category);
        listing.setIsAvailable(true);
        return listing;
    }

    private List<ListingImage> createListingImages(ExperienceListing experienceListing, List<ImageOrderDto> imageOrderDtos) {
        if (imageOrderDtos == null || imageOrderDtos.isEmpty()) {
            log.warn("No images provided for experience listing {}", experienceListing.getId());
            return Collections.emptyList();
        }

        List<ListingImage> listingImages = imageOrderDtos.stream()
                .map(imageDto -> {
                    // Image already uploaded to Cloudinary from frontend
                    ListingImage listingImage = new ListingImage();
                    listingImage.setListing(experienceListing);
                    listingImage.setImageUrl(imageDto.getImage());
                    listingImage.setImagePublicId(imageDto.getPublicId());
                    listingImage.setImageOrder(imageDto.getOrder());
                    listingImage.setThumbnail(imageDto.getOrder() == 1);

                    return listingImage;
                })
                .toList();

        List<ListingImage> savedImages = listingImageRepository.saveAll(listingImages);
        log.info("Created {} images for experience listing {}", savedImages.size(), experienceListing.getId());
        return savedImages;
    }

    // ==================== Response Building (Optimized for Batch) ====================

    private List<ExperienceListingResponse> convertToResponsesBatch(List<ExperienceListing> listings) {
        if (listings.isEmpty()) {
            return Collections.emptyList();
        }

        // Extract all IDs
        Set<UUID> listingIds = listings.stream()
                .map(ExperienceListing::getId)
                .collect(Collectors.toSet());

        Set<UUID> hostIds = listings.stream()
                .map(l -> l.getHost().getId())
                .collect(Collectors.toSet());

        Set<UUID> categoryIds = listings.stream()
                .map(l -> l.getExperienceCategory().getId())
                .collect(Collectors.toSet());

        // Batch fetch all related data in 4 queries
        Map<UUID, UserProfile> profileMap = userProfileRepository.findByUserIdIn(hostIds).stream()
                .collect(Collectors.toMap(p -> p.getUser().getId(), p -> p));

        Map<UUID, ExperienceCategory> categoryMap = experienceCategoryRepository.findAllById(categoryIds).stream()
                .collect(Collectors.toMap(ExperienceCategory::getId, c -> c));

        Map<UUID, List<ListingImage>> imagesMap = listingImageRepository
                .findByListingIdInOrderByImageOrderAsc(listingIds).stream()
                .collect(Collectors.groupingBy(img -> img.getListing().getId()));

        Map<UUID, List<ExperienceSession>> sessionsMap = experienceSessionRepository
                .findByExperienceListingIdIn(listingIds).stream()
                .collect(Collectors.groupingBy(session -> session.getExperienceListing().getId()));

        // Build responses
        return listings.stream()
                .map(listing -> {
                    UserProfile profile = profileMap.get(listing.getHost().getId());
                    ExperienceCategory category = categoryMap.get(listing.getExperienceCategory().getId());
                    List<ListingImage> images = imagesMap.getOrDefault(listing.getId(), Collections.emptyList());
                    List<ExperienceSession> sessions = sessionsMap.getOrDefault(listing.getId(), Collections.emptyList());

                    if (profile == null) {
                        log.error("User profile not found for user {}", listing.getHost().getId());
                        throw new ResourceNotFoundException("User profile not found for user: " + listing.getHost().getId());
                    }

                    return buildResponseFromData(listing, listing.getHost(), profile, category, images, sessions);
                })
                .toList();
    }

    private ExperienceListingResponse convertToResponse(ExperienceListing listing) {
        User host = listing.getHost();

        UserProfile profile = userProfileRepository.findByUserId(host.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for user: " + host.getId()));

        ExperienceCategory category = listing.getExperienceCategory();

        List<ListingImage> images = listingImageRepository
                .findByListingIdOrderByImageOrderAsc(listing.getId());

        List<ExperienceSession> sessions = experienceSessionRepository
                .findByExperienceListingIdOrderByStartTimeAsc(listing.getId());

        return buildResponseFromData(listing, host, profile, category, images, sessions);
    }

    private ExperienceListingResponse buildResponse(ExperienceListing listing, User host,
                                                    ExperienceCategory category, List<ListingImage> images) {
        UserProfile profile = userProfileRepository.findByUserId(host.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for user: " + host.getId()));

        List<ExperienceSession> sessions = experienceSessionRepository
                .findByExperienceListingIdOrderByStartTimeAsc(listing.getId());

        return buildResponseFromData(listing, host, profile, category, images, sessions);
    }

    private ExperienceListingResponse buildResponseFromData(ExperienceListing listing, User host,
                                                            UserProfile profile, ExperienceCategory category,
                                                            List<ListingImage> images, List<ExperienceSession> sessions) {
        ListingHostDto hostDto = ListingHostDto.builder()
                .hostId(host.getId())
                .hostDisplayName(profile.getDisplayName())
                .avatarUrl(profile.getAvatarUrl())
                .phoneNumber(profile.getPhoneNumber())
                .build();

        List<ImageOrderResponse> imageResponses = images.stream()
                .map(img -> ImageOrderResponse.builder()
                        .image(CloudinaryResponse.builder()
                                .url(img.getImageUrl())
                                .publicId(img.getImagePublicId())
                                .build())
                        .order(img.getImageOrder())
                        .build())
                .toList();

        ExperienceCategoryResponse categoryResponse = ExperienceCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .icon(category.getIcon())
                .build();

        List<SessionResponse> sessionResponses = sessions.stream()
                .map(this::buildSessionResponse)
                .toList();

        return ExperienceListingResponse.builder()
                .listingId(listing.getId())
                .host(hostDto)
                .title(listing.getTitle())
                .price(listing.getBasePrice())
                .description(listing.getDescription())
                .capacity(listing.getCapacity())
                .address(listing.getAddress())
                .latitude(listing.getLatitude())
                .longitude(listing.getLongitude())
                .experienceCategory(categoryResponse)
                .images(imageResponses)
                .sessions(sessionResponses)
                .build();
    }

    private SessionResponse buildSessionResponse(ExperienceSession session) {
        int capacity = session.getExperienceListing().getCapacity();
        int bookedCount = session.getBookedParticipants();
        
        return SessionResponse.builder()
                .id(session.getId())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .capacity(capacity)
                .bookedCount(bookedCount)
                .availableSlots(capacity - bookedCount)
                .price(session.getExperienceListing().getBasePrice())
                .status(session.getSessionStatus().name())
                .createdAt(session.getCreatedAt())
                .build();
    }
    
    @Override
    public List<ListingSearchResult<ExperienceListingResponse>> searchByLocation(LocationSearchRequest request) {
        // Get bounding box for initial filtering
        double[] bbox = GeoUtils.getBoundingBox(
                request.getLatitude(), 
                request.getLongitude(), 
                request.getRadiusKm()
        );
        
        // Parse optional filters
        BigDecimal minPrice = request.getMinPrice() != null ? BigDecimal.valueOf(request.getMinPrice()) : null;
        BigDecimal maxPrice = request.getMaxPrice() != null ? BigDecimal.valueOf(request.getMaxPrice()) : null;
        UUID categoryId = request.getExperienceCategoryId() != null ? UUID.fromString(request.getExperienceCategoryId()) : null;
        
        // Query with bounding box and filters
        List<ExperienceListing> listings = experienceListingRepository.findByLocationWithFilters(
                bbox[0], bbox[1], bbox[2], bbox[3],
                minPrice, maxPrice,
                request.getMinCapacity(),
                categoryId
        );
        
        // Calculate precise distance and filter by actual radius
        List<ListingSearchResult<ExperienceListingResponse>> results = new java.util.ArrayList<>();
        for (ExperienceListing listing : listings) {
            double distance = GeoUtils.calculateDistance(
                    request.getLatitude(), request.getLongitude(),
                    listing.getLatitude(), listing.getLongitude()
            );
            if (distance <= request.getRadiusKm()) {
                results.add(ListingSearchResult.<ExperienceListingResponse>builder()
                        .listing(convertToResponse(listing))
                        .distanceKm(Math.round(distance * 100.0) / 100.0)
                        .build());
            }
        }
        results.sort(Comparator.comparingDouble(ListingSearchResult::getDistanceKm));
        return results;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ExperienceListingResponse> getAllExperienceListingsPaginated(Pageable pageable) {
        log.info("Fetching paginated experience listings");
        Page<ExperienceListing> listings = experienceListingRepository.findAll(pageable);
        return listings.map(this::convertToResponse);
    }
    
    @Override
    @Transactional
    public void deleteExperienceListing(UUID id) {
        log.info("Deleting experience listing with id {}", id);
        
        ExperienceListing listing = experienceListingRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Experience listing not found with id {}", id);
                    return new ResourceNotFoundException("Experience listing not found: " + id);
                });
        
        // Delete related data first
        experienceSessionRepository.deleteByExperienceListingId(id);
        listingImageRepository.deleteByListingId(id);
        
        // Delete the listing
        experienceListingRepository.delete(listing);
        
        log.info("Successfully deleted experience listing with id {}", id);
    }
}
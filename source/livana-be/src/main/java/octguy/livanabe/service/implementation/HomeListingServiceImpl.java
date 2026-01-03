package octguy.livanabe.service.implementation;

import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.dto.dto.FacilityQuantityDto;
import octguy.livanabe.dto.dto.ImageOrderDto;
import octguy.livanabe.dto.dto.ImageOrderResponse;
import octguy.livanabe.dto.dto.ListingHostDto;
import octguy.livanabe.dto.request.CreateHomeListingRequest;
import octguy.livanabe.dto.request.HomeFacilityRequest;
import octguy.livanabe.dto.request.LocationSearchRequest;
import octguy.livanabe.dto.request.UpdateHomeListingRequest;
import octguy.livanabe.dto.response.CloudinaryResponse;
import octguy.livanabe.dto.response.HomeListingResponse;
import octguy.livanabe.dto.response.ListingSearchResult;
import octguy.livanabe.entity.*;
import octguy.livanabe.exception.ResourceNotFoundException;
import octguy.livanabe.repository.*;
import octguy.livanabe.service.IHomeListingService;
import octguy.livanabe.utils.GeoUtils;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;

@Slf4j
@Service
public class HomeListingServiceImpl implements IHomeListingService {

    private final HomeListingRepository homeListingRepository;

    private final UserProfileRepository userProfileRepository;

    private final PropertyTypeRepository propertyTypeRepository;

    private final FacilityRepository facilityRepository;

    private final AmenityRepository amenityRepository;

    private final HomeFacilityRepository homeFacilityRepository;

    private final HomeAmenityRepository homeAmenityRepository;

    private final ListingImageRepository listingImageRepository;
    
    private final ReviewRepository reviewRepository;
    
    private final HomeBookingRepository homeBookingRepository;

    public HomeListingServiceImpl(HomeListingRepository homeListingRepository,
                                  PropertyTypeRepository propertyTypeRepository,
                                  FacilityRepository facilityRepository,
                                  AmenityRepository amenityRepository,
                                  HomeFacilityRepository homeFacilityRepository,
                                  HomeAmenityRepository homeAmenityRepository,
                                  ListingImageRepository listingImageRepository,
                                  UserProfileRepository userProfileRepository,
                                  ReviewRepository reviewRepository,
                                  HomeBookingRepository homeBookingRepository) {
        this.userProfileRepository = userProfileRepository;
        this.homeFacilityRepository = homeFacilityRepository;
        this.homeAmenityRepository = homeAmenityRepository;
        this.amenityRepository = amenityRepository;
        this.facilityRepository = facilityRepository;
        this.propertyTypeRepository = propertyTypeRepository;
        this.homeListingRepository = homeListingRepository;
        this.listingImageRepository = listingImageRepository;
        this.reviewRepository = reviewRepository;
        this.homeBookingRepository = homeBookingRepository;
    }

    @Override
    @Transactional
    public HomeListingResponse createHomeListing(CreateHomeListingRequest request) {
        // Get current user
        User user = SecurityUtils.getCurrentUser();

        PropertyType propertyType = propertyTypeRepository.findById(request.getPropertyTypeId())
                .orElseThrow(() -> {
                    log.error("Property type not found with id {}", request.getPropertyTypeId());
                    return new RuntimeException("Property type not found");
                });

        List<Facility> facilities = validateFacilities(request.getFacilityRequests());

        List<Amenity> amenities = validateAmenities(request.getAmenityIds());

        HomeListing homeListing = new HomeListing();

        homeListing.setHost(user);
        homeListing.setTitle(request.getTitle());
        homeListing.setDescription(request.getDescription());
        homeListing.setCapacity(request.getCapacity());
        homeListing.setAddress(request.getAddress());
        homeListing.setLatitude(request.getLatitude());
        homeListing.setLongitude(request.getLongitude());
        homeListing.setBasePrice(request.getPrice());
        homeListing.setPropertyType(propertyType);
        homeListing.setIsAvailable(true);

        HomeListing savedListing = homeListingRepository.save(homeListing);

        createHomeFacilities(savedListing, request.getFacilityRequests(), facilities);
        createHomeAmenities(savedListing, amenities);
        List<ListingImage> listingImages = createListingImage(savedListing, request.getImages());

        return buildHomeListingResponse(savedListing, request, listingImages, user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeListingResponse> getAllHomeListings() {
        log.info("Fetching all home listings");
        List<HomeListing> homeListings = homeListingRepository.findAll();
        return homeListings.stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HomeListingResponse getHomeListingById(UUID id) {
        log.info("Fetching home listing with id {}", id);
        HomeListing homeListing = homeListingRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Home listing not found with id {}", id);
                    return new RuntimeException("Home listing not found");
                });
        return convertToResponse(homeListing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeListingResponse> getHomeListingsByHostId(UUID hostId) {
        log.info("Fetching home listings for host {}", hostId);
        List<HomeListing> homeListings = homeListingRepository.findByHostId(hostId);
        return homeListings.stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional
    public HomeListingResponse updateHomeListing(UUID id, UpdateHomeListingRequest request) {
        log.info("Updating home listing with id {}", id);
        
        // Get current user and verify ownership
        User currentUser = SecurityUtils.getCurrentUser();
        
        HomeListing homeListing = homeListingRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Home listing not found with id {}", id);
                    return new ResourceNotFoundException("Home listing not found");
                });
        
        // Verify the current user is the owner
        if (!homeListing.getHost().getId().equals(currentUser.getId())) {
            log.error("User {} is not the owner of listing {}", currentUser.getId(), id);
            throw new RuntimeException("You are not authorized to update this listing");
        }
        
        // Update property type if changed
        if (request.getPropertyTypeId() != null) {
            PropertyType propertyType = propertyTypeRepository.findById(request.getPropertyTypeId())
                    .orElseThrow(() -> {
                        log.error("Property type not found with id {}", request.getPropertyTypeId());
                        return new ResourceNotFoundException("Property type not found");
                    });
            homeListing.setPropertyType(propertyType);
        }
        
        // Update basic fields
        homeListing.setTitle(request.getTitle());
        homeListing.setDescription(request.getDescription());
        homeListing.setCapacity(request.getCapacity());
        homeListing.setAddress(request.getAddress());
        homeListing.setLatitude(request.getLatitude());
        homeListing.setLongitude(request.getLongitude());
        homeListing.setBasePrice(request.getPrice());
        
        HomeListing savedListing = homeListingRepository.save(homeListing);
        
        // Update facilities - delete existing and create new
        if (request.getFacilityRequests() != null) {
            homeFacilityRepository.deleteByListingId(savedListing.getId());
            List<Facility> facilities = validateFacilities(request.getFacilityRequests());
            createHomeFacilities(savedListing, request.getFacilityRequests(), facilities);
        }
        
        // Update amenities - delete existing and create new
        if (request.getAmenityIds() != null) {
            homeAmenityRepository.deleteByListingId(savedListing.getId());
            List<Amenity> amenities = validateAmenities(request.getAmenityIds());
            createHomeAmenities(savedListing, amenities);
        }
        
        // Update images - delete existing and create new
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            listingImageRepository.deleteByListingId(savedListing.getId());
            createListingImage(savedListing, request.getImages());
        }
        
        return convertToResponse(savedListing);
    }

    private void createHomeFacilities(HomeListing homeListing, List<HomeFacilityRequest> requests, List<Facility> facilities) {
        if (requests.isEmpty()) return;

        Map<UUID, Facility> facilityMap = facilities.stream()
                .collect(toMap(Facility::getId, Function.identity()));

        List<HomeFacility> homeFacilities = requests.stream().map(
            request -> {
                HomeFacility homeFacility = new HomeFacility();

                homeFacility.setListing(homeListing);

                Facility facility = facilityMap.get(request.getFacilityId());
                homeFacility.setFacility(facility);

                homeFacility.setQuantity(request.getQuantity());

                return homeFacility;
        }).toList();

        homeFacilityRepository.saveAll(homeFacilities);
    }

    private void createHomeAmenities(HomeListing homeListing, List<Amenity> amenities) {
        if (amenities == null || amenities.isEmpty()) return;

        List<HomeAmenity> homeAmenities = amenities.stream().map(amenity -> {
            HomeAmenity homeAmenity = new HomeAmenity();

            homeAmenity.setListing(homeListing);
            homeAmenity.setAmenity(amenity);

            return homeAmenity;
        }).toList();

        homeAmenityRepository.saveAll(homeAmenities);
    }

    private List<ListingImage> createListingImage(HomeListing homeListing, List<ImageOrderDto> imageOrderDtos) {
        if (imageOrderDtos == null || imageOrderDtos.isEmpty()) {
            log.warn("No images provided for listing {}", homeListing.getId());
            return List.of();
        }


        List<ListingImage> listingImages = imageOrderDtos.stream().map(imageDto -> {
            // Image already uploaded to Cloudinary from frontend
            ListingImage listingImage = new ListingImage();
            listingImage.setListing(homeListing);
            listingImage.setImageUrl(imageDto.getImage());
            listingImage.setImagePublicId(imageDto.getPublicId());
            listingImage.setImageOrder(imageDto.getOrder());
            listingImage.setThumbnail(imageDto.getOrder() == 1); // First image is thumbnail

            return listingImage;
        }).toList();

        List<ListingImage> savedImages = listingImageRepository.saveAll(listingImages);
        log.info("Created {} images for listing {}", savedImages.size(), homeListing.getId());
        return savedImages;
    }

    private HomeListingResponse buildHomeListingResponse(HomeListing homeListing,
                                                         CreateHomeListingRequest request,
                                                         List<ListingImage> listingImages,
                                                         User host) {
        Optional<UserProfile> up = userProfileRepository.findByUserId(host.getId());

        if (up.isEmpty()) {
            log.error("User profile not found for user {}", host.getId());
            throw new RuntimeException("User profile not found");
        }

        UserProfile profile = up.get();

        ListingHostDto hostDto = ListingHostDto.builder()
                .hostId(host.getId())
                .hostDisplayName(profile.getDisplayName())
                .avatarUrl(profile.getAvatarUrl())
                .phoneNumber(profile.getPhoneNumber())
                .build();

        // Build facilities list
        List<FacilityQuantityDto> facilityDtos = request.getFacilityRequests().stream()
                .map(facilityRequest -> {
                    FacilityQuantityDto dto = new FacilityQuantityDto();
                    dto.setFacilityId(facilityRequest.getFacilityId());
                    dto.setQuantity(facilityRequest.getQuantity());
                    return dto;
                })
                .toList();

        // Build images list
        List<ImageOrderResponse> imageResponses = listingImages.stream()
                .map(listingImage -> ImageOrderResponse.builder()
                        .image(CloudinaryResponse.builder()
                                .url(listingImage.getImageUrl())
                                .publicId(listingImage.getImagePublicId())
                                .build())
                        .order(listingImage.getImageOrder())
                        .build())
                .toList();

        return HomeListingResponse.builder()
                .listingId(homeListing.getId())
                .host(hostDto)
                .title(homeListing.getTitle())
                .price(homeListing.getBasePrice())
                .description(homeListing.getDescription())
                .capacity(homeListing.getCapacity())
                .address(homeListing.getAddress())
                .latitude(homeListing.getLatitude())
                .longitude(homeListing.getLongitude())
                .propertyTypeId(homeListing.getPropertyType().getId())
                .amenityIds(request.getAmenityIds())
                .facilities(facilityDtos)
                .images(imageResponses)
                .build();
    }

    private List<Facility> validateFacilities(List<HomeFacilityRequest> requests) {
        List<UUID> facilitiesIds = requests.stream()
                .map(HomeFacilityRequest::getFacilityId)
                .toList();

        List<Facility> facilities = facilityRepository.findAllById(facilitiesIds);

        if (facilities.size() != facilitiesIds.size()) {
            log.error("Not all facilities found with ids {}", facilitiesIds);
            throw new RuntimeException("Not all facilities found");
        }

        return facilities;
    }

    private List<Amenity> validateAmenities(List<UUID> amenityIds) {
        List<Amenity> amenities = amenityRepository.findAllById(amenityIds);

        if (amenities.size() != amenityIds.size()) {
            log.error("Not all amenities found with ids {}", amenityIds);
            throw new RuntimeException("Not all amenities found");
        }

        return amenities;
    }

    private HomeListingResponse convertToResponse(HomeListing homeListing) {
        // Get host information
        User host = homeListing.getHost();
        UserProfile profile = userProfileRepository.findByUserId(host.getId())
                .orElseThrow(() -> {
                    log.error("User profile not found for user {}", host.getId());
                    return new RuntimeException("User profile not found");
                });

        ListingHostDto hostDto = ListingHostDto.builder()
                .hostId(host.getId())
                .hostDisplayName(profile.getDisplayName())
                .avatarUrl(profile.getAvatarUrl())
                .phoneNumber(profile.getPhoneNumber())
                .build();

        // Get facilities
        List<HomeFacility> homeFacilities = homeFacilityRepository.findByListingId(homeListing.getId());
        List<FacilityQuantityDto> facilityDtos = homeFacilities.stream()
                .map(hf -> {
                    FacilityQuantityDto dto = new FacilityQuantityDto();
                    dto.setFacilityId(hf.getFacility().getId());
                    dto.setQuantity(hf.getQuantity());
                    return dto;
                })
                .toList();

        // Get amenities
        List<HomeAmenity> homeAmenities = homeAmenityRepository.findByListingId(homeListing.getId());
        List<UUID> amenityIds = homeAmenities.stream()
                .map(ha -> ha.getAmenity().getId())
                .toList();

        // Get images
        List<ListingImage> listingImages = listingImageRepository.findByListingIdOrderByImageOrderAsc(homeListing.getId());
        List<ImageOrderResponse> imageResponses = listingImages.stream()
                .map(listingImage -> ImageOrderResponse.builder()
                        .image(CloudinaryResponse.builder()
                                .url(listingImage.getImageUrl())
                                .publicId(listingImage.getImagePublicId())
                                .build())
                        .order(listingImage.getImageOrder())
                        .build())
                .toList();

        return HomeListingResponse.builder()
                .listingId(homeListing.getId())
                .host(hostDto)
                .title(homeListing.getTitle())
                .price(homeListing.getBasePrice())
                .description(homeListing.getDescription())
                .capacity(homeListing.getCapacity())
                .address(homeListing.getAddress())
                .latitude(homeListing.getLatitude())
                .longitude(homeListing.getLongitude())
                .propertyTypeId(homeListing.getPropertyType().getId())
                .amenityIds(amenityIds)
                .facilities(facilityDtos)
                .images(imageResponses)
                .build();
    }
    
    @Override
    public List<ListingSearchResult<HomeListingResponse>> searchByLocation(LocationSearchRequest request) {
        // Get bounding box for initial filtering
        double[] bbox = GeoUtils.getBoundingBox(
                request.getLatitude(), 
                request.getLongitude(), 
                request.getRadiusKm()
        );
        
        // Parse optional filters
        BigDecimal minPrice = request.getMinPrice() != null ? BigDecimal.valueOf(request.getMinPrice()) : null;
        BigDecimal maxPrice = request.getMaxPrice() != null ? BigDecimal.valueOf(request.getMaxPrice()) : null;
        UUID propertyTypeId = request.getPropertyTypeId() != null ? UUID.fromString(request.getPropertyTypeId()) : null;
        
        // Query with bounding box and filters
        List<HomeListing> listings = homeListingRepository.findByLocationWithFilters(
                bbox[0], bbox[1], bbox[2], bbox[3],
                minPrice, maxPrice,
                request.getMinCapacity(),
                propertyTypeId
        );
        
        // Calculate precise distance and filter by actual radius
        List<ListingSearchResult<HomeListingResponse>> results = new java.util.ArrayList<>();
        for (HomeListing listing : listings) {
            double distance = GeoUtils.calculateDistance(
                    request.getLatitude(), request.getLongitude(),
                    listing.getLatitude(), listing.getLongitude()
            );
            if (distance <= request.getRadiusKm()) {
                results.add(ListingSearchResult.<HomeListingResponse>builder()
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
    public Page<HomeListingResponse> getAllHomeListingsPaginated(Pageable pageable) {
        log.info("Fetching paginated home listings");
        Page<HomeListing> homeListings = homeListingRepository.findAll(pageable);
        return homeListings.map(this::convertToResponse);
    }
    
    @Override
    @Transactional
    public void deleteHomeListing(UUID id) {
        log.info("Deleting home listing with id {}", id);
        
        HomeListing homeListing = homeListingRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Home listing not found with id {}", id);
                    return new ResourceNotFoundException("Home listing not found");
                });
        
        // Delete related data first (cascade delete)
        homeBookingRepository.deleteByHomeListingId(id);
        reviewRepository.deleteByListingId(id);
        homeFacilityRepository.deleteByListingId(id);
        homeAmenityRepository.deleteByListingId(id);
        listingImageRepository.deleteByListingId(id);
        
        // Delete the listing (soft delete via @SQLRestriction)
        homeListingRepository.delete(homeListing);
        
        log.info("Successfully deleted home listing with id {}", id);
    }
}

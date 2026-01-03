package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateHomeListingRequest;
import octguy.livanabe.dto.request.LocationSearchRequest;
import octguy.livanabe.dto.request.UpdateHomeListingRequest;
import octguy.livanabe.dto.response.HomeListingResponse;
import octguy.livanabe.dto.response.ListingSearchResult;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IHomeListingService {

    HomeListingResponse createHomeListing(CreateHomeListingRequest request);

    HomeListingResponse updateHomeListing(UUID id, UpdateHomeListingRequest request);

    List<HomeListingResponse> getAllHomeListings();
    
    Page<HomeListingResponse> getAllHomeListingsPaginated(Pageable pageable);

    HomeListingResponse getHomeListingById(UUID id);

    List<HomeListingResponse> getHomeListingsByHostId(UUID hostId);
    
    List<ListingSearchResult<HomeListingResponse>> searchByLocation(LocationSearchRequest request);
    
    void deleteHomeListing(UUID id);
}

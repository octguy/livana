package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateHomeListingRequest;
import octguy.livanabe.dto.response.HomeListingResponse;

import java.util.List;
import java.util.UUID;

public interface IHomeListingService {

    HomeListingResponse createHomeListing(CreateHomeListingRequest request);

    List<HomeListingResponse> getAllHomeListings();

    HomeListingResponse getHomeListingById(UUID id);

    List<HomeListingResponse> getHomeListingsByHostId(UUID hostId);
}

package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateHomeListingRequest;
import octguy.livanabe.dto.response.HomeListingResponse;

public interface IHomeListingService {

    HomeListingResponse createHomeListing(CreateHomeListingRequest request);
}

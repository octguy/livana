package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateExperienceListingRequest;
import octguy.livanabe.dto.request.LocationSearchRequest;
import octguy.livanabe.dto.request.UpdateExperienceListingRequest;
import octguy.livanabe.dto.response.ExperienceListingResponse;
import octguy.livanabe.dto.response.ListingSearchResult;

import java.util.List;
import java.util.UUID;

public interface IExperienceListingService {

    ExperienceListingResponse createExperienceListing(CreateExperienceListingRequest request);

    ExperienceListingResponse updateExperienceListing(UUID id, UpdateExperienceListingRequest request);
    
    List<ExperienceListingResponse> getAllExperienceListings();
    
    ExperienceListingResponse getExperienceListingById(UUID id);
    
    List<ExperienceListingResponse> getExperienceListingsByHostId(UUID hostId);
    
    List<ListingSearchResult<ExperienceListingResponse>> searchByLocation(LocationSearchRequest request);
}

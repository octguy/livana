package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateExperienceListingRequest;
import octguy.livanabe.dto.response.ExperienceListingResponse;

public interface IExperienceListingService {

    ExperienceListingResponse createExperienceListing(CreateExperienceListingRequest request);
}

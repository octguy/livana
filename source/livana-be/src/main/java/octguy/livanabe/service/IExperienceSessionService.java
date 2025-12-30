package octguy.livanabe.service;

import octguy.livanabe.dto.request.BulkCreateSessionRequest;
import octguy.livanabe.dto.response.BulkCreateSessionResponse;

import java.util.UUID;

public interface IExperienceSessionService {

    BulkCreateSessionResponse createSessions(UUID experienceListingId, BulkCreateSessionRequest request);
}

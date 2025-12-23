package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateInterestRequest;
import octguy.livanabe.dto.request.SetInterestRequest;
import octguy.livanabe.dto.response.InterestResponse;
import octguy.livanabe.dto.response.UserInterestsResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface IInterestService {

    Page<InterestResponse> findAll(int page, int size);

    List<InterestResponse> findAll();

    InterestResponse create(CreateInterestRequest request);

    InterestResponse update(UUID id, String name, String icon);

    void softDelete(UUID id);

    void hardDelete(UUID id);

    void softDeleteAll();

    void hardDeleteAll();

    UserInterestsResponse setUserInterests(SetInterestRequest request);

    UserInterestsResponse getUserInterests();
}

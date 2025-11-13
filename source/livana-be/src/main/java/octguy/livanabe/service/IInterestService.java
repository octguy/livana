package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateInterestRequest;
import octguy.livanabe.dto.request.SetInterestRequest;
import octguy.livanabe.dto.response.InterestResponse;
import octguy.livanabe.dto.response.UserInterestsResponse;

import java.util.List;

public interface IInterestService {

    List<InterestResponse> findAll();

    InterestResponse create(CreateInterestRequest request);

    UserInterestsResponse setUserInterests(SetInterestRequest request);
}

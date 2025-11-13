package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateInterestRequest;
import octguy.livanabe.dto.response.InterestResponse;
import org.hibernate.validator.constraints.UUID;

import java.util.List;

public interface IInterestService {

    List<InterestResponse> findAll();

    InterestResponse create(CreateInterestRequest request);
}

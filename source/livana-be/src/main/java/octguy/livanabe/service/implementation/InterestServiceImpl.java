package octguy.livanabe.service.implementation;

import octguy.livanabe.dto.request.CreateInterestRequest;
import octguy.livanabe.dto.response.InterestResponse;
import octguy.livanabe.entity.Interest;
import octguy.livanabe.repository.InterestRepository;
import octguy.livanabe.service.IInterestService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterestServiceImpl implements IInterestService {

    private final InterestRepository interestRepository;

    public InterestServiceImpl(InterestRepository interestRepository) {
        this.interestRepository = interestRepository;
    }

    @Override
    public List<InterestResponse> findAll() {
        return interestRepository.findAll().stream()
                        .map(interest -> InterestResponse.builder()
                                .id(interest.getId())
                                .key(interest.getKey())
                                .name(interest.getName())
                                .icon(interest.getIcon())
                                .build())
                                .toList();
    }

    @Override
    public InterestResponse create(CreateInterestRequest request) {
        Interest interest = new Interest();

        interest.setName(request.getName());
        interest.setKey(convertNameToKey(request.getName()));
        interest.setIcon(request.getIcon());

        interestRepository.save(interest);

        return InterestResponse.builder().
                id(interest.getId()).
                key(interest.getKey()).
                name(interest.getName()).
                icon(interest.getIcon()).
                build();
    }

    private String convertNameToKey(String input) {
        if (input == null || input.isEmpty()) {
            return null;
        }

        // Hello World -> HELLO_WORLD
        return input.trim()
                .replaceAll("\\s+", "_")
                .toUpperCase();
    }
}

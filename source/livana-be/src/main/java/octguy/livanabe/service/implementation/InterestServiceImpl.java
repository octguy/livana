package octguy.livanabe.service.implementation;

import octguy.livanabe.dto.request.CreateInterestRequest;
import octguy.livanabe.dto.request.SetInterestRequest;
import octguy.livanabe.dto.response.InterestResponse;
import octguy.livanabe.dto.response.UserInterestsResponse;
import octguy.livanabe.entity.Interest;
import octguy.livanabe.entity.User;
import octguy.livanabe.entity.UserInterest;
import octguy.livanabe.repository.InterestRepository;
import octguy.livanabe.repository.UserRepository;
import octguy.livanabe.service.IInterestService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InterestServiceImpl implements IInterestService {

    private final InterestRepository interestRepository;

    private final UserRepository userRepository;

    public InterestServiceImpl(InterestRepository interestRepository, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.interestRepository = interestRepository;
    }

    @Override
    public Page<InterestResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        return interestRepository.findAll(pageable)
                .map(interest -> InterestResponse.builder()
                        .id(interest.getId())
                        .key(interest.getKey())
                        .name(interest.getName())
                        .icon(interest.getIcon())
                        .build());
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
    @Transactional
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
                icon(interest.getIcon())
                .build();
    }

    @Override
    @Transactional
    public InterestResponse update(UUID id, String name, String icon) {
        Optional<Interest> opt = interestRepository.findById(id);
        
        if (opt.isEmpty()) return null;
        
        Interest interest = opt.get();
        interest.setName(name);
        interest.setKey(convertNameToKey(name));
        interest.setIcon(icon);
        interest.setUpdatedAt(LocalDateTime.now());
        interestRepository.save(interest);
        
        return InterestResponse.builder()
                .id(interest.getId())
                .key(interest.getKey())
                .name(interest.getName())
                .icon(interest.getIcon())
                .build();
    }

    @Override
    @Transactional
    public void softDelete(UUID id) {
        Optional<Interest> opt = interestRepository.findById(id);
        if (opt.isPresent()) {
            Interest interest = opt.get();
            interest.setDeletedAt(LocalDateTime.now());
            interestRepository.save(interest);
        }
    }

    @Override
    @Transactional
    public void hardDelete(UUID id) {
        interestRepository.hardDeleteById(id);
    }

    @Override
    @Transactional
    public void softDeleteAll() {
        List<Interest> interests = interestRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        interests.forEach(interest -> interest.setDeletedAt(now));
        interestRepository.saveAll(interests);
    }

    @Override
    @Transactional
    public void hardDeleteAll() {
        interestRepository.hardDeleteAll();
    }

    @Override
    @Transactional
    public UserInterestsResponse setUserInterests(SetInterestRequest request) {
        List<Interest> interests = interestRepository.findAllById(request.getInterestIds());
        User user = SecurityUtils.getCurrentUser();
        user.setInterests(new HashSet<>(interests));
        userRepository.save(user);

        return UserInterestsResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .interests(interests.stream()
                        .map(interest -> InterestResponse.builder()
                                .id(interest.getId())
                                .key(interest.getKey())
                                .name(interest.getName())
                                .icon(interest.getIcon())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    @Override
    public UserInterestsResponse getUserInterests() {
        User user = SecurityUtils.getCurrentUser();

        List<Interest> interests = user.getUserInterests().stream()
                .map(UserInterest::getInterest)
                .toList();

        return UserInterestsResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .interests(interests.stream()
                        .map(interest -> InterestResponse.builder()
                                .id(interest.getId())
                                .key(interest.getKey())
                                .name(interest.getName())
                                .icon(interest.getIcon())
                                .build())
                        .collect(Collectors.toList()))
                .build();
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

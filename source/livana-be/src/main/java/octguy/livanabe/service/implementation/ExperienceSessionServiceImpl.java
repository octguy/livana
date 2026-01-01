package octguy.livanabe.service.implementation;

import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.dto.request.BulkCreateSessionRequest;
import octguy.livanabe.dto.request.CreateSessionRequest;
import octguy.livanabe.dto.response.BulkCreateSessionResponse;
import octguy.livanabe.dto.response.SessionResponse;
import octguy.livanabe.entity.ExperienceListing;
import octguy.livanabe.entity.ExperienceSession;
import octguy.livanabe.enums.SessionStatus;
import octguy.livanabe.repository.ExperienceListingRepository;
import octguy.livanabe.repository.ExperienceSessionRepository;
import octguy.livanabe.service.IExperienceSessionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static java.time.Duration.between;

@Service
@Slf4j
public class ExperienceSessionServiceImpl implements IExperienceSessionService {

    private final ExperienceSessionRepository experienceSessionRepository;
    private final ExperienceListingRepository experienceListingRepository;

    public ExperienceSessionServiceImpl(ExperienceSessionRepository experienceSessionRepository,
                                        ExperienceListingRepository experienceListingRepository) {
        this.experienceSessionRepository = experienceSessionRepository;
        this.experienceListingRepository = experienceListingRepository;
    }

    @Override
    @Transactional
    public BulkCreateSessionResponse createSessions(UUID experienceListingId, BulkCreateSessionRequest request) {
        log.info("Creating sessions for experience listing: {}", experienceListingId);

        // Validate experience listing exists
        ExperienceListing experienceListing = experienceListingRepository.findById(experienceListingId)
                .orElseThrow(() -> {
                    log.error("Experience listing not found with id: {}", experienceListingId);
                    return new RuntimeException("Experience listing not found");
                });

        // Validate all session requests
        validateSessionRequests(request.getSessions());

        // Create sessions
        List<ExperienceSession> sessions = request.getSessions().stream()
                .map(sessionRequest -> createSession(experienceListing, sessionRequest))
                .toList();

        List<ExperienceSession> savedSessions = experienceSessionRepository.saveAll(sessions);
        log.info("Created {} sessions for experience listing: {}", savedSessions.size(), experienceListingId);

        // Build response
        List<SessionResponse> sessionResponses = savedSessions.stream()
                .map(this::buildSessionResponse)
                .toList();

        return BulkCreateSessionResponse.builder()
                .experienceId(experienceListingId)
                .totalCreated(savedSessions.size())
                .sessions(sessionResponses)
                .build();
    }

    private void validateSessionRequests(List<CreateSessionRequest> sessions) {
        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < sessions.size(); i++) {
            CreateSessionRequest session = sessions.get(i);
            
            // Validate start time is not in the past
            if (session.getStartTime().isBefore(now)) {
                log.error("Session {} start time {} is in the past", i, session.getStartTime());
                throw new RuntimeException("Session start time cannot be in the past");
            }

            // Validate end time is after start time
            if (!session.getEndTime().isAfter(session.getStartTime())) {
                log.error("Session {} end time {} is not after start time {}", i, session.getEndTime(), session.getStartTime());
                throw new RuntimeException("Session end time must be after start time");
            }

            // Validate session duration is reasonable (at least 30 minutes, max 12 hours)
            long durationMinutes = between(session.getStartTime(), session.getEndTime()).toMinutes();
            if (durationMinutes < 30) {
                log.error("Session {} duration {} minutes is too short", i, durationMinutes);
                throw new RuntimeException("Session duration must be at least 30 minutes");
            }
            if (durationMinutes > 720) { // 12 hours
                log.error("Session {} duration {} minutes is too long", i, durationMinutes);
                throw new RuntimeException("Session duration cannot exceed 12 hours");
            }

            // Check for overlapping sessions in the same request
            for (int j = i + 1; j < sessions.size(); j++) {
                CreateSessionRequest otherSession = sessions.get(j);
                if (isOverlapping(session, otherSession)) {
                    log.error("Sessions {} and {} overlap", i, j);
                    throw new RuntimeException("Sessions cannot overlap with each other");
                }
            }
        }
    }

    private boolean isOverlapping(CreateSessionRequest session1, CreateSessionRequest session2) {
        return session1.getStartTime().isBefore(session2.getEndTime()) 
                && session2.getStartTime().isBefore(session1.getEndTime());
    }

    private ExperienceSession createSession(ExperienceListing experienceListing, CreateSessionRequest request) {
        // Validate capacity
        if (experienceListing.getCapacity() <= 0) {
            log.error("Experience listing {} has invalid capacity: {}", 
                    experienceListing.getId(), experienceListing.getCapacity());
            throw new RuntimeException("Experience listing must have a valid capacity");
        }

        ExperienceSession session = new ExperienceSession();
        session.setExperienceListing(experienceListing);
        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());
        session.setBookedParticipants(0);
        session.setSessionStatus(SessionStatus.ACTIVE);
        return session;
    }

    private SessionResponse buildSessionResponse(ExperienceSession session) {
        int capacity = session.getExperienceListing().getCapacity();
        int bookedParticipants = session.getBookedParticipants();
        
        // Validate booked participants doesn't exceed capacity
        if (bookedParticipants > capacity) {
            log.warn("Session {} has more booked participants ({}) than capacity ({})", 
                    session.getId(), bookedParticipants, capacity);
        }

        int availableSlots = Math.max(0, capacity - bookedParticipants);

        return SessionResponse.builder()
                .id(session.getId())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .capacity(capacity)
                .bookedCount(bookedParticipants)
                .availableSlots(availableSlots)
                .status(session.getSessionStatus().toString())
                .build();
    }
}

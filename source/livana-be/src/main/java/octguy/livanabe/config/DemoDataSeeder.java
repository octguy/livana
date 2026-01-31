package octguy.livanabe.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.entity.*;
import octguy.livanabe.entity.composite_key.RoleUserId;
import octguy.livanabe.entity.composite_key.UserInterestId;
import octguy.livanabe.enums.*;
import octguy.livanabe.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
@Order(2)
public class DemoDataSeeder implements CommandLineRunner {

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    private static final int TARGET_USERS = 50;
    private static final int HOST_USERS = 20;
    private static final int HOME_LISTINGS_PER_HOST = 3;
    private static final int EXPERIENCE_LISTINGS_PER_HOST = 2;
    private static final int SESSIONS_PER_EXPERIENCE = 5;
    private static final int BOOKINGS_PER_USER = 3;
    private static final int REVIEWS_PER_USER = 5;
    private static final int CONVERSATIONS_PER_USER = 4;
    private static final int MESSAGES_PER_CONVERSATION = 15;
    private static final String DEFAULT_PASSWORD = "Password123!";

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final AuthCredentialRepository authCredentialRepository;
    private final RoleRepository roleRepository;
    private final RoleUserRepository roleUserRepository;
    private final PropertyTypeRepository propertyTypeRepository;
    private final ExperienceCategoryRepository experienceCategoryRepository;
    private final AmenityRepository amenityRepository;
    private final FacilityRepository facilityRepository;
    private final InterestRepository interestRepository;
    private final UserInterestRepository userInterestRepository;
    private final HomeListingRepository homeListingRepository;
    private final ExperienceListingRepository experienceListingRepository;
    private final ListingImageRepository listingImageRepository;
    private final HomeAmenityRepository homeAmenityRepository;
    private final HomeFacilityRepository homeFacilityRepository;
    private final ExperienceSessionRepository experienceSessionRepository;
    private final HomeBookingRepository homeBookingRepository;
    private final ExperienceBookingRepository experienceBookingRepository;
    private final ReviewRepository reviewRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) {
            log.info("DemoDataSeeder disabled (app.seed.enabled=false)");
            return;
        }

        if (userRepository.count() >= TARGET_USERS) {
            log.info("DemoDataSeeder skipped because existing users >= {}", TARGET_USERS);
            return;
        }

        log.info("Starting demo data seeding...");

        Role userRole = roleRepository.findByName(UserRole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

        List<PropertyType> propertyTypes = propertyTypeRepository.findAll();
        List<ExperienceCategory> categories = experienceCategoryRepository.findAll();
        List<Amenity> amenities = amenityRepository.findAll();
        List<Facility> facilities = facilityRepository.findAll();
        List<Interest> interests = interestRepository.findAll();

        List<User> users = seedUsers(userRole, interests);
        Map<UUID, UserProfile> profileByUser = seedProfiles(users);

        List<User> hosts = users.subList(0, Math.min(HOST_USERS, users.size()));
        List<User> customers = users.subList(HOST_USERS, users.size());

        List<HomeListing> homeListings = seedHomeListings(hosts, propertyTypes, amenities, facilities);
        List<ExperienceListing> experienceListings = seedExperienceListings(hosts, categories);
        Map<UUID, List<ExperienceSession>> sessionsByListing = seedExperienceSessions(experienceListings);

        List<HomeBooking> homeBookings = seedHomeBookings(customers, homeListings, hosts);
        List<ExperienceBooking> experienceBookings = seedExperienceBookings(customers, sessionsByListing);

        seedReviews(customers, homeListings, experienceListings);
        seedConversations(users);
        seedNotifications(users, homeBookings, experienceBookings);

        logSampleCredentials(users, hosts);
        log.info("Demo data seeding finished.");
    }

    private List<User> seedUsers(Role userRole, List<Interest> interests) {
        List<User> users = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // First, create and save users (User requires manual ID assignment)
        for (int i = 1; i <= TARGET_USERS; i++) {
            User user = new User();
            user.setId(UUID.randomUUID()); // User requires manual ID
            user.setUsername("user" + String.format("%03d", i));
            user.setEmail("user" + String.format("%03d", i) + "@livana.com");
            user.setEnabled(true); // Auto-verify demo users
            user.setStatus(UserStatus.ACTIVE); // Auto-verify demo users
            user.setLastLoginAt(now.minusDays(random.nextInt(30)));
            users.add(user);
        }

        // Save users first to generate IDs
        userRepository.saveAll(users);
        userRepository.flush(); // Ensure users are persisted before using them

        // Now create related entities using generated IDs
        List<AuthCredential> credentials = new ArrayList<>();
        List<RoleUser> roleUsers = new ArrayList<>();
        List<UserInterest> userInterests = new ArrayList<>();

        for (User user : users) {
            // Create auth credential for user
            AuthCredential credential = new AuthCredential();
            credential.setId(UUID.randomUUID()); // AuthCredential requires manual ID
            credential.setUser(user);
            credential.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
            credentials.add(credential);

            // Create role assignment
            RoleUser roleUser = new RoleUser();
            RoleUserId roleUserId = new RoleUserId();
            roleUserId.setUserId(user.getId());
            roleUserId.setRoleId(userRole.getId());
            roleUser.setRoleUserId(roleUserId);
            roleUser.setUser(user);
            roleUser.setRole(userRole);
            roleUsers.add(roleUser);

            // Assign 2-5 random interests to each user
            int interestCount = 2 + random.nextInt(4);
            Set<Interest> chosenInterests = pickRandom(interests, interestCount);
            for (Interest interest : chosenInterests) {
                UserInterest userInterest = new UserInterest();
                UserInterestId userInterestId = new UserInterestId();
                userInterestId.setUserId(user.getId());
                userInterestId.setInterestId(interest.getId());
                userInterest.setUserInterestId(userInterestId);
                userInterest.setUser(user);
                userInterest.setInterest(interest);
                userInterests.add(userInterest);
            }
        }

        authCredentialRepository.saveAll(credentials);
        roleUserRepository.saveAll(roleUsers);
        userInterestRepository.saveAll(userInterests);
        log.info("Seeded {} users with credentials", users.size());
        return users;
    }

    private Map<UUID, UserProfile> seedProfiles(List<User> users) {
        List<UserProfile> profiles = new ArrayList<>();

        for (User user : users) {
            UserProfile profile = new UserProfile();
            profile.setId(UUID.randomUUID()); // UserProfile requires manual ID
            profile.setUser(user);
            profile.setDisplayName(generateDisplayName(user.getUsername()));
            profile.setPhoneNumber(generatePhoneNumber());
            profile.setBio(generateBio());
            profile.setAvatarUrl("https://i.pravatar.cc/150?img=" + random.nextInt(70));
            profiles.add(profile);
        }

        userProfileRepository.saveAll(profiles);
        return profiles.stream().collect(Collectors.toMap(p -> p.getUser().getId(), p -> p));
    }

    private List<HomeListing> seedHomeListings(List<User> hosts, List<PropertyType> propertyTypes,
                                                List<Amenity> amenities, List<Facility> facilities) {
        List<HomeListing> listings = new ArrayList<>();

        // First, create and save listings to get generated IDs
        for (User host : hosts) {
            for (int i = 0; i < HOME_LISTINGS_PER_HOST; i++) {
                HomeListing listing = new HomeListing();
                listing.setHost(host);
                listing.setPropertyType(pickRandom(propertyTypes, 1).iterator().next());
                listing.setTitle(generateHomeTitle());
                listing.setDescription(generateHomeDescription());

                Location location = generateVietnamLocation();
                listing.setAddress(location.address);
                listing.setLatitude(location.latitude);
                listing.setLongitude(location.longitude);

                listing.setCapacity(2 + random.nextInt(6));
                listing.setBasePrice(BigDecimal.valueOf(30 + random.nextInt(170)));
                listing.setIsAvailable(true);
                listings.add(listing);
            }
        }

        // Save listings first to generate IDs
        homeListingRepository.saveAll(listings);
        homeListingRepository.flush(); // Ensure listings are persisted before using them

        // Now create related entities using generated IDs
        List<ListingImage> images = new ArrayList<>();
        List<HomeAmenity> homeAmenities = new ArrayList<>();
        List<HomeFacility> homeFacilities = new ArrayList<>();

        for (HomeListing listing : listings) {
            // Add 3-5 images
            int imageCount = 3 + random.nextInt(3);
            for (int j = 0; j < imageCount; j++) {
                ListingImage image = new ListingImage();
                image.setListing(listing);
                image.setImageUrl("https://picsum.photos/seed/home" + listing.getId() + "-" + j + "/800/600");
                image.setImagePublicId("demo/home/" + listing.getId() + "/" + j);
                image.setThumbnail(j == 0);
                image.setImageOrder(j);
                images.add(image);
            }

            // Add 4-8 amenities
            int amenityCount = 4 + random.nextInt(5);
            Set<Amenity> chosenAmenities = pickRandom(amenities, amenityCount);
            for (Amenity amenity : chosenAmenities) {
                HomeAmenity homeAmenity = new HomeAmenity();
                homeAmenity.setListing(listing);
                homeAmenity.setAmenity(amenity);
                homeAmenity.setDescription("Available");
                homeAmenities.add(homeAmenity);
            }

            // Add 2-4 facilities
            int facilityCount = 2 + random.nextInt(3);
            Set<Facility> chosenFacilities = pickRandom(facilities, facilityCount);
            for (Facility facility : chosenFacilities) {
                HomeFacility homeFacility = new HomeFacility();
                homeFacility.setListing(listing);
                homeFacility.setFacility(facility);
                homeFacility.setQuantity(facility.getName().toLowerCase().contains("bed") ?
                                        (1 + random.nextInt(3)) : 1);
                homeFacilities.add(homeFacility);
            }
        }

        listingImageRepository.saveAll(images);
        homeAmenityRepository.saveAll(homeAmenities);
        homeFacilityRepository.saveAll(homeFacilities);
        log.info("Seeded {} home listings", listings.size());
        return listings;
    }

    private List<ExperienceListing> seedExperienceListings(List<User> hosts, List<ExperienceCategory> categories) {
        List<ExperienceListing> listings = new ArrayList<>();

        // First, create and save listings to get generated IDs
        for (User host : hosts) {
            for (int i = 0; i < EXPERIENCE_LISTINGS_PER_HOST; i++) {
                ExperienceListing listing = new ExperienceListing();
                listing.setHost(host);
                listing.setExperienceCategory(pickRandom(categories, 1).iterator().next());
                listing.setTitle(generateExperienceTitle());
                listing.setDescription(generateExperienceDescription());

                Location location = generateVietnamLocation();
                listing.setAddress(location.address);
                listing.setLatitude(location.latitude);
                listing.setLongitude(location.longitude);

                listing.setCapacity(5 + random.nextInt(15));
                listing.setBasePrice(BigDecimal.valueOf(20 + random.nextInt(80)));
                listing.setIsAvailable(true);
                listings.add(listing);
            }
        }

        // Save listings first to generate IDs
        experienceListingRepository.saveAll(listings);
        experienceListingRepository.flush(); // Ensure listings are persisted before using them

        // Now create images using generated IDs
        List<ListingImage> images = new ArrayList<>();
        for (ExperienceListing listing : listings) {
            int imageCount = 2 + random.nextInt(3);
            for (int j = 0; j < imageCount; j++) {
                ListingImage image = new ListingImage();
                image.setListing(listing);
                image.setImageUrl("https://picsum.photos/seed/exp" + listing.getId() + "-" + j + "/800/600");
                image.setImagePublicId("demo/experience/" + listing.getId() + "/" + j);
                image.setThumbnail(j == 0);
                image.setImageOrder(j);
                images.add(image);
            }
        }

        listingImageRepository.saveAll(images);
        log.info("Seeded {} experience listings", listings.size());
        return listings;
    }

    private Map<UUID, List<ExperienceSession>> seedExperienceSessions(List<ExperienceListing> listings) {
        Map<UUID, List<ExperienceSession>> sessionsByListing = new HashMap<>();
        List<ExperienceSession> allSessions = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (ExperienceListing listing : listings) {
            List<ExperienceSession> sessions = new ArrayList<>();

            for (int i = 0; i < SESSIONS_PER_EXPERIENCE; i++) {
                ExperienceSession session = new ExperienceSession();
                session.setExperienceListing(listing);

                LocalDateTime startTime = now.plusDays(i * 2 + 1).withHour(9 + random.nextInt(8)).withMinute(0);
                session.setStartTime(startTime);
                session.setEndTime(startTime.plusHours(2 + random.nextInt(3)));

                session.setBookedParticipants(0);
                session.setSessionStatus(SessionStatus.ACTIVE);
                sessions.add(session);
                allSessions.add(session);
            }

            sessionsByListing.put(listing.getId(), sessions);
        }

        experienceSessionRepository.saveAll(allSessions);
        log.info("Seeded {} experience sessions", allSessions.size());
        return sessionsByListing;
    }

    private List<HomeBooking> seedHomeBookings(List<User> customers, List<HomeListing> listings, List<User> hosts) {
        List<HomeBooking> bookings = new ArrayList<>();
        List<Payment> payments = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (User customer : customers) {
            int bookingCount = Math.min(BOOKINGS_PER_USER, listings.size());
            Set<HomeListing> bookedListings = new HashSet<>();

            for (int i = 0; i < bookingCount; i++) {
                HomeListing listing = listings.get(random.nextInt(listings.size()));
                if (bookedListings.contains(listing)) continue;
                bookedListings.add(listing);

                HomeBooking booking = new HomeBooking();
                booking.setCustomer(customer);
                booking.setHomeListing(listing);

                LocalDateTime checkIn = now.plusDays(10 + random.nextInt(50));
                booking.setCheckInTime(checkIn);
                booking.setCheckOutTime(checkIn.plusDays(2 + random.nextInt(5)));

                booking.setGuests(1 + random.nextInt(listing.getCapacity()));

                int nights = (int) java.time.Duration.between(booking.getCheckInTime(),
                                                             booking.getCheckOutTime()).toDays();
                booking.setTotalPrice(booking.getHomeListing().getBasePrice().multiply(BigDecimal.valueOf(nights)));

                BookingStatus status = random.nextDouble() < 0.7 ? BookingStatus.CONFIRMED :
                                      (random.nextDouble() < 0.5 ? BookingStatus.PENDING : BookingStatus.CANCELLED);
                booking.setStatus(status);
                booking.setIsPaid(status == BookingStatus.CONFIRMED);
                bookings.add(booking);

                // Create payment if confirmed
                if (status == BookingStatus.CONFIRMED) {
                    Payment payment = new Payment();
                    payment.setBooking(booking);
                    payment.setUser(customer);
                    payment.setAmount(booking.getTotalPrice());
                    payment.setPaymentMethod(PaymentMethod.VNPAY);
                    payment.setStatus(PaymentStatus.SUCCESS);
                    payment.setTransactionId("TXN" + UUID.randomUUID().toString().substring(0, 8));
                    payment.setVnpayTransactionNo("VNP" + System.currentTimeMillis());
                    payment.setBankCode("NCB");
                    payment.setCardType("ATM");
                    payment.setOrderInfo("Payment for booking " + booking.getId());
                    payment.setPaymentTime(now.minusDays(random.nextInt(30)).plusMinutes(5));
                    payment.setResponseCode("00");
                    payments.add(payment);
                }
            }
        }

        homeBookingRepository.saveAll(bookings);
        paymentRepository.saveAll(payments);
        log.info("Seeded {} home bookings", bookings.size());
        return bookings;
    }

    private List<ExperienceBooking> seedExperienceBookings(List<User> customers,
                                                          Map<UUID, List<ExperienceSession>> sessionsByListing) {
        List<ExperienceBooking> bookings = new ArrayList<>();
        List<Payment> payments = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        List<ExperienceSession> allSessions = sessionsByListing.values().stream()
                .flatMap(List::stream)
                .collect(Collectors.toList());

        for (User customer : customers) {
            int bookingCount = Math.min(2, allSessions.size());

            for (int i = 0; i < bookingCount; i++) {
                ExperienceSession session = allSessions.get(random.nextInt(allSessions.size()));

                ExperienceBooking booking = new ExperienceBooking();
                booking.setCustomer(customer);
                booking.setSession(session);
                booking.setQuantity(1 + random.nextInt(3));

                booking.setTotalPrice(session.getExperienceListing().getBasePrice()
                                            .multiply(BigDecimal.valueOf(booking.getQuantity())));

                BookingStatus status = random.nextDouble() < 0.7 ? BookingStatus.CONFIRMED : BookingStatus.PENDING;
                booking.setStatus(status);
                booking.setIsPaid(status == BookingStatus.CONFIRMED);
                bookings.add(booking);

                // Update session booked participants
                session.setBookedParticipants(session.getBookedParticipants() + booking.getQuantity());

                // Create payment if confirmed
                if (status == BookingStatus.CONFIRMED) {
                    Payment payment = new Payment();
                    payment.setBooking(booking);
                    payment.setUser(customer);
                    payment.setAmount(booking.getTotalPrice());
                    payment.setPaymentMethod(PaymentMethod.VNPAY);
                    payment.setStatus(PaymentStatus.SUCCESS);
                    payment.setTransactionId("TXN" + UUID.randomUUID().toString().substring(0, 8));
                    payment.setVnpayTransactionNo("VNP" + System.currentTimeMillis());
                    payment.setBankCode("NCB");
                    payment.setCardType("ATM");
                    payment.setOrderInfo("Payment for experience booking " + booking.getId());
                    payment.setPaymentTime(now.minusDays(random.nextInt(30)).plusMinutes(5));
                    payment.setResponseCode("00");
                    payments.add(payment);
                }
            }
        }

        experienceBookingRepository.saveAll(bookings);
        experienceSessionRepository.saveAll(allSessions);
        paymentRepository.saveAll(payments);
        log.info("Seeded {} experience bookings", bookings.size());
        return bookings;
    }

    private void seedReviews(List<User> customers, List<HomeListing> homeListings,
                           List<ExperienceListing> experienceListings) {
        List<Review> reviews = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        List<BaseListing> allListings = new ArrayList<>();
        allListings.addAll(homeListings);
        allListings.addAll(experienceListings);

        for (User customer : customers) {
            int reviewCount = Math.min(REVIEWS_PER_USER, allListings.size());
            Set<BaseListing> reviewedListings = new HashSet<>();

            for (int i = 0; i < reviewCount; i++) {
                BaseListing listing = allListings.get(random.nextInt(allListings.size()));
                if (reviewedListings.contains(listing)) continue;
                reviewedListings.add(listing);

                Review review = Review.builder()
                        .listing(listing)
                        .reviewer(customer)
                        .rating(3 + random.nextInt(3))
                        .comment(generateReviewComment())
                        .reviewType(listing instanceof HomeListing ?
                                  ReviewType.HOME_LISTING : ReviewType.EXPERIENCE_LISTING)
                        .build();
                reviews.add(review);
            }
        }

        reviewRepository.saveAll(reviews);
        log.info("Seeded {} reviews", reviews.size());
    }

    private void seedConversations(List<User> users) {
        List<Conversation> conversations = new ArrayList<>();
        List<Message> messages = new ArrayList<>();
        Set<String> createdPairs = new HashSet<>();
        LocalDateTime now = LocalDateTime.now();

        for (User user : users) {
            int convCount = Math.min(CONVERSATIONS_PER_USER, users.size() - 1);

            for (int i = 0; i < convCount; i++) {
                User otherUser = users.get(random.nextInt(users.size()));
                if (otherUser.getId().equals(user.getId())) continue;

                String pairKey = user.getId().compareTo(otherUser.getId()) < 0 ?
                               user.getId() + "-" + otherUser.getId() :
                               otherUser.getId() + "-" + user.getId();

                if (createdPairs.contains(pairKey)) continue;
                createdPairs.add(pairKey);

                Conversation conv = Conversation.builder()
                        .user1(user)
                        .user2(otherUser)
                        .build();
                conversations.add(conv);

                // Add messages
                LocalDateTime convStartTime = now.minusDays(random.nextInt(30));
                LocalDateTime lastMessageTime = convStartTime;
                String lastContent = "";

                for (int j = 0; j < MESSAGES_PER_CONVERSATION; j++) {
                    String content = generateChatMessage();
                    Message message = Message.builder()
                            .conversation(conv)
                            .sender(j % 2 == 0 ? user : otherUser)
                            .messageType(MessageType.TEXT)
                            .content(content)
                            .isRead(random.nextBoolean())
                            .build();
                    lastMessageTime = lastMessageTime.plusHours(random.nextInt(24));
                    lastContent = content;
                    messages.add(message);
                }

                // Update conversation with last message info
                conv.setLastMessageContent(lastContent);
                conv.setLastMessageAt(lastMessageTime);
            }
        }

        conversationRepository.saveAll(conversations);
        messageRepository.saveAll(messages);
        log.info("Seeded {} conversations with {} messages", conversations.size(), messages.size());
    }

    private void seedNotifications(List<User> users, List<HomeBooking> homeBookings,
                                  List<ExperienceBooking> experienceBookings) {
        List<Notification> notifications = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // Notifications for home bookings
        for (HomeBooking booking : homeBookings) {
            if (booking.getStatus() == BookingStatus.CONFIRMED) {
                // Notify customer
                Notification customerNotif = Notification.builder()
                        .recipient(booking.getCustomer())
                        .type(NotificationType.BOOKING_CONFIRMED)
                        .title("Booking Confirmed")
                        .message("Your home booking has been confirmed")
                        .referenceId(booking.getId())
                        .isRead(random.nextBoolean())
                        .build();
                notifications.add(customerNotif);

                // Notify host
                Notification hostNotif = Notification.builder()
                        .recipient(booking.getHomeListing().getHost())
                        .type(NotificationType.BOOKING_HOME)
                        .title("New Booking")
                        .message("You have a new booking for " + booking.getHomeListing().getTitle())
                        .referenceId(booking.getId())
                        .isRead(random.nextBoolean())
                        .build();
                notifications.add(hostNotif);
            }
        }

        // Notifications for experience bookings
        for (ExperienceBooking booking : experienceBookings) {
            if (booking.getStatus() == BookingStatus.CONFIRMED) {
                Notification notif = Notification.builder()
                        .recipient(booking.getCustomer())
                        .type(NotificationType.BOOKING_CONFIRMED)
                        .title("Experience Booked")
                        .message("Your experience booking has been confirmed")
                        .referenceId(booking.getId())
                        .isRead(random.nextBoolean())
                        .build();
                notifications.add(notif);
            }
        }

        notificationRepository.saveAll(notifications);
        log.info("Seeded {} notifications", notifications.size());
    }

    private void logSampleCredentials(List<User> users, List<User> hosts) {
        String regularCreds = users.stream()
                .limit(3)
                .map(u -> u.getEmail() + " / " + DEFAULT_PASSWORD)
                .collect(Collectors.joining(" | "));

        String hostCreds = hosts.stream()
                .limit(3)
                .map(u -> u.getEmail() + " / " + DEFAULT_PASSWORD + " (HOST)")
                .collect(Collectors.joining(" | "));

        log.info("Sample login accounts: {}", regularCreds);
        log.info("Sample host accounts: {}", hostCreds);
    }

    // Helper methods for generating sample data

    private <T> Set<T> pickRandom(List<T> list, int count) {
        Set<T> picked = new HashSet<>();
        if (list.isEmpty()) return picked;

        List<T> copy = new ArrayList<>(list);
        Collections.shuffle(copy);

        for (int i = 0; i < Math.min(count, copy.size()); i++) {
            picked.add(copy.get(i));
        }
        return picked;
    }

    private String generateDisplayName(String username) {
        String[] firstNames = {"John", "Jane", "Mike", "Sarah", "Tom", "Emma", "David", "Lisa",
                             "Chris", "Anna", "James", "Mary", "Robert", "Jennifer"};
        String[] lastNames = {"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
                            "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez"};
        return firstNames[random.nextInt(firstNames.length)] + " " +
               lastNames[random.nextInt(lastNames.length)];
    }

    private String generatePhoneNumber() {
        return "+84" + (900000000 + random.nextInt(100000000));
    }

    private String generateBio() {
        String[] bios = {
                "Love traveling and exploring new places!",
                "Adventure seeker and nature lover",
                "Passionate about culture and local experiences",
                "Food enthusiast and travel blogger",
                "Digital nomad exploring the world",
                "Seeking authentic experiences everywhere I go"
        };
        return bios[random.nextInt(bios.length)];
    }

    private String generateHomeTitle() {
        String[] adjectives = {"Cozy", "Spacious", "Modern", "Charming", "Beautiful", "Luxurious",
                             "Peaceful", "Stylish", "Comfortable", "Elegant"};
        String[] types = {"Apartment", "House", "Villa", "Studio", "Loft", "Cottage"};
        String[] features = {"with City View", "near Beach", "in Historic District", "with Pool",
                           "with Garden", "Downtown"};

        return adjectives[random.nextInt(adjectives.length)] + " " +
               types[random.nextInt(types.length)] + " " +
               features[random.nextInt(features.length)];
    }

    private String generateHomeDescription() {
        return "A wonderful place to stay with all modern amenities. Perfect for travelers " +
               "looking for comfort and convenience. The space is well-maintained and offers " +
               "great value for your stay.";
    }

    private String generateExperienceTitle() {
        String[] activities = {"Cooking Class", "City Tour", "Food Tour", "Cultural Workshop",
                             "Adventure Trek", "Art Class", "Music Session", "Yoga Retreat"};
        String[] themes = {"Traditional Vietnamese", "Local Street Food", "Historic Hanoi",
                         "Authentic Saigon", "Rural Village", "Modern Art", "Traditional Music"};

        return themes[random.nextInt(themes.length)] + " " +
               activities[random.nextInt(activities.length)];
    }

    private String generateExperienceDescription() {
        return "Join us for an unforgettable experience that showcases the best of local culture " +
               "and traditions. Perfect for those wanting to dive deep into authentic experiences.";
    }

    private String generateReviewComment() {
        String[] comments = {
                "Amazing experience! Highly recommended.",
                "Great place, very clean and comfortable.",
                "The host was very friendly and helpful.",
                "Exceeded my expectations in every way.",
                "Perfect location and great amenities.",
                "Would definitely book again!",
                "Wonderful stay, everything was perfect.",
                "Good value for money, enjoyed our time here."
        };
        return comments[random.nextInt(comments.length)];
    }

    private String generateChatMessage() {
        String[] messages = {
                "Hi, is this still available?",
                "Thanks for the quick response!",
                "What time is check-in?",
                "Looking forward to staying at your place.",
                "Can I ask about parking?",
                "Great, I'll book it now.",
                "Thank you for the information!",
                "See you soon!"
        };
        return messages[random.nextInt(messages.length)];
    }

    private Location generateVietnamLocation() {
        Location[] locations = {
                new Location("Hanoi Old Quarter, Hoan Kiem, Hanoi", 21.0285, 105.8542),
                new Location("District 1, Ho Chi Minh City", 10.7769, 106.7009),
                new Location("Ancient Town, Hoi An, Quang Nam", 15.8801, 108.3380),
                new Location("Nha Trang Beach, Khanh Hoa", 12.2388, 109.1967),
                new Location("Da Lat City Center, Lam Dong", 11.9404, 108.4583),
                new Location("Ba Dinh District, Hanoi", 21.0245, 105.8412),
                new Location("District 3, Ho Chi Minh City", 10.7860, 106.6834),
                new Location("My Khe Beach, Da Nang", 16.0544, 108.2442),
                new Location("Phu Quoc Island, Kien Giang", 10.2899, 103.9864),
                new Location("Sapa Town, Lao Cai", 22.3364, 103.8438)
        };
        return locations[random.nextInt(locations.length)];
    }

    private static class Location {
        String address;
        Double latitude;
        Double longitude;

        Location(String address, Double latitude, Double longitude) {
            this.address = address;
            this.latitude = latitude;
            this.longitude = longitude;
        }
    }
}

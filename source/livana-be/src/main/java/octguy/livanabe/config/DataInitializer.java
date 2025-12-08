package octguy.livanabe.config;

import octguy.livanabe.dto.request.CreateInterestRequest;
import octguy.livanabe.enums.UserRole;
import octguy.livanabe.service.IExperienceCategoryService;
import octguy.livanabe.service.IInterestService;
import octguy.livanabe.service.IPropertyTypeService;
import octguy.livanabe.service.IRoleService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final IRoleService roleService;

    private final IInterestService interestService;

    private final IPropertyTypeService propertyTypeService;

    private final IExperienceCategoryService experienceCategoryService;

    public DataInitializer(IRoleService roleService,
                           IInterestService interestService,
                           IPropertyTypeService propertyTypeService,
                           IExperienceCategoryService experienceCategoryService) {
        this.propertyTypeService = propertyTypeService;
        this.interestService = interestService;
        this.roleService = roleService;
        this.experienceCategoryService = experienceCategoryService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DataInitializer run method executed.");

        System.out.println("Checking and initializing roles...");
        initializeRoles();

        System.out.println("Checking and initializing interests...");
        initializeInterests();

        System.out.println("Checking and initializing property types...");
        initializePropertyType();

        System.out.println("Checking and initializing experience categories...");
        initializeExperienceCategories();
    }

    private void initializeRoles() {
        if (roleService.findAll().isEmpty()) {
            roleService.createNewRole(UserRole.ROLE_ADMIN);
            roleService.createNewRole(UserRole.ROLE_USER);
            roleService.createNewRole(UserRole.ROLE_MODERATOR);
            System.out.println("Initialized default roles.");
        }
        else {
            System.out.println("Roles already initialized.");
        }
    }

    private void initializeInterests() {
        // Add interest initialization logic here if needed
        if (interestService.findAll().isEmpty()) {
            // Initialize interests
            System.out.println("Initialized default interests.");
            // A
            interestService.create(new CreateInterestRequest("Acting", "🎭"));
            interestService.create(new CreateInterestRequest("Archery", "🏹"));
            interestService.create(new CreateInterestRequest("Astronomy", "🔭"));
            interestService.create(new CreateInterestRequest("Anime", "🎌"));
            interestService.create(new CreateInterestRequest("Animals", "🦒"));

            // B
            interestService.create(new CreateInterestRequest("Badminton", "🏸"));
            interestService.create(new CreateInterestRequest("Baking", "🧁"));
            interestService.create(new CreateInterestRequest("Basketball", "🏀"));
            interestService.create(new CreateInterestRequest("Board games", "🎲"));
            interestService.create(new CreateInterestRequest("Boxing", "🥊"));

            // C
            interestService.create(new CreateInterestRequest("Camping", "🏕️"));
            interestService.create(new CreateInterestRequest("Cars", "🚗"));
            interestService.create(new CreateInterestRequest("Chess", "♟️"));
            interestService.create(new CreateInterestRequest("Climbing", "🧗"));
            interestService.create(new CreateInterestRequest("Cooking", "🍳"));
            interestService.create(new CreateInterestRequest("Cycling", "🚴"));

            // D
            interestService.create(new CreateInterestRequest("Dancing", "💃"));
            interestService.create(new CreateInterestRequest("Drawing", "✏️"));
            interestService.create(new CreateInterestRequest("Diving", "🤿"));
            interestService.create(new CreateInterestRequest("DIY crafts", "🛠️"));
            interestService.create(new CreateInterestRequest("Drumming", "🥁"));

            // E
            interestService.create(new CreateInterestRequest("Exercise", "🏋️"));
            interestService.create(new CreateInterestRequest("E-sports", "🎮"));
            interestService.create(new CreateInterestRequest("Electronics DIY", "🔧"));
            interestService.create(new CreateInterestRequest("Embroidery", "🧵"));
            interestService.create(new CreateInterestRequest("Entrepreneurship", "💼"));

            // F
            interestService.create(new CreateInterestRequest("Fashion", "👗"));
            interestService.create(new CreateInterestRequest("Fishing", "🎣"));
            interestService.create(new CreateInterestRequest("Football", "⚽"));
            interestService.create(new CreateInterestRequest("Fitness", "🏋️‍♂️"));
            interestService.create(new CreateInterestRequest("Flower arranging", "💐"));

            // G
            interestService.create(new CreateInterestRequest("Gaming", "🕹️"));
            interestService.create(new CreateInterestRequest("Gardening", "🌱"));
            interestService.create(new CreateInterestRequest("Golf", "⛳"));
            interestService.create(new CreateInterestRequest("Graphic design", "🎨"));
            interestService.create(new CreateInterestRequest("Gymnastics", "🤸"));

            // H
            interestService.create(new CreateInterestRequest("Hiking", "🥾"));
            interestService.create(new CreateInterestRequest("Home decor", "🛋️"));
            interestService.create(new CreateInterestRequest("Horror movies", "🎬"));
            interestService.create(new CreateInterestRequest("History", "📜"));
            interestService.create(new CreateInterestRequest("Horse riding", "🐎"));

            // I
            interestService.create(new CreateInterestRequest("Ice skating", "⛸️"));
            interestService.create(new CreateInterestRequest("Instrument playing", "🎸"));
            interestService.create(new CreateInterestRequest("Interior design", "🪴"));
            interestService.create(new CreateInterestRequest("Illustration", "🖌️"));
            interestService.create(new CreateInterestRequest("Investing", "📈"));

            // J
            interestService.create(new CreateInterestRequest("Jogging", "🏃"));
            interestService.create(new CreateInterestRequest("Jewelry making", "📿"));
            interestService.create(new CreateInterestRequest("Journaling", "📓"));
            interestService.create(new CreateInterestRequest("Jigsaw puzzles", "🧩"));
            interestService.create(new CreateInterestRequest("Jet skiing", "🚤"));

            // K
            interestService.create(new CreateInterestRequest("Kayaking", "🛶"));
            interestService.create(new CreateInterestRequest("Knitting", "🧶"));
            interestService.create(new CreateInterestRequest("Karaoke", "🎤"));
            interestService.create(new CreateInterestRequest("K-pop", "🌟"));
            interestService.create(new CreateInterestRequest("Kitesurfing", "🏄‍♂️"));

            // L
            interestService.create(new CreateInterestRequest("Learning languages", "🗣️"));
            interestService.create(new CreateInterestRequest("Live music", "🎵"));
            interestService.create(new CreateInterestRequest("Lego building", "🧱"));
            interestService.create(new CreateInterestRequest("Landscape photography", "📸"));
            interestService.create(new CreateInterestRequest("Literature", "📚"));

            // M
            interestService.create(new CreateInterestRequest("Meditation", "🧘"));
            interestService.create(new CreateInterestRequest("Movies", "🎥"));
            interestService.create(new CreateInterestRequest("Motorcycles", "🏍️"));
            interestService.create(new CreateInterestRequest("Makeup artistry", "💄"));
            interestService.create(new CreateInterestRequest("Martial arts", "🥋"));

            // N
            interestService.create(new CreateInterestRequest("Nature photography", "🌿"));
            interestService.create(new CreateInterestRequest("Night sky watching", "🌌"));
            interestService.create(new CreateInterestRequest("Nutrition", "🥗"));
            interestService.create(new CreateInterestRequest("Nail art", "💅"));
            interestService.create(new CreateInterestRequest("Numismatics", "🪙")); // sưu tầm tiền xu

            // O
            interestService.create(new CreateInterestRequest("Origami", "🦢"));
            interestService.create(new CreateInterestRequest("Outdoor running", "🏃‍♀️"));
            interestService.create(new CreateInterestRequest("Oil painting", "🖼️"));
            interestService.create(new CreateInterestRequest("Off-road driving", "🚙"));
            interestService.create(new CreateInterestRequest("Online learning", "💻"));

            // P
            interestService.create(new CreateInterestRequest("Painting", "🎨"));
            interestService.create(new CreateInterestRequest("Pets", "🐶"));
            interestService.create(new CreateInterestRequest("Piano", "🎹"));
            interestService.create(new CreateInterestRequest("Photography", "📷"));
            interestService.create(new CreateInterestRequest("Pottery", "🏺"));

            // Q
            interestService.create(new CreateInterestRequest("Quilting", "🧵"));
            interestService.create(new CreateInterestRequest("Quiz games", "❓"));
            interestService.create(new CreateInterestRequest("Qigong", "🧘‍♂️"));
            interestService.create(new CreateInterestRequest("Quality wine tasting", "🍷"));
            interestService.create(new CreateInterestRequest("Quick sketching", "✏️"));

            // R
            interestService.create(new CreateInterestRequest("Reading", "📚"));
            interestService.create(new CreateInterestRequest("Running", "🏃‍♂️"));
            interestService.create(new CreateInterestRequest("Rock climbing", "🧗‍♂️"));
            interestService.create(new CreateInterestRequest("Robotics", "🤖"));
            interestService.create(new CreateInterestRequest("Rowing", "🚣"));

            // S
            interestService.create(new CreateInterestRequest("Swimming", "🏊"));
            interestService.create(new CreateInterestRequest("Surfing", "🏄"));
            interestService.create(new CreateInterestRequest("Singing", "🎤"));
            interestService.create(new CreateInterestRequest("Skateboarding", "🛹"));
            interestService.create(new CreateInterestRequest("Skiing", "🎿"));

            // T
            interestService.create(new CreateInterestRequest("Traveling", "✈️"));
            interestService.create(new CreateInterestRequest("Tennis", "🎾"));
            interestService.create(new CreateInterestRequest("Table tennis", "🏓"));
            interestService.create(new CreateInterestRequest("Technology", "💻"));
            interestService.create(new CreateInterestRequest("Tea tasting", "🍵"));

            // U
            interestService.create(new CreateInterestRequest("Ukulele", "🪕"));
            interestService.create(new CreateInterestRequest("Urban exploration", "🌆"));
            interestService.create(new CreateInterestRequest("Ultimate frisbee", "🥏"));
            interestService.create(new CreateInterestRequest("Underwater photography", "🤿"));
            interestService.create(new CreateInterestRequest("Unicycling", "🚴‍♂️"));

            // V
            interestService.create(new CreateInterestRequest("Volleyball", "🏐"));
            interestService.create(new CreateInterestRequest("Vintage collecting", "📻"));
            interestService.create(new CreateInterestRequest("Video editing", "🎞️"));
            interestService.create(new CreateInterestRequest("Vegan cooking", "🥦"));
            interestService.create(new CreateInterestRequest("Violin", "🎻"));

            // W
            interestService.create(new CreateInterestRequest("Writing", "✍️"));
            interestService.create(new CreateInterestRequest("Weightlifting", "🏋️‍♂️"));
            interestService.create(new CreateInterestRequest("Woodworking", "🪵"));
            interestService.create(new CreateInterestRequest("Windsurfing", "🏄‍♀️"));
            interestService.create(new CreateInterestRequest("Wildlife watching", "🦌"));

            // X
            interestService.create(new CreateInterestRequest("Xylophone", "🎼"));
            interestService.create(new CreateInterestRequest("Xbox gaming", "🎮"));
            interestService.create(new CreateInterestRequest("X-country running", "🏃"));
            interestService.create(new CreateInterestRequest("Xtreme sports", "🤘"));
            interestService.create(new CreateInterestRequest("Xeriscape gardening", "🌵"));

            // Y
            interestService.create(new CreateInterestRequest("Yoga", "🧘‍♀️"));
            interestService.create(new CreateInterestRequest("Yacht sailing", "⛵"));
            interestService.create(new CreateInterestRequest("Yo-yo tricks", "🪀"));
            interestService.create(new CreateInterestRequest("Yodeling", "🎶"));
            interestService.create(new CreateInterestRequest("Yogurt making", "🥣"));

            // Z
            interestService.create(new CreateInterestRequest("Zumba", "🕺"));
            interestService.create(new CreateInterestRequest("Ziplining", "🛫"));
            interestService.create(new CreateInterestRequest("Zoo visiting", "🐘"));
            interestService.create(new CreateInterestRequest("Zodiac study", "♓"));
            interestService.create(new CreateInterestRequest("Zen gardening", "🌿"));

        }
        else {
            System.out.println("Interests already initialized.");
        }
    }

    private void initializePropertyType() {
        if (propertyTypeService.findAll().isEmpty()) {
            propertyTypeService.create("House");
            propertyTypeService.create("Apartment");
            propertyTypeService.create("Barn");
            propertyTypeService.create("Bed & Breakfast");
            propertyTypeService.create("Boat");
            propertyTypeService.create("Cabin");
            propertyTypeService.create("Camper/RV");
            propertyTypeService.create("Casa particular");
            propertyTypeService.create("Castle");
            propertyTypeService.create("Cave");
            propertyTypeService.create("Container");
            propertyTypeService.create("Cycladic Home");
            System.out.println("Initialized default property types.");
        }
        else {
            System.out.println("Property types already initialized.");
        }
    }

    private void initializeExperienceCategories() {
        if (experienceCategoryService.findAll().isEmpty()) {
            experienceCategoryService.create("Art and design");
            experienceCategoryService.create("Fitness and wellness");
            experienceCategoryService.create("Food and drink");
            experienceCategoryService.create("History and culture");
            experienceCategoryService.create("Nature and outdoors");
            System.out.println("Initialized default experience categories.");
        }
        else {
            System.out.println("Experience categories already initialized.");
        }
    }
}

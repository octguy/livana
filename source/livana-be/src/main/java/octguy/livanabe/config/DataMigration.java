package octguy.livanabe.config;

import octguy.livanabe.entity.Amenity;
import octguy.livanabe.entity.ExperienceCategory;
import octguy.livanabe.entity.Facility;
import octguy.livanabe.entity.PropertyType;
import octguy.livanabe.repository.AmenityRepository;
import octguy.livanabe.repository.ExperienceCategoryRepository;
import octguy.livanabe.repository.FacilityRepository;
import octguy.livanabe.repository.PropertyTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Order(1) // Run before DataInitializer
public class DataMigration implements CommandLineRunner {

    private final PropertyTypeRepository propertyTypeRepository;
    private final ExperienceCategoryRepository experienceCategoryRepository;
    private final FacilityRepository facilityRepository;
    private final AmenityRepository amenityRepository;

    public DataMigration(PropertyTypeRepository propertyTypeRepository,
                        ExperienceCategoryRepository experienceCategoryRepository,
                        FacilityRepository facilityRepository,
                        AmenityRepository amenityRepository) {
        this.propertyTypeRepository = propertyTypeRepository;
        this.experienceCategoryRepository = experienceCategoryRepository;
        this.facilityRepository = facilityRepository;
        this.amenityRepository = amenityRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
//        System.out.println("Running data migration...");
        
        migratePropertyTypeIcons();
        migrateExperienceCategoryIcons();
        migrateFacilityIcons();
        migrateAmenityIcons();
        
//        System.out.println("Data migration completed.");
    }

    private void migratePropertyTypeIcons() {
        Map<String, String> propertyTypeIcons = new HashMap<>();
        propertyTypeIcons.put("House", "🏠");
        propertyTypeIcons.put("Apartment", "🏢");
        propertyTypeIcons.put("Barn", "🛖");
        propertyTypeIcons.put("Bed & Breakfast", "🛏️");
        propertyTypeIcons.put("Boat", "⛵");
        propertyTypeIcons.put("Cabin", "🏕️");
        propertyTypeIcons.put("Camper/RV", "🚐");
        propertyTypeIcons.put("Casa particular", "🏘️");
        propertyTypeIcons.put("Castle", "🏰");
        propertyTypeIcons.put("Cave", "🕳️");
        propertyTypeIcons.put("Container", "📦");
        propertyTypeIcons.put("Cycladic Home", "🏛️");

        List<PropertyType> propertyTypes = propertyTypeRepository.findAll();
        boolean updated = false;
        
        for (PropertyType propertyType : propertyTypes) {
            if (propertyType.getIcon() == null || propertyType.getIcon().isEmpty()) {
                String icon = propertyTypeIcons.getOrDefault(propertyType.getName(), "🏠");
                propertyType.setIcon(icon);
                propertyTypeRepository.save(propertyType);
                updated = true;
//                System.out.println("Updated icon for property type: " + propertyType.getName() + " -> " + icon);
            }
        }
        
//        if (!updated) {
//            System.out.println("No property types needed icon migration.");
//        }
    }

    private void migrateExperienceCategoryIcons() {
        Map<String, String> experienceCategoryIcons = new HashMap<>();
        experienceCategoryIcons.put("Art and design", "🎨");
        experienceCategoryIcons.put("Fitness and wellness", "🧘");
        experienceCategoryIcons.put("Food and drink", "🍳");
        experienceCategoryIcons.put("History and culture", "🏛️");
        experienceCategoryIcons.put("Nature and outdoors", "🌲");

        List<ExperienceCategory> experienceCategories = experienceCategoryRepository.findAll();
        boolean updated = false;
        
        for (ExperienceCategory category : experienceCategories) {
            if (category.getIcon() == null || category.getIcon().isEmpty()) {
                String icon = experienceCategoryIcons.getOrDefault(category.getName(), "🎯");
                category.setIcon(icon);
                experienceCategoryRepository.save(category);
                updated = true;
                System.out.println("Updated icon for experience category: " + category.getName() + " -> " + icon);
            }
        }
        
//        if (!updated) {
//            System.out.println("No experience categories needed icon migration.");
//        }
    }

    private void migrateFacilityIcons() {
        Map<String, String> facilityIcons = new HashMap<>();
        facilityIcons.put("Bedroom", "🛏️");
        facilityIcons.put("Bed", "🛌");
        facilityIcons.put("Bathroom", "🛁");
        facilityIcons.put("Toilet", "🚽");

        List<Facility> facilities = facilityRepository.findAll();
        boolean updated = false;
        
        for (Facility facility : facilities) {
            if (facility.getIcon() == null || facility.getIcon().isEmpty()) {
                String icon = facilityIcons.getOrDefault(facility.getName(), "🛏️");
                facility.setIcon(icon);
                facilityRepository.save(facility);
                updated = true;
                System.out.println("Updated icon for facility: " + facility.getName() + " -> " + icon);
            }
        }
        
//        if (!updated) {
//            System.out.println("No facilities needed icon migration.");
//        }
    }

    private void migrateAmenityIcons() {
        Map<String, String> amenityIcons = new HashMap<>();
        amenityIcons.put("Wifi", "📶");
        amenityIcons.put("TV", "📺");
        amenityIcons.put("Kitchen", "🍳");
        amenityIcons.put("Washer", "🧺");
        amenityIcons.put("Free parking on premises", "🅿️");
        amenityIcons.put("Paid parking on premises", "💰");
        amenityIcons.put("Air conditioning", "❄️");
        amenityIcons.put("Dedicated workspace", "💼");
        amenityIcons.put("Pool", "🏊");
        amenityIcons.put("Hot tub", "🛁");
        amenityIcons.put("Patio", "🪴");
        amenityIcons.put("BBQ grill", "🍖");
        amenityIcons.put("Outdoor dining area", "🍽️");
        amenityIcons.put("Fire pit", "🔥");
        amenityIcons.put("Pool table", "🎱");
        amenityIcons.put("Indoor fireplace", "🔥");
        amenityIcons.put("Piano", "🎹");
        amenityIcons.put("Exercise equipment", "🏋️");
        amenityIcons.put("Lake access", "🏞️");
        amenityIcons.put("Beach access", "🏖️");
        amenityIcons.put("Ski-in/Ski-out", "🎿");
        amenityIcons.put("Outdoor shower", "🚿");
        amenityIcons.put("Smoke alarm", "🚨");
        amenityIcons.put("First aid kit", "🩹");
        amenityIcons.put("Fire extinguisher", "🧯");
        amenityIcons.put("Carbon monoxide alarm", "⚠️");

        List<Amenity> amenities = amenityRepository.findAll();
        boolean updated = false;
        
        for (Amenity amenity : amenities) {
            if (amenity.getIcon() == null || amenity.getIcon().isEmpty()) {
                String icon = amenityIcons.getOrDefault(amenity.getName(), "⭐");
                amenity.setIcon(icon);
                amenityRepository.save(amenity);
                updated = true;
                System.out.println("Updated icon for amenity: " + amenity.getName() + " -> " + icon);
            }
        }
        
//        if (!updated) {
//            System.out.println("No amenities needed icon migration.");
//        }
    }
}

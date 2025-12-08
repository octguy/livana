package octguy.livanabe.config;

import octguy.livanabe.entity.ExperienceCategory;
import octguy.livanabe.entity.PropertyType;
import octguy.livanabe.repository.ExperienceCategoryRepository;
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

    public DataMigration(PropertyTypeRepository propertyTypeRepository,
                        ExperienceCategoryRepository experienceCategoryRepository) {
        this.propertyTypeRepository = propertyTypeRepository;
        this.experienceCategoryRepository = experienceCategoryRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
//        System.out.println("Running data migration...");
        
//        migratePropertyTypeIcons();
//        migrateExperienceCategoryIcons();
        
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
                System.out.println("Updated icon for property type: " + propertyType.getName() + " -> " + icon);
            }
        }
        
        if (!updated) {
            System.out.println("No property types needed icon migration.");
        }
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
        
        if (!updated) {
            System.out.println("No experience categories needed icon migration.");
        }
    }
}

package octguy.livanabe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "octguy.livanabe.repository")
public class LivanaBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(LivanaBeApplication.class, args);
    }

}

package org.example.livanabe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LinavaBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(LinavaBeApplication.class, args);
	}

}

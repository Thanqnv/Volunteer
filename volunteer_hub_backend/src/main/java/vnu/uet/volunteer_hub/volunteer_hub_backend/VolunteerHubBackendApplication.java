package vnu.uet.volunteer_hub.volunteer_hub_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class VolunteerHubBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(VolunteerHubBackendApplication.class, args);
	}

}

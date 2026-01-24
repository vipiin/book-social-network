package com.bsn.book;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import com.bsn.book.auth.AuthenticationController;
import com.bsn.book.role.Role;
import com.bsn.book.role.RoleRepository;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
public class BookNetworkApiApplication {

	private final AuthenticationController authenticationController;

	private final RoleRepository roleRepository;

	BookNetworkApiApplication(RoleRepository roleRepository, AuthenticationController authenticationController) {
		this.roleRepository = roleRepository;
		this.authenticationController = authenticationController;
	}

	public static void main(String[] args) {
		SpringApplication.run(BookNetworkApiApplication.class, args);

	}

	@Bean
	public CommandLineRunner runner(RoleRepository roleRepository) {
		return args -> {
			if (roleRepository.findByName("USER").isEmpty()) {
				roleRepository.save(
						Role.builder().name("USER").build());
			}
		};
	}

}

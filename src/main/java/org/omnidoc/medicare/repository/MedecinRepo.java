package org.omnidoc.medicare.repository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.omnidoc.medicare.entity.users.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedecinRepo extends JpaRepository<Medecin,Long> {
//    Optional<Medecin> findByUser_Email(String userUsername);

    Optional<Medecin> findByUser_Email(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String userEmail);

    Optional<Medecin> findByUser_Id(Long userId);
}

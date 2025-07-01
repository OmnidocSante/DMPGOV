package org.omnidoc.medicare.repository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.omnidoc.medicare.entity.users.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepo extends JpaRepository<Patient,Long> {
    Optional<Patient> findByUser_Id(Long userId);

    Patient findByUser_Email(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String userEmail);

}

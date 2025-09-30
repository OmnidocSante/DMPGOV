package org.omnidoc.medicare.repository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.omnidoc.medicare.entity.users.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PatientRepo extends JpaRepository<Patient,Long> {
    Optional<Patient> findByUser_Id(Long userId);

    Patient findByUser_Email(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String userEmail);
    @Query("""
       SELECT u.ville, p.status, COUNT(p)
       FROM Patient p
       JOIN p.user u
       GROUP BY u.ville, p.status
       """)
    List<Object[]> countByVilleAndStatus();


}

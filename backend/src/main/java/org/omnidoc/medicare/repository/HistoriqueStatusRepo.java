package org.omnidoc.medicare.repository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.omnidoc.medicare.entity.folder.details.HistoriqueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HistoriqueStatusRepo extends JpaRepository<HistoriqueStatus, Long> {
    List<HistoriqueStatus> findHistoriqueStatusesByPatient_User_Id(Long patientId);

    Optional<HistoriqueStatus> findTopByStatusAndMedecin_UserEmailOrderByDateDesc(String status, String userEmail);

    @Query("SELECT hs FROM HistoriqueStatus hs WHERE hs.patient.id = :patientId ORDER BY hs.date DESC LIMIT 1")
    Optional<HistoriqueStatus> findLatestRdvByPatientEmail(@Param("patientId") Long patientId);
    // Latest status with comment
    Optional<HistoriqueStatus> findTopByPatientIdAndMedecin_User_EmailAndCommentIsNotNullOrderByDateDesc(
            Long patientId, String medecinEmail
    );

    // Latest status (already exists)
    Optional<HistoriqueStatus> findTopByPatientIdAndMedecin_User_EmailOrderByDateDesc(
            Long patientId, String medecinEmail
    );

    List<HistoriqueStatus> findByPatientIdAndMedecin_User_EmailOrderByDateDesc(Long patientId, String medecinUserEmail);
}
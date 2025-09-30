package org.omnidoc.medicare.repository;

import jakarta.validation.constraints.NotNull;
import org.omnidoc.medicare.entity.rdvs.Rdv;
import org.omnidoc.medicare.entity.users.Medecin;
import org.omnidoc.medicare.entity.users.Patient;
import org.omnidoc.medicare.enums.StatusRDV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface RdvRepo extends JpaRepository<Rdv,Long> {
    Collection<Rdv> findRdvsByMedecin(@NotNull(message = "Le médecin est obligatoire") Medecin medecin);


    @Query("SELECT r FROM Rdv r " + "WHERE r.statusRDV = :status " + "AND r.patient.id = :id " + "AND r.date > CURRENT_TIMESTAMP " + "ORDER BY r.date ASC")
    List<Rdv> findNextPlannedRdvByPatientId(@Param("status") StatusRDV status, @Param("id") Long id);

    Optional<Rdv> findTopByPatientAndMedecinOrderByDateDesc(Patient patient, Medecin medecin);
    Optional<Rdv> findByPatientAndMedecinAndIsNextRdvTrue(Patient patient, Medecin medecin);
    Optional<Rdv> findTopByPatientAndMedecinAndDateBeforeOrderByDateDesc(@NotNull(message = "Le jockey est obligatoire") Patient patient, @NotNull(message = "Le médecin est obligatoire") Medecin medecin, @NotNull(message = "La date du rendez-vous est obligatoire") Date date);
    Optional<Rdv> findTopByPatientAndMedecinAndIsNextRdvFalseOrderByDateDesc(Patient patient, Medecin medecin);





}

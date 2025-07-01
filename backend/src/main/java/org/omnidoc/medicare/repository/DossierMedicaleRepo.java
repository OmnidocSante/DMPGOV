package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface DossierMedicaleRepo extends JpaRepository<DossierMedicale, Long> {
    @Transactional
    @Modifying
    @Query("UPDATE DossierMedicale d SET d.isCurrent = false WHERE d.patient.id = :patientId")
    void deactivateOldVersions(@Param("patientId") Long patientId);

    Optional<DossierMedicale> getDossierMedicalesByPatient_idAndIsCurrentTrue(Long patientId);

    Optional<List<DossierMedicale>> getDossierMedicalesByPatient_IdAndIsCurrentFalse(Long patientId);

    Optional<DossierMedicale> findTopByPatient_IdOrderByDateDesc(Long jockeyId);

    DossierMedicale findByPatient_Id(Long patientId);
}

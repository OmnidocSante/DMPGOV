package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.AntecedentsProfessionnels;
import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AntecedentsProfessionelsRepo extends JpaRepository<AntecedentsProfessionnels,Long> {
    Optional<AntecedentsProfessionnels> findByDossierMedicale_Id(Long dossierMedicaleId);

    AntecedentsProfessionnels findByDossierMedicale_Patient_Id(Long dossierMedicalePatientId);

    AntecedentsProfessionnels findByDossierMedicale_Patient_IdAndDossierMedicale_IsCurrent(Long dossierMedicalePatientId, Boolean dossierMedicaleIsCurrent);
}

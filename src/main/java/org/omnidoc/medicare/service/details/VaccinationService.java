package org.omnidoc.medicare.service.details;

import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.Vaccination;
import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.VaccinationRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class VaccinationService {

    private final AccessService accessService;
    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final VaccinationRepo vaccinationRepo;

    public VaccinationService(
            AccessService accessService,
            DossierMedicaleRepo dossierMedicaleRepo,
            VaccinationRepo vaccinationRepo
    ) {
        this.accessService = accessService;
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.vaccinationRepo = vaccinationRepo;
    }

    public Vaccination fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateVaccination(dossier);
    }

    public Vaccination fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.findById(dossierId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateVaccination(dossier);
    }

    private Vaccination getOrCreateVaccination(DossierMedicale dossier) throws Exception {
        Vaccination vaccination = dossier.getVaccination();
        if (vaccination == null) {
            throw new ApiException("Vaccination introuvable");
        }

        vaccination.setNotes(decryptIfNotNull(vaccination.getNotes()));
        return vaccination;
    }

    public void updateByPatientId(Long patientId, Vaccination vaccinationRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));

        vaccinationRequest.setDossierMedicale(dossier);
        vaccinationRequest.setNotes(encryptIfNotNull(vaccinationRequest.getNotes()));
        vaccinationRepo.save(vaccinationRequest);
    }
}

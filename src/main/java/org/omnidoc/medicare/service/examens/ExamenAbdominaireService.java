package org.omnidoc.medicare.service.examens;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.examens.ExamenAbdominaire;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.ExamenAbdominaireRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class ExamenAbdominaireService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final ExamenAbdominaireRepo examenAbdominaireRepo;
    private final AccessService accessService;

    public ExamenAbdominaireService(
            DossierMedicaleRepo dossierMedicaleRepo,
            ExamenAbdominaireRepo examenAbdominaireRepo,
            AccessService accessService
    ) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.examenAbdominaireRepo = examenAbdominaireRepo;
        this.accessService = accessService;
    }

    public ExamenAbdominaire fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getExamen(dossier);
    }

    public ExamenAbdominaire fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .findById(dossierId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getExamen(dossier);
    }

    private ExamenAbdominaire getExamen(DossierMedicale dossier) throws Exception {
        ExamenAbdominaire examen = dossier.getExamenAbdominaire();
        examen.setAbdomen(decryptIfNotNull(examen.getAbdomen()));
        return examen;
    }

    public void updateByPatientId(Long patientId, ExamenAbdominaire examenRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        examenRequest.setDossierMedicale(dossier);
        examenRequest.setAbdomen(encryptIfNotNull(examenRequest.getAbdomen()));
        examenAbdominaireRepo.save(examenRequest);
    }
}

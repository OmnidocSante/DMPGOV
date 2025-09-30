package org.omnidoc.medicare.service.examens;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.examens.ExamenPsychotechnique;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.ExamenPsychotechniqueRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class ExamenPsychotechniqueService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final ExamenPsychotechniqueRepo examenPsychotechniqueRepo;
    private final AccessService accessService;

    public ExamenPsychotechniqueService(
            DossierMedicaleRepo dossierMedicaleRepo,
            ExamenPsychotechniqueRepo examenPsychotechniqueRepo,
            AccessService accessService
    ) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.examenPsychotechniqueRepo = examenPsychotechniqueRepo;
        this.accessService = accessService;
    }

    public ExamenPsychotechnique fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    public ExamenPsychotechnique fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .findById(dossierId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    private ExamenPsychotechnique getOrCreateExamen(DossierMedicale dossier) throws Exception {
        ExamenPsychotechnique examen = dossier.getExamenPsychotechnique();
        examen.setLieu(decryptIfNotNull(examen.getLieu()));
        return examen;
    }

    public void updateByPatientId(Long patientId, ExamenPsychotechnique examenRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));

        examenRequest.setDossierMedicale(dossier);
        examenRequest.setLieu(encryptIfNotNull(examenRequest.getLieu()));

        examenPsychotechniqueRepo.save(examenRequest);
    }
}

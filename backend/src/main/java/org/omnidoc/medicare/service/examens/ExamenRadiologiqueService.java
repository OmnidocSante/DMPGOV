package org.omnidoc.medicare.service.examens;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.examens.ExamenRadiologique;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.ExamenRadiologiqueRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class ExamenRadiologiqueService {


    private final AccessService accessService;
    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final ExamenRadiologiqueRepo examenRadiologiqueRepo;

    public ExamenRadiologiqueService(AccessService accessService, DossierMedicaleRepo dossierMedicaleRepo, ExamenRadiologiqueRepo examenRadiologiqueRepo) {
        this.accessService = accessService;
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.examenRadiologiqueRepo = examenRadiologiqueRepo;
    }

    public ExamenRadiologique fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    public ExamenRadiologique fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.findById(dossierId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    private ExamenRadiologique getOrCreateExamen(DossierMedicale dossier) throws Exception {
        ExamenRadiologique examen = dossier.getExamenRadiologique();

        // Decrypt notes (if not null)
        examen.setNotes(decryptIfNotNull(examen.getNotes()));

        return examen;
    }

    public void updateByPatientId(Long patientId, ExamenRadiologique examenRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));

        examenRequest.setDossierMedicale(dossier);

        // Encrypt notes (if not null)
        examenRequest.setNotes(encryptIfNotNull(examenRequest.getNotes()));

        examenRadiologiqueRepo.save(examenRequest);
    }
}

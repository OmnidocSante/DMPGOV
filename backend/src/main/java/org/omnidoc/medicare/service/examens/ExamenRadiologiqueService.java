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

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final ExamenRadiologiqueRepo examenRadiologiqueRepo;
    private final AccessService accessService;

    public ExamenRadiologiqueService(DossierMedicaleRepo dossierMedicaleRepo, ExamenRadiologiqueRepo examenRadiologiqueRepo, AccessService accessService) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.examenRadiologiqueRepo = examenRadiologiqueRepo;
        this.accessService = accessService;
    }

    public ExamenRadiologique fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    public ExamenRadiologique fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.findById(dossierId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    private ExamenRadiologique getOrCreateExamen(DossierMedicale dossier) throws Exception {
        ExamenRadiologique examen = dossier.getExamenRadiologique();

        examen.setPouls(decryptIfNotNull(examen.getPouls()));
        examen.setPressionArterielle(decryptIfNotNull(examen.getPressionArterielle()));
        examen.setVarices(decryptIfNotNull(examen.getVarices()));
        examen.setAppareilRespiratoire(decryptIfNotNull(examen.getAppareilRespiratoire()));

        return examen;
    }

    public void updateByPatientId(Long patientId, ExamenRadiologique examenRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        examenRequest.setDossierMedicale(dossier);
        examenRequest.setPouls(encryptIfNotNull(examenRequest.getPouls()));
        examenRequest.setPressionArterielle(encryptIfNotNull(examenRequest.getPressionArterielle()));
        examenRequest.setVarices(encryptIfNotNull(examenRequest.getVarices()));
        examenRequest.setAppareilRespiratoire(encryptIfNotNull(examenRequest.getAppareilRespiratoire()));
        examenRadiologiqueRepo.save(examenRequest);
    }
}

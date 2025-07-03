package org.omnidoc.medicare.service.examens;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.examens.ExamenRadiologique;
import org.omnidoc.medicare.entity.folder.examens.ExamenVasculaire;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.ExamenRadiologiqueRepo;
import org.omnidoc.medicare.repository.ExamenVasculaireRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class ExamenVasculaireService {
    private final AccessService accessService;
    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final ExamenVasculaireRepo examenVasculaireRepo;

    public ExamenVasculaireService(AccessService accessService, DossierMedicaleRepo dossierMedicaleRepo, ExamenVasculaireRepo examenVasculaireRepo) {
        this.accessService = accessService;
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.examenVasculaireRepo = examenVasculaireRepo;
    }

    public ExamenVasculaire fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    public ExamenVasculaire fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.findById(dossierId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    private ExamenVasculaire getOrCreateExamen(DossierMedicale dossier) throws Exception {
        ExamenVasculaire examenVasculaire = dossier.getExamenVasculaire();

        examenVasculaire.setPouls(decryptIfNotNull(examenVasculaire.getPouls()));
        examenVasculaire.setPressionArterielle(decryptIfNotNull(examenVasculaire.getPressionArterielle()));
        examenVasculaire.setVarices(decryptIfNotNull(examenVasculaire.getVarices()));
        examenVasculaire.setAppareilRespiratoire(decryptIfNotNull(examenVasculaire.getAppareilRespiratoire()));

        return examenVasculaire;
    }

    public void updateByPatientId(Long patientId, ExamenVasculaire examenRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        examenRequest.setDossierMedicale(dossier);
        examenRequest.setPouls(encryptIfNotNull(examenRequest.getPouls()));
        examenRequest.setPressionArterielle(encryptIfNotNull(examenRequest.getPressionArterielle()));
        examenRequest.setVarices(encryptIfNotNull(examenRequest.getVarices()));
        examenRequest.setAppareilRespiratoire(encryptIfNotNull(examenRequest.getAppareilRespiratoire()));
        examenVasculaireRepo.save(examenRequest);
    }
}
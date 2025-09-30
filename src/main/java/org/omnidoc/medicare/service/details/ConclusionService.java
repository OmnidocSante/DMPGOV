package org.omnidoc.medicare.service.details;

import org.omnidoc.medicare.entity.folder.details.Conclusion;
import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.ConclusionRepo;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class ConclusionService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final ConclusionRepo conclusionRepo;
    private final AccessService accessService;

    public ConclusionService(
            DossierMedicaleRepo dossierMedicaleRepo,
            ConclusionRepo conclusionRepo,
            AccessService accessService
    ) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.conclusionRepo = conclusionRepo;
        this.accessService = accessService;
    }

    public Conclusion fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateConclusion(dossier);
    }

    public Conclusion fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .findById(dossierId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateConclusion(dossier);
    }

    private Conclusion getOrCreateConclusion(DossierMedicale dossier) throws Exception {
        Conclusion conclusion = dossier.getConclusion();

        conclusion.setHoraireTravail(decryptIfNotNull(conclusion.getHoraireTravail()));
        conclusion.setDeplacements(decryptIfNotNull(conclusion.getDeplacements()));
        conclusion.setBilangenerale(decryptIfNotNull(conclusion.getBilangenerale()));
        conclusion.setEpreuves(decryptIfNotNull(conclusion.getEpreuves()));

        return conclusion;
    }

    public void updateByPatientId(Long patientId, Conclusion conclusionRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));

        conclusionRequest.setDossierMedicale(dossier);
        conclusionRequest.setHoraireTravail(encryptIfNotNull(conclusionRequest.getHoraireTravail()));
        conclusionRequest.setDeplacements(encryptIfNotNull(conclusionRequest.getDeplacements()));
        conclusionRequest.setBilangenerale(encryptIfNotNull(conclusionRequest.getBilangenerale()));
        conclusionRequest.setEpreuves(encryptIfNotNull(conclusionRequest.getEpreuves()));

        conclusionRepo.save(conclusionRequest);
    }
}

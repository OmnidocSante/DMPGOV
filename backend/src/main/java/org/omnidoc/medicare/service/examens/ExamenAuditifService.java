package org.omnidoc.medicare.service.examens;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.examens.ExamenAuditif;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.ExamenAuditifRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class ExamenAuditifService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final ExamenAuditifRepo examenAuditifRepo;
    private final AccessService accessService;

    public ExamenAuditifService(
            DossierMedicaleRepo dossierMedicaleRepo,
            ExamenAuditifRepo examenAuditifRepo,
            AccessService accessService
    ) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.examenAuditifRepo = examenAuditifRepo;
        this.accessService = accessService;
    }

    public ExamenAuditif fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    public ExamenAuditif fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .findById(dossierId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    private ExamenAuditif getOrCreateExamen(DossierMedicale dossier) throws Exception {
        ExamenAuditif examen = dossier.getExamenAuditif();
        examen.setVisionDePresDroit(decryptIfNotNull(examen.getVisionDePresDroit()));
        examen.setVisionDePresGauche(decryptIfNotNull(examen.getVisionDePresGauche()));
        examen.setVisionDeLoinDroit(decryptIfNotNull(examen.getVisionDeLoinDroit()));
        examen.setVisionDeLoinGauche(decryptIfNotNull(examen.getVisionDeLoinGauche()));
        examen.setOeilDroit(decryptIfNotNull(examen.getOeilDroit()));
        examen.setOeilGauche(decryptIfNotNull(examen.getOeilGauche()));

        return examen;
    }

    public void updateByPatientId(Long patientId, ExamenAuditif examenRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));

        examenRequest.setDossierMedicale(dossier);
        examenRequest.setVisionDePresDroit(encryptIfNotNull(examenRequest.getVisionDePresDroit()));
        examenRequest.setVisionDePresGauche(encryptIfNotNull(examenRequest.getVisionDePresGauche()));
        examenRequest.setVisionDeLoinDroit(encryptIfNotNull(examenRequest.getVisionDeLoinDroit()));
        examenRequest.setVisionDeLoinGauche(encryptIfNotNull(examenRequest.getVisionDeLoinGauche()));
        examenRequest.setOeilDroit(encryptIfNotNull(examenRequest.getOeilDroit()));
        examenRequest.setOeilGauche(encryptIfNotNull(examenRequest.getOeilGauche()));

        examenAuditifRepo.save(examenRequest);
    }
}

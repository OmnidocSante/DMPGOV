package org.omnidoc.medicare.service.examens;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.examens.ExamenAppareilGenitoUrinaire;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.ExamenAppareilGenitoUrinaireRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class ExamenAppareilGenitoUrinaireService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final ExamenAppareilGenitoUrinaireRepo examenRepo;
    private final AccessService accessService;

    public ExamenAppareilGenitoUrinaireService(
            DossierMedicaleRepo dossierMedicaleRepo,
            ExamenAppareilGenitoUrinaireRepo examenRepo,
            AccessService accessService
    ) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.examenRepo = examenRepo;
        this.accessService = accessService;
    }

    public ExamenAppareilGenitoUrinaire fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    public ExamenAppareilGenitoUrinaire fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .findById(dossierId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateExamen(dossier);
    }

    private ExamenAppareilGenitoUrinaire getOrCreateExamen(DossierMedicale dossier) throws Exception {
        ExamenAppareilGenitoUrinaire examen = dossier.getExamenAppareilGenitoUrinaire();
        examen.setAlbumine(decryptIfNotNull(examen.getAlbumine()));
        examen.setSucre(decryptIfNotNull(examen.getSucre()));
        examen.setRegles(decryptIfNotNull(examen.getRegles()));
        examen.setGanglions(decryptIfNotNull(examen.getGanglions()));
        examen.setUrinaire(decryptIfNotNull(examen.getUrinaire()));
        examen.setRate(decryptIfNotNull(examen.getRate()));
        examen.setGlandesEndocrines(decryptIfNotNull(examen.getGlandesEndocrines()));
        examen.setNeuroPsychisme(decryptIfNotNull(examen.getNeuroPsychisme()));
        examen.setTremblement(decryptIfNotNull(examen.getTremblement()));
        examen.setEquilibre(decryptIfNotNull(examen.getEquilibre()));
        examen.setReflexes(decryptIfNotNull(examen.getReflexes()));
        examen.setTendinaux(decryptIfNotNull(examen.getTendinaux()));
        examen.setOculaires(decryptIfNotNull(examen.getOculaires()));
        return examen;
    }

    public void updateByPatientId(Long patientId, ExamenAppareilGenitoUrinaire examenRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));

        examenRequest.setDossierMedicale(dossier);
        examenRequest.setAlbumine(encryptIfNotNull(examenRequest.getAlbumine()));
        examenRequest.setSucre(encryptIfNotNull(examenRequest.getSucre()));
        examenRequest.setRegles(encryptIfNotNull(examenRequest.getRegles()));
        examenRequest.setGanglions(encryptIfNotNull(examenRequest.getGanglions()));
        examenRequest.setUrinaire(encryptIfNotNull(examenRequest.getUrinaire()));
        examenRequest.setRate(encryptIfNotNull(examenRequest.getRate()));
        examenRequest.setGlandesEndocrines(encryptIfNotNull(examenRequest.getGlandesEndocrines()));
        examenRequest.setNeuroPsychisme(encryptIfNotNull(examenRequest.getNeuroPsychisme()));
        examenRequest.setTremblement(encryptIfNotNull(examenRequest.getTremblement()));
        examenRequest.setEquilibre(encryptIfNotNull(examenRequest.getEquilibre()));
        examenRequest.setReflexes(encryptIfNotNull(examenRequest.getReflexes()));
        examenRequest.setTendinaux(encryptIfNotNull(examenRequest.getTendinaux()));
        examenRequest.setOculaires(encryptIfNotNull(examenRequest.getOculaires()));

        examenRepo.save(examenRequest);
    }
}

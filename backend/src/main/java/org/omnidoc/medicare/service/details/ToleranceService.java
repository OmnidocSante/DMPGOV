package org.omnidoc.medicare.service.details;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.details.Tolerance;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.ToleranceRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class ToleranceService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final ToleranceRepo toleranceRepo;
    private final AccessService accessService;

    public ToleranceService(DossierMedicaleRepo dossierMedicaleRepo, ToleranceRepo toleranceRepo, AccessService accessService) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.toleranceRepo = toleranceRepo;
        this.accessService = accessService;
    }

    public Tolerance fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateTolerance(dossier);
    }

    public Tolerance fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.findById(dossierId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateTolerance(dossier);
    }

    private Tolerance getOrCreateTolerance(DossierMedicale dossier) throws Exception {
        Tolerance tolerance = dossier.getTolerance();

        tolerance.setTrepidation(decryptIfNotNull(tolerance.getTrepidation()));
        tolerance.setImtemperance(decryptIfNotNull(tolerance.getImtemperance()));
        tolerance.setTemperance(decryptIfNotNull(tolerance.getTemperance()));
        tolerance.setIrritationsTeguments(decryptIfNotNull(tolerance.getIrritationsTeguments()));
        tolerance.setIrritantsRespiration(decryptIfNotNull(tolerance.getIrritantsRespiration()));
        tolerance.setToxiques(decryptIfNotNull(tolerance.getToxiques()));
        return tolerance;
    }

    public void updateByPatientId(Long patientId, Tolerance request) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));

        request.setDossierMedicale(dossier);
        request.setTrepidation(encryptIfNotNull(request.getTrepidation()));
        request.setImtemperance(encryptIfNotNull(request.getImtemperance()));
        request.setTemperance(encryptIfNotNull(request.getTemperance()));
        request.setIrritationsTeguments(encryptIfNotNull(request.getIrritationsTeguments()));
        request.setIrritantsRespiration(encryptIfNotNull(request.getIrritantsRespiration()));
        request.setToxiques(encryptIfNotNull(request.getToxiques()));

        toleranceRepo.save(request);
    }
}

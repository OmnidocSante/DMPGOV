package org.omnidoc.medicare.service.details;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.details.PatientDetail;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.PatientDetailRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class PatientDetailService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final PatientDetailRepo patientDetailRepo;
    private final AccessService accessService;

    public PatientDetailService(DossierMedicaleRepo dossierMedicaleRepo, PatientDetailRepo patientDetailRepo, AccessService accessService) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.patientDetailRepo = patientDetailRepo;
        this.accessService = accessService;
    }

    public PatientDetail fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreatePatientDetail(dossier);
    }

    public PatientDetail fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.findById(dossierId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreatePatientDetail(dossier);
    }

    private PatientDetail getOrCreatePatientDetail(DossierMedicale dossier) throws Exception {
        PatientDetail detail = dossier.getPatientDetail();

        detail.setNiveauScholaire(decryptIfNotNull(detail.getNiveauScholaire()));
        detail.setApprentissage(decryptIfNotNull(detail.getApprentissage()));
        detail.setCAP(decryptIfNotNull(detail.getCAP()));
        detail.setGout(decryptIfNotNull(detail.getGout()));
        detail.setTravailMonotone(decryptIfNotNull(detail.getTravailMonotone()));
        detail.setTravailAttention(decryptIfNotNull(detail.getTravailAttention()));
        detail.setTravailMachine(decryptIfNotNull(detail.getTravailMachine()));
        detail.setGoutResponsabilites(decryptIfNotNull(detail.getGoutResponsabilites()));

        return detail;
    }

    public void updateByPatientId(Long patientId, PatientDetail detailRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        detailRequest.setDossierMedicale(dossier);
        detailRequest.setNiveauScholaire(encryptIfNotNull(detailRequest.getNiveauScholaire()));
        detailRequest.setApprentissage(encryptIfNotNull(detailRequest.getApprentissage()));
        detailRequest.setCAP(encryptIfNotNull(detailRequest.getCAP()));
        detailRequest.setGout(encryptIfNotNull(detailRequest.getGout()));
        detailRequest.setTravailMonotone(encryptIfNotNull(detailRequest.getTravailMonotone()));
        detailRequest.setTravailAttention(encryptIfNotNull(detailRequest.getTravailAttention()));
        detailRequest.setTravailMachine(encryptIfNotNull(detailRequest.getTravailMachine()));
        detailRequest.setGoutResponsabilites(encryptIfNotNull(detailRequest.getGoutResponsabilites()));
        patientDetailRepo.save(detailRequest);
    }
}

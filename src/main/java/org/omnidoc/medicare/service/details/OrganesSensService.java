package org.omnidoc.medicare.service.details;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.details.OrganesSens;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.OrganesSensRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class OrganesSensService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final OrganesSensRepo organesSensRepo;
    private final AccessService accessService;

    public OrganesSensService(
            DossierMedicaleRepo dossierMedicaleRepo,
            OrganesSensRepo organesSensRepo,
            AccessService accessService
    ) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.organesSensRepo = organesSensRepo;
        this.accessService = accessService;
    }

    public OrganesSens fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateOrganesSens(dossier);
    }

    public OrganesSens fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .findById(dossierId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateOrganesSens(dossier);
    }

    private OrganesSens getOrCreateOrganesSens(DossierMedicale dossier) throws Exception {
        OrganesSens organesSens = dossier.getOrganesSens();

            organesSens.setVisionLoin(decryptIfNotNull(organesSens.getVisionLoin()));
            organesSens.setVisionPres(decryptIfNotNull(organesSens.getVisionPres()));
            organesSens.setVisionCouleurs(decryptIfNotNull(organesSens.getVisionCouleurs()));
            organesSens.setAudition(decryptIfNotNull(organesSens.getAudition()));

        return organesSens;
    }

    public void updateByPatientId(Long patientId, OrganesSens organesSensRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));

        organesSensRequest.setDossierMedicale(dossier);
        organesSensRequest.setVisionLoin(encryptIfNotNull(organesSensRequest.getVisionLoin()));
        organesSensRequest.setVisionPres(encryptIfNotNull(organesSensRequest.getVisionPres()));
        organesSensRequest.setVisionCouleurs(encryptIfNotNull(organesSensRequest.getVisionCouleurs()));
        organesSensRequest.setAudition(encryptIfNotNull(organesSensRequest.getAudition()));

        organesSensRepo.save(organesSensRequest);
    }
}

package org.omnidoc.medicare.service.antecedents;

import org.omnidoc.medicare.entity.folder.AntecedentsFamiliaux.AntecedentsFamiliaux;
import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.AntecedentsFamiliauxRepo;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class AntecedentsFamiliauxService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final AntecedentsFamiliauxRepo antecedentsFamiliauxRepo;
    private final AccessService accessService;

    public AntecedentsFamiliauxService(DossierMedicaleRepo dossierMedicaleRepo, AntecedentsFamiliauxRepo antecedentsFamiliauxRepo, AccessService accessService) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.antecedentsFamiliauxRepo = antecedentsFamiliauxRepo;
        this.accessService = accessService;
    }

    public AntecedentsFamiliaux fetchByJockeyId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateAntecedents(dossier);
    }

    public AntecedentsFamiliaux fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.findById(dossierId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateAntecedents(dossier);
    }

    private AntecedentsFamiliaux getOrCreateAntecedents(DossierMedicale dossier) throws Exception {
        AntecedentsFamiliaux antecedents = dossier.getAntecedentsFamiliaux();
        if (antecedents == null) {
            antecedents = new AntecedentsFamiliaux();
            antecedents.setDossierMedicale(dossier);
        } else {
            antecedents.setAscendants(decryptIfNotNull(antecedents.getAscendants()));
            antecedents.setConjoint(decryptIfNotNull(antecedents.getConjoint()));
            antecedents.setCollateraux(decryptIfNotNull(antecedents.getCollateraux()));
            antecedents.setEnfants(decryptIfNotNull(antecedents.getEnfants()));
        }
        return antecedents;
    }


    public void updateByJockeyId(Long jockeyId, AntecedentsFamiliaux antecedentsRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(jockeyId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));

        antecedentsRequest.setDossierMedicale(dossier);
        antecedentsRequest.setAscendants(encryptIfNotNull(antecedentsRequest.getAscendants()));
        antecedentsRequest.setConjoint(encryptIfNotNull(antecedentsRequest.getConjoint()));
        antecedentsRequest.setCollateraux(encryptIfNotNull(antecedentsRequest.getCollateraux()));
        antecedentsRequest.setEnfants(encryptIfNotNull(antecedentsRequest.getEnfants()));

        antecedentsFamiliauxRepo.save(antecedentsRequest);
    }


}
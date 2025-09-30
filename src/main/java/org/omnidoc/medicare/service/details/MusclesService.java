package org.omnidoc.medicare.service.details;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.details.Muscles;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.MusclesRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;

import static org.omnidoc.medicare.utils.Util.decryptIfNotNull;
import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class MusclesService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final MusclesRepo musclesRepo;
    private final AccessService accessService;

    public MusclesService(DossierMedicaleRepo dossierMedicaleRepo, MusclesRepo musclesRepo, AccessService accessService) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.musclesRepo = musclesRepo;
        this.accessService = accessService;
    }

    public Muscles fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateMuscles(dossier);
    }

    public Muscles fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.findById(dossierId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return getOrCreateMuscles(dossier);
    }

    private Muscles getOrCreateMuscles(DossierMedicale dossier) throws Exception {
        Muscles muscles = dossier.getMuscles();

        muscles.setEquilibre(decryptIfNotNull(muscles.getEquilibre()));
        muscles.setStationDebout(decryptIfNotNull(muscles.getStationDebout()));
        muscles.setMouvementsTronc(decryptIfNotNull(muscles.getMouvementsTronc()));
        muscles.setMouvementsMiBassin(decryptIfNotNull(muscles.getMouvementsMiBassin()));
        muscles.setValeurMusculaireTronc(decryptIfNotNull(muscles.getValeurMusculaireTronc()));
        muscles.setValeurMusculaireMiBassin(decryptIfNotNull(muscles.getValeurMusculaireMiBassin()));
        return muscles;
    }

    public void updateByPatientId(Long patientId, Muscles musclesRequest) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId).orElseThrow(() -> new ApiException("Dossier médical introuvable"));

        musclesRequest.setDossierMedicale(dossier);
        musclesRequest.setEquilibre(encryptIfNotNull(musclesRequest.getEquilibre()));
        musclesRequest.setStationDebout(encryptIfNotNull(musclesRequest.getStationDebout()));
        musclesRequest.setMouvementsTronc(encryptIfNotNull(musclesRequest.getMouvementsTronc()));
        musclesRequest.setMouvementsMiBassin(encryptIfNotNull(musclesRequest.getMouvementsMiBassin()));
        musclesRequest.setValeurMusculaireTronc(encryptIfNotNull(musclesRequest.getValeurMusculaireTronc()));
        musclesRequest.setValeurMusculaireMiBassin(encryptIfNotNull(musclesRequest.getValeurMusculaireMiBassin()));

        musclesRepo.save(musclesRequest);
    }
}

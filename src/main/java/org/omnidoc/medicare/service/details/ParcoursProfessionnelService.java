package org.omnidoc.medicare.service.details;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.details.ParcoursProfessionnel;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.ParcoursProfessionnelRepo;
import org.omnidoc.medicare.service.users.AccessService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ParcoursProfessionnelService {

    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final ParcoursProfessionnelRepo parcoursProfessionnelRepo;
    private final AccessService accessService;

    public ParcoursProfessionnelService(
            DossierMedicaleRepo dossierMedicaleRepo,
            ParcoursProfessionnelRepo parcoursProfessionnelRepo,
            AccessService accessService
    ) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.parcoursProfessionnelRepo = parcoursProfessionnelRepo;
        this.accessService = accessService;
    }

    public List<ParcoursProfessionnel> fetchByPatientId(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);
        DossierMedicale dossier = dossierMedicaleRepo
                .getDossierMedicalesByPatient_idAndIsCurrentTrue(patientId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return dossier.getParcoursProfessionnels();
    }

    public List<ParcoursProfessionnel> fetchByDossierId(Long dossierId) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .findById(dossierId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        return dossier.getParcoursProfessionnels();
    }

    public ParcoursProfessionnel addParcoursProfessionnel(Long dossierId, ParcoursProfessionnel parcoursProfessionnel) throws Exception {
        DossierMedicale dossier = dossierMedicaleRepo
                .findTopByPatient_IdOrderByDateDesc(dossierId)
                .orElseThrow(() -> new ApiException("Dossier médical introuvable"));
        parcoursProfessionnel.setDossierMedicale(dossier);
        return parcoursProfessionnelRepo.save(parcoursProfessionnel);
    }

    public ParcoursProfessionnel updateParcoursProfessionnel(Long id, ParcoursProfessionnel updatedParcoursProfessionnel) throws Exception {
        ParcoursProfessionnel existingParcoursProfessionnel = parcoursProfessionnelRepo
                .findById(id)
                .orElseThrow(() -> new ApiException("Parcours Professionnel introuvable"));

        existingParcoursProfessionnel.setDebut(updatedParcoursProfessionnel.getDebut());
        existingParcoursProfessionnel.setFin(updatedParcoursProfessionnel.getFin());

        return parcoursProfessionnelRepo.save(existingParcoursProfessionnel);
    }

    public void deleteParcoursProfessionnel(Long id) {
        parcoursProfessionnelRepo.deleteById(id);
    }

}
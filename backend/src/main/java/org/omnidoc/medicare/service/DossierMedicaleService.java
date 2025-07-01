package org.omnidoc.medicare.service;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.service.users.UserService;
import org.springframework.stereotype.Service;

@Service
public class DossierMedicaleService {
    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final UserService userService;

    public DossierMedicaleService(DossierMedicaleRepo dossierMedicaleRepo, UserService userService) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.userService = userService;
    }

    public DossierMedicale findDossierMedicaleByUser(Long patientId){
        return  dossierMedicaleRepo.findByPatient_Id(patientId);
    }

    public void deleteByUser(Long userId){
        userService.deleteUser(userId);
    }

}

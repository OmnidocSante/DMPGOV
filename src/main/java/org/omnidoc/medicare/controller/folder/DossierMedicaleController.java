package org.omnidoc.medicare.controller.folder;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.service.DossierMedicaleService;
import org.omnidoc.medicare.service.users.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/medicalFolder")
public class DossierMedicaleController {
    private final DossierMedicaleService dossierMedicaleService;
    private final UserService userService;

    public DossierMedicaleController(DossierMedicaleService dossierMedicaleService, UserService userService) {
        this.dossierMedicaleService = dossierMedicaleService;
        this.userService = userService;
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<DossierMedicale> getByPatient(@PathVariable Long patientId){
        return  new ResponseEntity<>(dossierMedicaleService.findDossierMedicaleByUser(patientId), HttpStatus.OK);

    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteById(@PathVariable Long userId){
        userService.deleteUser(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/dossier/{id}")
    public ResponseEntity<Void> deleteByDossierId(@PathVariable Long id){
        userService.deleteDossier(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}

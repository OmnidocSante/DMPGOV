package org.omnidoc.medicare.controller.folder.details;

import org.omnidoc.medicare.entity.folder.details.ParcoursProfessionnel;
import org.omnidoc.medicare.service.details.ParcoursProfessionnelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parcours-professionnel")
public class ParcoursProfessionnelController {

    private final ParcoursProfessionnelService parcoursProfessionnelService;

    public ParcoursProfessionnelController(ParcoursProfessionnelService parcoursProfessionnelService) {
        this.parcoursProfessionnelService = parcoursProfessionnelService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ParcoursProfessionnel>> getParcoursProfessionnelByPatientId(@PathVariable Long patientId) throws Exception {
        List<ParcoursProfessionnel> parcoursProfessionnels = parcoursProfessionnelService.fetchByPatientId(patientId);
        return new ResponseEntity<>(parcoursProfessionnels, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<ParcoursProfessionnel>> getParcoursProfessionnelByDossierId(@PathVariable Long dossierId) throws Exception {
        List<ParcoursProfessionnel> parcoursProfessionnels = parcoursProfessionnelService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(parcoursProfessionnels, HttpStatus.OK);
    }

    @PostMapping("/patient/{dossierId}")
    public ResponseEntity<ParcoursProfessionnel> addParcoursProfessionnel(
            @PathVariable Long dossierId,
            @RequestBody ParcoursProfessionnel parcoursProfessionnel
    ) throws Exception {
        ParcoursProfessionnel newParcoursProfessionnel = parcoursProfessionnelService.addParcoursProfessionnel(dossierId, parcoursProfessionnel);
        return new ResponseEntity<>(newParcoursProfessionnel, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParcoursProfessionnel> updateParcoursProfessionnel(
            @PathVariable Long id,
            @RequestBody ParcoursProfessionnel parcoursProfessionnel
    ) throws Exception {
        ParcoursProfessionnel updatedParcoursProfessionnel = parcoursProfessionnelService.updateParcoursProfessionnel(id, parcoursProfessionnel);
        return new ResponseEntity<>(updatedParcoursProfessionnel, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcoursProfessionnel(@PathVariable Long id) {
        parcoursProfessionnelService.deleteParcoursProfessionnel(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
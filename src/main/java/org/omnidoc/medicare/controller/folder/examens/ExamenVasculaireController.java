package org.omnidoc.medicare.controller.folder.examens;

import org.omnidoc.medicare.entity.folder.examens.ExamenRadiologique;
import org.omnidoc.medicare.entity.folder.examens.ExamenVasculaire;
import org.omnidoc.medicare.service.examens.ExamenRadiologiqueService;
import org.omnidoc.medicare.service.examens.ExamenVasculaireService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/examens/vasculaire")
public class ExamenVasculaireController {

    private final ExamenVasculaireService examenVasculaireService;

    public ExamenVasculaireController(ExamenVasculaireService examenVasculaireService) {
        this.examenVasculaireService = examenVasculaireService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ExamenVasculaire> getExamenRadiologiqueByPatientId(@PathVariable Long patientId) throws Exception {
        ExamenVasculaire examenRadiologique = examenVasculaireService.fetchByPatientId(patientId);
        return new ResponseEntity<>(examenRadiologique, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<ExamenVasculaire> getExamenRadiologiqueByDossierId(@PathVariable Long dossierId) throws Exception {
        ExamenVasculaire examenRadiologique = examenVasculaireService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(examenRadiologique, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateExamenRadiologiqueByPatientId(
            @PathVariable Long patientId,
            @RequestBody ExamenVasculaire examenRadiologiqueRequest
    ) throws Exception {
        examenVasculaireService.updateByPatientId(patientId, examenRadiologiqueRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
package org.omnidoc.medicare.controller.folder.examens;

import org.omnidoc.medicare.entity.folder.examens.ExamenAppareilGenitoUrinaire;
import org.omnidoc.medicare.service.examens.ExamenAppareilGenitoUrinaireService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/examens/genito-urinaire")
public class ExamenAppareilGenitoUrinaireController {

    private final ExamenAppareilGenitoUrinaireService examenAppareilGenitoUrinaireService;

    public ExamenAppareilGenitoUrinaireController(ExamenAppareilGenitoUrinaireService examenAppareilGenitoUrinaireService) {
        this.examenAppareilGenitoUrinaireService = examenAppareilGenitoUrinaireService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ExamenAppareilGenitoUrinaire> getExamenAppareilGenitoUrinaireByPatientId(@PathVariable Long patientId) throws Exception {
        ExamenAppareilGenitoUrinaire examenAppareilGenitoUrinaire = examenAppareilGenitoUrinaireService.fetchByPatientId(patientId);
        return new ResponseEntity<>(examenAppareilGenitoUrinaire, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<ExamenAppareilGenitoUrinaire> getExamenAppareilGenitoUrinaireByDossierId(@PathVariable Long dossierId) throws Exception {
        ExamenAppareilGenitoUrinaire examenAppareilGenitoUrinaire = examenAppareilGenitoUrinaireService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(examenAppareilGenitoUrinaire, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateExamenAppareilGenitoUrinaireByPatientId(
            @PathVariable Long patientId,
            @RequestBody ExamenAppareilGenitoUrinaire examenAppareilGenitoUrinaireRequest
    ) throws Exception {
        examenAppareilGenitoUrinaireService.updateByPatientId(patientId, examenAppareilGenitoUrinaireRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
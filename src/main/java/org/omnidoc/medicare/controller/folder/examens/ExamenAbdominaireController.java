package org.omnidoc.medicare.controller.folder.examens;

import org.omnidoc.medicare.entity.folder.examens.ExamenAbdominaire;
import org.omnidoc.medicare.service.examens.ExamenAbdominaireService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/examens/abdominaire")
public class ExamenAbdominaireController {

    private final ExamenAbdominaireService examenAbdominaireService;

    public ExamenAbdominaireController(ExamenAbdominaireService examenAbdominaireService) {
        this.examenAbdominaireService = examenAbdominaireService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ExamenAbdominaire> getExamenAbdominaireByPatientId(@PathVariable Long patientId) throws Exception {
        ExamenAbdominaire examenAbdominaire = examenAbdominaireService.fetchByPatientId(patientId);
        return new ResponseEntity<>(examenAbdominaire, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<ExamenAbdominaire> getExamenAbdominaireByDossierId(@PathVariable Long dossierId) throws Exception {
        ExamenAbdominaire examenAbdominaire = examenAbdominaireService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(examenAbdominaire, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateExamenAbdominaireByPatientId(
            @PathVariable Long patientId,
            @RequestBody ExamenAbdominaire examenAbdominaireRequest
    ) throws Exception {
        examenAbdominaireService.updateByPatientId(patientId, examenAbdominaireRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
package org.omnidoc.medicare.controller.folder.examens;

import org.omnidoc.medicare.entity.folder.examens.ExamenPsychotechnique;
import org.omnidoc.medicare.service.examens.ExamenPsychotechniqueService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/examens/psychotechnique")
public class ExamenPsychotechniqueController {

    private final ExamenPsychotechniqueService examenPsychotechniqueService;

    public ExamenPsychotechniqueController(ExamenPsychotechniqueService examenPsychotechniqueService) {
        this.examenPsychotechniqueService = examenPsychotechniqueService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ExamenPsychotechnique> getExamenPsychotechniqueByPatientId(@PathVariable Long patientId) throws Exception {
        ExamenPsychotechnique examenPsychotechnique = examenPsychotechniqueService.fetchByPatientId(patientId);
        return new ResponseEntity<>(examenPsychotechnique, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<ExamenPsychotechnique> getExamenPsychotechniqueByDossierId(@PathVariable Long dossierId) throws Exception {
        ExamenPsychotechnique examenPsychotechnique = examenPsychotechniqueService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(examenPsychotechnique, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateExamenPsychotechniqueByPatientId(
            @PathVariable Long patientId,
            @RequestBody ExamenPsychotechnique examenPsychotechniqueRequest
    ) throws Exception {
        examenPsychotechniqueService.updateByPatientId(patientId, examenPsychotechniqueRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
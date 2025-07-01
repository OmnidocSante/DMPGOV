package org.omnidoc.medicare.controller.folder.examens;

import org.omnidoc.medicare.entity.folder.examens.ExamenRadiologique;
import org.omnidoc.medicare.service.examens.ExamenRadiologiqueService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/examens/radiologique")
public class ExamenRadiologiqueController {

    private final ExamenRadiologiqueService examenRadiologiqueService;

    public ExamenRadiologiqueController(ExamenRadiologiqueService examenRadiologiqueService) {
        this.examenRadiologiqueService = examenRadiologiqueService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ExamenRadiologique> getExamenRadiologiqueByPatientId(@PathVariable Long patientId) throws Exception {
        ExamenRadiologique examenRadiologique = examenRadiologiqueService.fetchByPatientId(patientId);
        return new ResponseEntity<>(examenRadiologique, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<ExamenRadiologique> getExamenRadiologiqueByDossierId(@PathVariable Long dossierId) throws Exception {
        ExamenRadiologique examenRadiologique = examenRadiologiqueService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(examenRadiologique, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateExamenRadiologiqueByPatientId(
            @PathVariable Long patientId,
            @RequestBody ExamenRadiologique examenRadiologiqueRequest
    ) throws Exception {
        examenRadiologiqueService.updateByPatientId(patientId, examenRadiologiqueRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
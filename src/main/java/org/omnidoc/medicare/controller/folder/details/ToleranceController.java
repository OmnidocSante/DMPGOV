package org.omnidoc.medicare.controller.folder.details;

import org.omnidoc.medicare.entity.folder.details.Tolerance;
import org.omnidoc.medicare.service.details.ToleranceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tolerances")
public class ToleranceController {

    private final ToleranceService toleranceService;

    public ToleranceController(ToleranceService toleranceService) {
        this.toleranceService = toleranceService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Tolerance> getToleranceByPatientId(@PathVariable Long patientId) throws Exception {
        Tolerance tolerance = toleranceService.fetchByPatientId(patientId);
        return new ResponseEntity<>(tolerance, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<Tolerance> getToleranceByDossierId(@PathVariable Long dossierId) throws Exception {
        Tolerance tolerance = toleranceService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(tolerance, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateToleranceByPatientId(
            @PathVariable Long patientId,
            @RequestBody Tolerance toleranceRequest
    ) throws Exception {
        toleranceService.updateByPatientId(patientId, toleranceRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
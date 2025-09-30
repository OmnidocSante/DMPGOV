package org.omnidoc.medicare.controller.folder.examens;

import org.omnidoc.medicare.entity.folder.examens.ExamenAuditif;
import org.omnidoc.medicare.service.examens.ExamenAuditifService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/examens/auditif")
public class ExamenAuditifController {

    private final ExamenAuditifService examenAuditifService;

    public ExamenAuditifController(ExamenAuditifService examenAuditifService) {
        this.examenAuditifService = examenAuditifService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ExamenAuditif> getExamenAuditifByPatientId(@PathVariable Long patientId) throws Exception {
        ExamenAuditif examenAuditif = examenAuditifService.fetchByPatientId(patientId);
        return new ResponseEntity<>(examenAuditif, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<ExamenAuditif> getExamenAuditifByDossierId(@PathVariable Long dossierId) throws Exception {
        ExamenAuditif examenAuditif = examenAuditifService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(examenAuditif, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateExamenAuditifByPatientId(
            @PathVariable Long patientId,
            @RequestBody ExamenAuditif examenAuditifRequest
    ) throws Exception {
        examenAuditifService.updateByPatientId(patientId, examenAuditifRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
package org.omnidoc.medicare.controller.folder.details;

import org.omnidoc.medicare.enums.Status;
import org.omnidoc.medicare.service.details.HistoriqueStatusService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/historique-status")
public class HistoriqueStatusController {

    private final HistoriqueStatusService historiqueStatusService;

    public HistoriqueStatusController(HistoriqueStatusService historiqueStatusService) {
        this.historiqueStatusService = historiqueStatusService;
    }

    @PostMapping("/{patientId}")
    public ResponseEntity<Void> addStatus(
            @PathVariable Long patientId,
            @RequestParam Status status,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        historiqueStatusService.addStatus(status, patientId, jwt);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<HistoriqueStatusService.HistoriqueStatusRecord>> getStatusByJockeyId(@PathVariable Long patientId) {
        List<HistoriqueStatusService.HistoriqueStatusRecord> statuses = historiqueStatusService.getStatus(patientId);
        return new ResponseEntity<>(statuses, HttpStatus.OK);
    }

    @PostMapping(value = "/signature-certificate/{patientId}", consumes = {"multipart/form-data"})
    public ResponseEntity<byte[]> addSignatureAndCertificate(
            @RequestParam("signature") String signature,
            @RequestParam("certificateFile") MultipartFile certificateFile,
            @PathVariable Long patientId
    ) throws Exception {
        return historiqueStatusService.addSignatureAndCertificate(signature, certificateFile,patientId);
    }
}
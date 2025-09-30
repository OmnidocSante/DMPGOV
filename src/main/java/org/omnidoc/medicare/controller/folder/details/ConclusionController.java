package org.omnidoc.medicare.controller.folder.details;

import org.omnidoc.medicare.entity.folder.details.Conclusion;
import org.omnidoc.medicare.service.details.ConclusionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conclusions")
public class ConclusionController {

    private final ConclusionService conclusionService;

    public ConclusionController(ConclusionService conclusionService) {
        this.conclusionService = conclusionService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Conclusion> getConclusionByPatientId(@PathVariable Long patientId) throws Exception {
        Conclusion conclusion = conclusionService.fetchByPatientId(patientId);
        return new ResponseEntity<>(conclusion, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<Conclusion> getConclusionByDossierId(@PathVariable Long dossierId) throws Exception {
        Conclusion conclusion = conclusionService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(conclusion, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateConclusionByPatientId(
            @PathVariable Long patientId,
            @RequestBody Conclusion conclusionRequest
    ) throws Exception {
        conclusionService.updateByPatientId(patientId, conclusionRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
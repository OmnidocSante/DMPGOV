package org.omnidoc.medicare.controller.folder.antecedents;

import org.omnidoc.medicare.entity.folder.AntecedentsFamiliaux.AntecedentsFamiliaux;
import org.omnidoc.medicare.service.antecedents.AntecedentsFamiliauxService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/antecedents-familiaux")
public class AntecedentsFamiliauxController {

    private final AntecedentsFamiliauxService antecedentsFamiliauxService;

    public AntecedentsFamiliauxController(AntecedentsFamiliauxService antecedentsFamiliauxService) {
        this.antecedentsFamiliauxService = antecedentsFamiliauxService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<AntecedentsFamiliaux> getAntecedentsByPatientId(@PathVariable Long patientId) throws Exception {
        AntecedentsFamiliaux antecedents = antecedentsFamiliauxService.fetchByJockeyId(patientId);
        return new ResponseEntity<>(antecedents, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<AntecedentsFamiliaux> getAntecedentsByDossierId(@PathVariable Long dossierId) throws Exception {
        AntecedentsFamiliaux antecedents = antecedentsFamiliauxService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(antecedents, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateAntecedentsByPatientId(
            @PathVariable Long patientId,
            @RequestBody AntecedentsFamiliaux antecedentsRequest
    ) throws Exception {
        antecedentsFamiliauxService.updateByJockeyId(patientId, antecedentsRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
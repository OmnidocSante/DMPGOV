package org.omnidoc.medicare.controller.folder.details;

import org.omnidoc.medicare.entity.folder.details.OrganesSens;
import org.omnidoc.medicare.service.details.OrganesSensService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organes-sens")
public class OrganesSensController {

    private final OrganesSensService organesSensService;

    public OrganesSensController(OrganesSensService organesSensService) {
        this.organesSensService = organesSensService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<OrganesSens> getOrganesSensByPatientId(@PathVariable Long patientId) throws Exception {
        OrganesSens organesSens = organesSensService.fetchByPatientId(patientId);
        return new ResponseEntity<>(organesSens, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<OrganesSens> getOrganesSensByDossierId(@PathVariable Long dossierId) throws Exception {
        OrganesSens organesSens = organesSensService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(organesSens, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateOrganesSensByPatientId(
            @PathVariable Long patientId,
            @RequestBody OrganesSens organesSensRequest
    ) throws Exception {
        organesSensService.updateByPatientId(patientId, organesSensRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
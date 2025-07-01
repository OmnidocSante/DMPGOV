package org.omnidoc.medicare.controller.folder.details;

import org.omnidoc.medicare.entity.folder.details.PatientDetail;
import org.omnidoc.medicare.service.details.PatientDetailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient-details")
public class PatientDetailController {

    private final PatientDetailService patientDetailService;

    public PatientDetailController(PatientDetailService patientDetailService) {
        this.patientDetailService = patientDetailService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<PatientDetail> getPatientDetailByPatientId(@PathVariable Long patientId) throws Exception {
        PatientDetail patientDetail = patientDetailService.fetchByPatientId(patientId);
        return new ResponseEntity<>(patientDetail, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<PatientDetail> getPatientDetailByDossierId(@PathVariable Long dossierId) throws Exception {
        PatientDetail patientDetail = patientDetailService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(patientDetail, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updatePatientDetailByPatientId(
            @PathVariable Long patientId,
            @RequestBody PatientDetail patientDetailRequest
    ) throws Exception {
        patientDetailService.updateByPatientId(patientId, patientDetailRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
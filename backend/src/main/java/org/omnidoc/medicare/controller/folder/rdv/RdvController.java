package org.omnidoc.medicare.controller.folder.rdv;

import jakarta.validation.Valid;

import org.omnidoc.medicare.entity.rdvs.Rdv;
import org.omnidoc.medicare.enums.StatusRDV;
import org.omnidoc.medicare.records.RdvRecord;
import org.omnidoc.medicare.request.RdvRequest;
import org.omnidoc.medicare.service.rdv.RdvService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rdv")
public class RdvController {

    private final RdvService rdvService;

    public RdvController(RdvService rdvService) {
        this.rdvService = rdvService;
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createRdv(@Valid @RequestBody RdvRequest rdvRequest) {
        rdvService.createRdv(rdvRequest);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/create-by-doctor")
    public ResponseEntity<Void> createRdvByDoctor(
            @Valid @RequestBody RdvRequest rdvRequest,
            @RequestHeader("Authorization") String jwt
    ) {
        rdvService.createRdvByDoctor(rdvRequest, jwt);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/mass-create")
    public ResponseEntity<Void> massCreateRdvs(@Valid @RequestBody List<RdvRequest> rdvRequests) {
        rdvService.createRdvs(rdvRequests);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/mass-create-by-doctor")
    public ResponseEntity<Void> massCreateRdvByDoctor(
            @Valid @RequestBody List<RdvRequest> rdvRequests,
            @RequestHeader("Authorization") String jwt
    ) {
        rdvService.massCreateRdvByDoctor(rdvRequests, jwt);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RdvRecord>> getAllAppointments() {
        List<RdvRecord> appointments = rdvService.getAllAppointments();
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/doctor-appointments")
    public ResponseEntity<List<RdvRecord>> getDoctorAppointments(@RequestHeader("Authorization") String jwt) {
        List<RdvRecord> doctorAppointments = rdvService.getDoctorAppointments(jwt);
        return new ResponseEntity<>(doctorAppointments, HttpStatus.OK);
    }

    @PutMapping("/{rdvId}/status")
    public ResponseEntity<Void> changeStatusRDV(
            @PathVariable Long rdvId,
            @RequestParam StatusRDV statusRDV
    ) {
        rdvService.changeStatusRDV(statusRDV, rdvId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/latest/{patientId}")
    public ResponseEntity<RdvRecord> getLatestRdv(@PathVariable Long patientId) throws Exception {
        RdvRecord latestRdv = rdvService.getLatestRdv(patientId);
        if (latestRdv != null) {
            return new ResponseEntity<>(latestRdv, HttpStatus.OK);
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }
}
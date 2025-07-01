package org.omnidoc.medicare.controller.folder.antecedents;

import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.AntecedentsProfessionnels;
import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.Serum;
import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.Vaccination;
import org.omnidoc.medicare.service.antecedents.AntecedentsProfessionelsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/antecedents-professionnels")
public class AntecedentsProfessionnelsController {

    private final AntecedentsProfessionelsService antecedentsProfessionelsService;

    public AntecedentsProfessionnelsController(AntecedentsProfessionelsService antecedentsProfessionelsService) {
        this.antecedentsProfessionelsService = antecedentsProfessionelsService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<AntecedentsProfessionnels> getAntecedentsProfessionnelsByPatientId(@PathVariable Long patientId) throws Exception {
        AntecedentsProfessionnels antecedentsProfessionnels = antecedentsProfessionelsService.getAntecedentsProfessionnels(patientId);
        return new ResponseEntity<>(antecedentsProfessionnels, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<AntecedentsProfessionnels> getAntecedentsProfessionnelsByDossierId(@PathVariable Long dossierId) throws Exception {
        AntecedentsProfessionnels antecedentsProfessionnels = antecedentsProfessionelsService.getAntecedentsProfessionnelsByDossier(dossierId);
        return new ResponseEntity<>(antecedentsProfessionnels, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<AntecedentsProfessionnels> updateAntecedentsProfessionnels(@PathVariable Long patientId, @RequestBody AntecedentsProfessionnels updatedData) throws Exception {
        AntecedentsProfessionnels antecedentsProfessionnels = antecedentsProfessionelsService.updateAntecedentsProfessionnels(patientId, updatedData);
        return new ResponseEntity<>(antecedentsProfessionnels, HttpStatus.OK);
    }


    @GetMapping("/dossier/{dossierId}/serum")
    public ResponseEntity<List<Serum>> getSerumsByDossierId(@PathVariable Long dossierId) throws Exception {
        return new ResponseEntity<>(antecedentsProfessionelsService.getSerumByDossierId(dossierId), HttpStatus.OK);
    }

    @GetMapping("/patient/{patientId}/serum")
    public ResponseEntity<List<Serum>> getSerumsByPatientId(@PathVariable Long patientId) throws Exception {
        return new ResponseEntity<>(antecedentsProfessionelsService.getSerumByPatientId(patientId), HttpStatus.OK);
    }

    @DeleteMapping("/dossier/{dossierId}/serum/{serumId}")
    public ResponseEntity<Void> deleteSerum(@PathVariable Long dossierId, @PathVariable Long serumId) throws Exception {
        antecedentsProfessionelsService.deleteSerum(serumId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/patient/{patientId}/serum")
    public ResponseEntity<Void> addSerum(@PathVariable Long patientId, @RequestBody Serum serum) throws Exception {
        antecedentsProfessionelsService.addSerum(patientId, serum);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/patient/{patientId}/vaccinations")
    public ResponseEntity<List<Vaccination>> getVaccinations(@PathVariable Long patientId) {
        return ResponseEntity.ok(antecedentsProfessionelsService.getVaccinationByPatientId(patientId));
    }

    @PutMapping("/patient/{patientId}/vaccinations")
    public ResponseEntity<List<Vaccination>> getVaccinations(@PathVariable Long patientId, @RequestBody List<Vaccination> vaccinations) {
        antecedentsProfessionelsService.updateVaccinations(patientId, vaccinations);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
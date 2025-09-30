package org.omnidoc.medicare.controller.folder.details;

import org.omnidoc.medicare.entity.folder.details.Muscles;
import org.omnidoc.medicare.service.details.MusclesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/muscles")
public class MusclesController {

    private final MusclesService musclesService;

    public MusclesController(MusclesService musclesService) {
        this.musclesService = musclesService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Muscles> getMusclesByPatientId(@PathVariable Long patientId) throws Exception {
        Muscles muscles = musclesService.fetchByPatientId(patientId);
        return new ResponseEntity<>(muscles, HttpStatus.OK);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<Muscles> getMusclesByDossierId(@PathVariable Long dossierId) throws Exception {
        Muscles muscles = musclesService.fetchByDossierId(dossierId);
        return new ResponseEntity<>(muscles, HttpStatus.OK);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<Void> updateMusclesByPatientId(
            @PathVariable Long patientId,
            @RequestBody Muscles musclesRequest
    ) throws Exception {
        musclesService.updateByPatientId(patientId, musclesRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
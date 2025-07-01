package org.omnidoc.medicare.controller.users;


import org.omnidoc.medicare.entity.users.Patient;
import org.omnidoc.medicare.enums.PlanMedical;
import org.omnidoc.medicare.enums.Status;
import org.omnidoc.medicare.records.PatientRecord;
import org.omnidoc.medicare.service.users.PatientService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URLConnection;
import java.sql.SQLException;
import java.util.Optional;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // Get patient by ID
    @GetMapping("/{patientId}")
    public ResponseEntity<PatientRecord> getPatient(@PathVariable Long patientId) throws Exception {
        return ResponseEntity.ok(patientService.getPatient(patientId));
    }

    // Update patient info
    @PatchMapping("/{patientId}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long patientId, @RequestBody PatientRecord patientRecord) throws Exception {
        return ResponseEntity.ok(patientService.changePatient(patientRecord, patientId));
    }

    // Change status
    @PatchMapping("/{patientId}/status")
    public ResponseEntity<Void> changeStatus(@PathVariable Long patientId, @RequestParam Status status) {
        patientService.changeStatusPatient(patientId, status);
        return ResponseEntity.ok().build();
    }
    @PatchMapping("/{patientId}/plan")
    public ResponseEntity<Void> changePlanMedicale(@PathVariable Long patientId, @RequestParam PlanMedical plan) {
        patientService.changePlanMedical( plan,patientId);
        return ResponseEntity.ok().build();
    }

    // Upload image
    @PatchMapping("/{patientId}/image")
    public ResponseEntity<String> uploadImage(@PathVariable Long patientId, @RequestParam("image") MultipartFile file) throws IOException, SQLException {
        patientService.addImage(file, patientId);
        return ResponseEntity.ok("Image uploaded successfully.");
    }

    // Get image
    @GetMapping("/{patientId}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long patientId) throws SQLException, IOException {
        Optional<byte[]> imageBytesOptional = patientService.getJockeyImage(patientId);

        if (imageBytesOptional.isPresent()) {
            byte[] imageBytes = imageBytesOptional.get();
            String mimeType = URLConnection.guessContentTypeFromStream(new ByteArrayInputStream(imageBytes));
            if (mimeType == null) {
                mimeType = "application/octet-stream";
            }

            return ResponseEntity.ok().contentType(MediaType.parseMediaType(mimeType)).body(imageBytes);
        } else {

            return ResponseEntity.noContent().build();

        }
    }
}

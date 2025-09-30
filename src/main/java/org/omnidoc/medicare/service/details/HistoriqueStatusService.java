package org.omnidoc.medicare.service.details;

import org.omnidoc.medicare.entity.folder.details.HistoriqueStatus;
import org.omnidoc.medicare.entity.users.Medecin;
import org.omnidoc.medicare.entity.users.Patient;
import org.omnidoc.medicare.enums.Status;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.HistoriqueStatusRepo;
import org.omnidoc.medicare.repository.MedecinRepo;
import org.omnidoc.medicare.repository.PatientRepo;
import org.omnidoc.medicare.service.auth.JwtService;
import org.omnidoc.medicare.utils.Util;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

import static org.omnidoc.medicare.utils.Util.encryptIfNotNull;

@Service
public class HistoriqueStatusService {


    private final JwtService jwtService;
    private final PatientRepo patientRepo;
    private final MedecinRepo medecinRepo;
    private final HistoriqueStatusRepo historiqueStatusRepo;

    public HistoriqueStatusService(JwtService jwtService, PatientRepo patientRepo, MedecinRepo medecinRepo, HistoriqueStatusRepo historiqueStatusRepo) {
        this.jwtService = jwtService;
        this.patientRepo = patientRepo;
        this.medecinRepo = medecinRepo;
        this.historiqueStatusRepo = historiqueStatusRepo;
    }

    public void addStatus(Status status, Long jockeyId, String jwt) throws Exception {
        String token = jwt.substring(7);
        String username = jwtService
                .extractUsername(token);
        Patient patient = patientRepo.findById(jockeyId).orElseThrow(() -> new ApiException("jockey not found"));
        Medecin medecin = medecinRepo.findByUser_Email((username)).orElseThrow(() -> new ApiException("Doctor not found"));
        HistoriqueStatus historiqueStatus = new HistoriqueStatus();
        historiqueStatus.setPatient(patient);
        historiqueStatus.setMedecin(medecin);
        historiqueStatus.setStatus(encryptIfNotNull(status.name()));
        historiqueStatusRepo.save(historiqueStatus);

    }

    public List<HistoriqueStatusRecord> getStatus(Long jockeyId) {
        List<HistoriqueStatus> historiqueStatuses = historiqueStatusRepo.findHistoriqueStatusesByPatient_User_Id(jockeyId);

        return historiqueStatuses.stream().map(historiqueStatus -> {
            try {
                String medecinNom = "Status";
                String medecinPrenom = "Premier";

                if (historiqueStatus.getMedecin() != null && historiqueStatus.getMedecin().getUser() != null) {
                    medecinNom = Util.decryptIfNotNull(historiqueStatus.getMedecin().getUser().getNom());
                    medecinPrenom = Util.decryptIfNotNull(historiqueStatus.getMedecin().getUser().getPrénom());
                }

                String patientNom = Util.decryptIfNotNull(historiqueStatus.getPatient().getUser().getNom());
                String patientPrenom = Util.decryptIfNotNull(historiqueStatus.getPatient().getUser().getPrénom());

                return new HistoriqueStatusRecord(
                        medecinNom,
                        medecinPrenom,
                        patientNom,
                        patientPrenom,
                        historiqueStatus.getDate(),
                        Util.decryptIfNotNull(historiqueStatus.getStatus())
                );
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).toList();
    }


    public record HistoriqueStatusRecord(String doctorName, String doctorLastName, String patientName,
                                         String patientLastName, LocalDateTime date, String status) {
    }

    public ResponseEntity<byte[]> addSignatureAndCertificate(String signature, MultipartFile certificateFile, Long patientId) throws Exception {
        // Always create a new HistoriqueStatus instance
        HistoriqueStatus newHistoriqueStatus = new HistoriqueStatus();

        // Assuming HistoriqueStatus has a Patient object or patientId field — adjust as needed
        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new ApiException("Patient not found"));
        newHistoriqueStatus.setPatient(patient);

        // Set signature
        newHistoriqueStatus.setSignature(signature);

        // Set certificate
        try {
            byte[] bytes = certificateFile.getBytes();
            Blob blob = new SerialBlob(bytes);
            newHistoriqueStatus.setCertificate(blob);
        } catch (SQLException e) {
            throw new RuntimeException("Failed to store PDF certificate", e);
        }

        historiqueStatusRepo.save(newHistoriqueStatus);

        // Return the PDF
        byte[] newPdf = certificateFile.getBytes();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"certificate.pdf\"")
                .body(newPdf);
    }

}
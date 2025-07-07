package org.omnidoc.medicare.service.users;

import org.omnidoc.medicare.entity.users.Patient;
import org.omnidoc.medicare.entity.users.User;
import org.omnidoc.medicare.enums.PlanMedical;
import org.omnidoc.medicare.enums.Status;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.records.PatientRecord;
import org.omnidoc.medicare.records.UserRecord;
import org.omnidoc.medicare.repository.PatientRepo;
import org.omnidoc.medicare.utils.AESUtil;
import org.omnidoc.medicare.utils.Util;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepo patientRepo;
    private final AccessService accessService;

    public PatientService(PatientRepo patientRepo, AccessService accessService) {
        this.patientRepo = patientRepo;
        this.accessService = accessService;
    }

    public Patient changePatient(Patient patient) {
        return patientRepo.save(patient);
    }

    public PatientRecord getPatient(Long patientId) throws Exception {
        accessService.verifyAccess(patientId);

        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new ApiException("Not found"));

        User user = patient.getUser();

        UserRecord userRecord = new UserRecord(
                user.getId(),
                Util.decryptIfNotNull(user.getNom()),
                Util.decryptIfNotNull(user.getPrénom()),
                user.getSexe(),
                user.getDateNaissance(),
                Util.decryptIfNotNull(user.getMatriculeId()),
                user.getVille(),
                Util.decryptIfNotNull(user.getAdresse()),
                user.getTelephone(),
                user.getEmail(),
                user.getRole(),
                user.getDateEntree(),
                user.getProfession(),
                user.getCinId()
        );

        return new PatientRecord(
                user.getPatient().getId(),
                userRecord,
                patient.getStatus(),
                Util.decryptIfNotNull(patient.getTeguments()),
                Util.decryptIfNotNull(patient.getTaille()),
                Util.decryptIfNotNull(patient.getPoids()),
                Util.decryptIfNotNull(patient.getPerimetreThoracique()),
                patient.getPlanMedical(),
                Util.decryptIfNotNull(patient.getAtelier()),
                Util.decryptIfNotNull(patient.getEntreprise())
        );
    }


    public void changeStatusPatient(Long patientId, Status status) {
        Patient patient = patientRepo.findById(patientId).orElseThrow(() -> new ApiException("patient not found"));
        patient.setStatus(status);
        patientRepo.save(patient);
    }

    public void addImage(MultipartFile image, Long patientId) throws IOException, SQLException {
        try {
            Patient patient = patientRepo.findById(patientId).orElseThrow(() -> new ApiException("User not found"));
            byte[] imageBytes = image.getBytes();
            Blob imageBlob = new SerialBlob(imageBytes);
            patient.setImage(imageBlob);
            patientRepo.save(patient);
        } catch (Exception e) {
            throw new ApiException("erreur lors de télechargement d'image");
        }

    }


    public Optional<byte[]> getJockeyImage(Long patientId) throws SQLException, IOException {
        Patient patient = patientRepo.findById(patientId).orElseThrow(() -> new ApiException("User not found"));
        Blob imageBlob = patient.getImage();
        if (imageBlob == null || imageBlob.length() == 0) {
            return Optional.empty();
        } else {

            return Optional.of(imageBlob.getBinaryStream().readAllBytes());
        }
    }


    public Patient changePatient(PatientRecord patientRecord, Long patientId) throws Exception {
        Patient patient = patientRepo.findById(patientId).orElseThrow(() -> new ApiException("Patient not found"));

        patient.setTeguments(Util.encryptIfNotNull(patientRecord.teguments()));
        patient.setTaille(Util.encryptIfNotNull(patientRecord.taille()));
        patient.setPoids(Util.encryptIfNotNull(patientRecord.poids()));
        patient.setPerimetreThoracique(Util.encryptIfNotNull(patientRecord.perimetreThoracique()));
        patient.setPlanMedical(patientRecord.planMedical());
        patient.setAtelier(Util.encryptIfNotNull(patientRecord.atelier()));
        patient.setEntreprise(Util.encryptIfNotNull(patientRecord.entreprise()));

        return patientRepo.save(patient);
    }


    public void changePlanMedical(PlanMedical planMedical, Long patientId) {
        Patient patient = patientRepo.findById(patientId).orElseThrow();
        patient.setPlanMedical(planMedical);
        patientRepo.save(patient);
    }


}

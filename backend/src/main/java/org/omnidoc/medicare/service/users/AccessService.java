package org.omnidoc.medicare.service.users;
import org.omnidoc.medicare.entity.users.Medecin;
import org.omnidoc.medicare.entity.users.Patient;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.AccessRepo;
import org.omnidoc.medicare.repository.MedecinRepo;
import org.omnidoc.medicare.repository.PatientRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class AccessService {
    private final MedecinRepo medecinRepo;
    private final PatientRepo patientRepo;
    private final AccessRepo accessRepo;

    public AccessService(MedecinRepo medecinRepo, PatientRepo patientRepo, AccessRepo accessRepo) {
        this.medecinRepo = medecinRepo;
        this.patientRepo = patientRepo;
        this.accessRepo = accessRepo;
    }

    public void verifyAccess(Long userId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Medecin> medecin = medecinRepo.findByUser_Email(email);
        Patient patient = patientRepo.findById(userId).orElseThrow(() -> new ApiException("not found"));

        if (medecin.isPresent()) {
            boolean hasAccess = accessRepo.existsByMedecinAndPatient(medecin.get(), patient);
            if (!hasAccess) {
                throw new ApiException("not allowed");
            }
        } else {
            Patient accessPatient = patientRepo.findByUser_Email(email);
            if (!Objects.equals(accessPatient.getId(), userId)) {
                throw new ApiException("not allowed");
            }
        }
    }

}

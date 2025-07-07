package org.omnidoc.medicare.service.rdv;


import jakarta.validation.Valid;
import org.omnidoc.medicare.entity.folder.details.Access;
import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.rdvs.Rdv;
import org.omnidoc.medicare.entity.users.Medecin;
import org.omnidoc.medicare.entity.users.Patient;
import org.omnidoc.medicare.enums.StatusRDV;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.records.RdvRecord;
import org.omnidoc.medicare.repository.*;
import org.omnidoc.medicare.request.RdvRequest;
import org.omnidoc.medicare.service.auth.JwtService;
import org.omnidoc.medicare.utils.DossierMedicaleUtil;
import org.omnidoc.medicare.utils.EmailService;
import org.omnidoc.medicare.utils.Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RdvService {
    private final PatientRepo patientRepo;
    private final MedecinRepo medecinRepo;
    private final DossierMedicaleUtil dossierMedicaleUtil;
    private final AccessRepo accessRepo;
    private final RdvRepo rdvRepo;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final DossierMedicaleRepo dossierMedicaleRepo;
    private static final Logger logger = LoggerFactory.getLogger(RdvService.class);

    public RdvService(PatientRepo patientRepo, MedecinRepo medecinRepo, DossierMedicaleUtil dossierMedicaleUtil, AccessRepo accessRepo, RdvRepo rdvRepo, JwtService jwtService, EmailService emailService, DossierMedicaleRepo dossierMedicaleRepo) {
        this.patientRepo = patientRepo;
        this.medecinRepo = medecinRepo;
        this.dossierMedicaleUtil = dossierMedicaleUtil;
        this.accessRepo = accessRepo;
        this.rdvRepo = rdvRepo;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.dossierMedicaleRepo = dossierMedicaleRepo;
    }

    public void createRdv(@Valid RdvRequest rdvRequest) {

        Patient patient = patientRepo.findByUser_Id(rdvRequest.getPatientId()).orElseThrow(() -> new ApiException("Patient not found"));
        Medecin medecin = medecinRepo.findByUser_Id((rdvRequest.getMedecinId())).orElseThrow(() -> new ApiException("Medecin not found"));


        try {

            Optional<DossierMedicale> optionalDossier = dossierMedicaleRepo.findTopByPatient_IdOrderByDateDesc(patient.getId());

            if (optionalDossier.isPresent()) {
                DossierMedicale dossierMedicale = optionalDossier.get();
                if (dossierMedicale.getDate().isBefore(LocalDateTime.now().minusMonths(6))) {
                    dossierMedicaleUtil.copyDossier(patient);
                }
            } else {
                dossierMedicaleUtil.copyDossier(patient);
            }


            boolean hasAccess = accessRepo.existsByMedecinAndPatient(medecin, patient);
            if (!hasAccess) {
                Access access = new Access();
                access.setMedecin(medecin);
                access.setPatient(patient);
                accessRepo.save(access);
            }
            Rdv rdv = new Rdv();
            rdv.setDate(rdvRequest.getDate());
            rdv.setPatient(patient);
            rdv.setMedecin(medecin);
            rdvRepo.save(rdv);
//            emailService.sendEmail(medecin.getUser().getEmail(), "Nouveau rendez-vous médical programmé", "Bonjour Dr " + medecin.getUser().getNom() + ",\n\n" + "Un nouveau rendez-vous a été fixé avec le jockey " + patient.getUser().getNom() + " " + patient.getUser().getPrénom() + " le " + rdv.getDate().toString() + ".\n\n" + "Merci de bien vouloir le noter dans votre agenda.\n\n" + "Cordialement,\nL'équipe Omnidoc");


        } catch (Exception e) {
            throw new ApiException(e.getMessage());

        }

    }

    @Transactional
    public void createRdvs(@Valid List<RdvRequest> rdvRequests) {
        for (RdvRequest rdvRequest : rdvRequests) {
            try {
                if (rdvRequest.getDate() == null || rdvRequest.getDate().isBefore(LocalDateTime.now())) {
                    throw new ApiException("Appointment date is invalid or in the past for request: " + rdvRequest.toString());
                }

                Patient patient = patientRepo.findByUser_Id(rdvRequest.getPatientId()).orElseThrow(() -> new ApiException("Patient not found for ID: " + rdvRequest.getPatientId()));
                Medecin medecin = medecinRepo.findByUser_Id((rdvRequest.getMedecinId())).orElseThrow(() -> new ApiException("Medecin not found for ID: " + rdvRequest.getMedecinId()));

                Optional<DossierMedicale> optionalDossier = dossierMedicaleRepo.findTopByPatient_IdOrderByDateDesc(patient.getId());
                if (optionalDossier.isPresent()) {
                    DossierMedicale dossierMedicale = optionalDossier.get();
                    if (dossierMedicale.getDate().isBefore(LocalDateTime.now().minusMonths(6))) {
                        dossierMedicaleUtil.copyDossier(patient);
                    }
                } else {
                    dossierMedicaleUtil.copyDossier(patient);
                }

                boolean hasAccess = accessRepo.existsByMedecinAndPatient(medecin, patient);
                if (!hasAccess) {
                    Access access = new Access();
                    access.setMedecin(medecin);
                    access.setPatient(patient);
                    accessRepo.save(access);
                }

                Rdv rdv = new Rdv();
                rdv.setDate(rdvRequest.getDate());
                rdv.setPatient(patient);
                rdv.setMedecin(medecin);
                rdvRepo.save(rdv);

//                emailService.sendEmail(medecin.getUser().getEmail(), "Nouveau rendez-vous médical programmé", "Bonjour Dr " + medecin.getUser().getNom() + ",\n\n" + "Un nouveau rendez-vous a été fixé avec le jockey " + patient.getUser().getNom() + " " + patient.getUser().getPrénom() + " le " + rdv.getDate().toString() + ".\n\n" + "Merci de bien vouloir le noter dans votre agenda.\n\n" + "Cordialement,\nL'équipe Omnidoc");

            } catch (ApiException e) {
                throw e;
            } catch (Exception e) {
                throw new ApiException("An unexpected error occurred during rendez-vous creation: " + e.getMessage());
            }
        }
    }

    public List<RdvRecord> getAllAppointments() {
        return rdvRepo.findAll().stream().map(rdv -> {
            try {
                String patientNom = Util.decryptIfNotNull(rdv.getPatient().getUser().getNom());
                String patientPrenom = Util.decryptIfNotNull(rdv.getPatient().getUser().getPrénom());
                String medecinNom = Util.decryptIfNotNull(rdv.getMedecin().getUser().getNom());
                String medecinPrenom = Util.decryptIfNotNull(rdv.getMedecin().getUser().getPrénom());

                return new RdvRecord(
                        rdv.getId(),
                        rdv.getDate(),
                        patientNom,
                        patientPrenom,
                        medecinNom,
                        medecinPrenom,
                        rdv.getStatusRDV(),
                        rdv.getPatient().getId()
                );
            } catch (Exception e) {
                throw new RuntimeException("Decryption failed for appointment ID: " + rdv.getId(), e);
            }
        }).toList();
    }


    public List<RdvRecord> getDoctorAppointments(String jwt) {
        String token = jwt.substring(7);
        String username = jwtService.extractUsername(token);
        Medecin medecin = medecinRepo.findByUser_Email(username)
                .orElseThrow(() -> new ApiException("Doctor not found"));

        return rdvRepo.findRdvsByMedecin(medecin).stream().map(rdv -> {
            try {
                String patientNom = Util.decryptIfNotNull(rdv.getPatient().getUser().getNom());
                String patientPrenom = Util.decryptIfNotNull(rdv.getPatient().getUser().getPrénom());
                String medecinNom = Util.decryptIfNotNull(rdv.getMedecin().getUser().getNom());
                String medecinPrenom = Util.decryptIfNotNull(rdv.getMedecin().getUser().getPrénom());

                return new RdvRecord(
                        rdv.getId(),
                        rdv.getDate(),
                        patientNom,
                        patientPrenom,
                        medecinNom,
                        medecinPrenom,
                        rdv.getStatusRDV(),
                        rdv.getPatient().getId()
                );
            } catch (Exception e) {
                throw new RuntimeException("Decryption failed for appointment ID: " + rdv.getId(), e);
            }
        }).toList();
    }


    public void createRdvByDoctor(@Valid RdvRequest rdvRequest, String jwt) {
        String token = jwt.substring(7);
        String username = jwtService.extractUsername(token);
        Patient patient = patientRepo.findByUser_Id(rdvRequest.getPatientId()).orElseThrow(() -> new ApiException("jockey not found"));
        Medecin medecin = medecinRepo.findByUser_Email(username).orElseThrow(() -> new ApiException("Doctor not found"));

        try {

            Optional<DossierMedicale> optionalDossier = dossierMedicaleRepo.findTopByPatient_IdOrderByDateDesc(patient.getId());

            if (optionalDossier.isPresent()) {
                DossierMedicale dossierMedicale = optionalDossier.get();
                if (dossierMedicale.getDate().isBefore(LocalDateTime.now().minusMonths(6))) {
                    dossierMedicaleUtil.copyDossier(patient);
                }
            } else {
                dossierMedicaleUtil.copyDossier(patient);
            }


            boolean hasAccess = accessRepo.existsByMedecinAndPatient(medecin, patient);
            if (!hasAccess) {
                Access access = new Access();
                access.setMedecin(medecin);
                access.setPatient(patient);
                accessRepo.save(access);
            }
            Rdv rdv = new Rdv();
            rdv.setDate(rdvRequest.getDate());
            rdv.setPatient(patient);
            rdv.setMedecin(medecin);

            rdvRepo.save(rdv);
        } catch (Exception e) {
            throw new ApiException(e.getMessage());
        }
    }


    @Transactional
    public void massCreateRdvByDoctor(@Valid List<RdvRequest> rdvRequests, String jwt) {
        String token = jwt.substring(7); // Assuming "Bearer " prefix
        String username = jwtService.extractUsername(token);

        Medecin medecin = medecinRepo.findByUser_Email(username).orElseThrow(() -> {
            logger.error("Doctor not found for username: {}", username);
            return new ApiException("Doctor not found with provided credentials.");
        });

        logger.info("Starting mass creation of RDVs for doctor: {}", username);

        for (int i = 0; i < rdvRequests.size(); i++) {
            RdvRequest rdvRequest = rdvRequests.get(i);
            try {
                if (rdvRequest.getDate() == null || rdvRequest.getDate().isBefore(LocalDateTime.now())) {
                    logger.warn("Skipping RdvRequest at index {} due to invalid or past date: {}", i, rdvRequest.getDate());
                    throw new ApiException("Appointment date is invalid or in the past for request at index " + i + ": " + rdvRequest.toString());
                }

                Patient patient = patientRepo.findByUser_Id(rdvRequest.getPatientId()).orElseThrow(() -> new ApiException("Jockey not found for ID: " + rdvRequest.getPatientId()));

                Optional<DossierMedicale> optionalDossier = dossierMedicaleRepo.findTopByPatient_IdOrderByDateDesc(patient.getId());
                if (optionalDossier.isPresent()) {
                    DossierMedicale dossierMedicale = optionalDossier.get();
                    if (dossierMedicale.getDate().isBefore(LocalDateTime.now().minusMonths(6))) {
                        dossierMedicaleUtil.copyDossier(patient);
                        logger.debug("Copied dossier for patient {} as it's older than 6 months.", patient.getId());
                    }
                } else {
                    dossierMedicaleUtil.copyDossier(patient);
                    logger.debug("Created new dossier for patient {} as none existed.", patient.getId());
                }

                boolean hasAccess = accessRepo.existsByMedecinAndPatient(medecin, patient);
                if (!hasAccess) {
                    Access access = new Access();
                    access.setMedecin(medecin);
                    access.setPatient(patient);
                    accessRepo.save(access);
                    logger.info("Created access for doctor {} and patient {}.", medecin.getUser().getEmail(), patient.getUser().getNom());
                }

                Rdv rdv = new Rdv();
                rdv.setDate(rdvRequest.getDate());
                rdv.setPatient(patient);
                rdv.setMedecin(medecin);
                rdvRepo.save(rdv);
                logger.info("Successfully created Rdv for patient {} with doctor {} on {}", patient.getUser().getNom(), medecin.getUser().getNom(), rdv.getDate());


            } catch (ApiException e) {
                logger.error("Failed to create Rdv for request at index {}: {}", i, e.getMessage());
                throw e;
            } catch (Exception e) {
                logger.error("An unexpected error occurred while processing RdvRequest at index {}: {}", i, e.getMessage(), e);
                throw new ApiException("An unexpected error occurred during rendez-vous creation for request at index " + i + ": " + e.getMessage());
            }
        }
        logger.info("Mass creation of RDVs for doctor {} completed successfully (or rolled back due to error).", username);
    }


    public void changeStatusRDV(StatusRDV statusRDV, Long rdvId) {
        System.out.println(statusRDV.name());
        Rdv rdv = rdvRepo.findById(rdvId).orElseThrow(() -> new ApiException("not found"));
        rdv.setStatusRDV(statusRDV);
        rdvRepo.save(rdv);
//        if (statusRDV.equals(StatusRDV.ANNULE)) {
//            emailService.sendEmail(rdv.getMedecin().getUser().getEmail(), "Annulation rdv", "le rendez vous avec " + rdv.getPatient().getUser().getNom() + " date " + rdv.getDate().format(java.time.format.DateTimeFormatter.ofPattern("yy-MM-dd HH:mm")) + " a été annulé");
//            emailService.sendEmail(rdv.getPatient().getUser().getEmail(), "Annulation rdv", "le rendez vous avec " + rdv.getMedecin().getUser().getNom() + " date " + rdv.getDate().format(java.time.format.DateTimeFormatter.ofPattern("yy-MM-dd HH:mm")) + " a été annulé");
//        }
    }

    public RdvRecord getLatestRdv(Long id) throws Exception {
        List<Rdv> rdvs = rdvRepo.findNextPlannedRdvByPatientId(StatusRDV.PLANIFIE, id);

        if (rdvs.isEmpty()) {
            return null;
        } else {
            Rdv rdv = rdvs.getFirst();
            String patientNom = Util.decryptIfNotNull(rdv.getPatient().getUser().getNom());
            String patientPrenom = Util.decryptIfNotNull(rdv.getPatient().getUser().getPrénom());
            String medecinNom = Util.decryptIfNotNull(rdv.getMedecin().getUser().getNom());
            String medecinPrenom = Util.decryptIfNotNull(rdv.getMedecin().getUser().getPrénom());
            return new RdvRecord(rdv.getId(), rdv.getDate(), patientNom, patientPrenom, medecinNom, medecinPrenom, rdv.getStatusRDV(), rdv.getPatient().getId());
        }
    }


}
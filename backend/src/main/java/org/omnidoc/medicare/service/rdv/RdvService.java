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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
            emailService.sendEmail(medecin.getUser().getEmail(), "Nouveau rendez-vous médical programmé", "Bonjour Dr " + medecin.getUser().getNom() + ",\n\n" + "Un nouveau rendez-vous a été fixé avec le jockey " + patient.getUser().getNom() + " " + patient.getUser().getPrénom() + " le " + rdv.getDate().toString() + ".\n\n" + "Merci de bien vouloir le noter dans votre agenda.\n\n" + "Cordialement,\nL'équipe Omnidoc");


        } catch (Exception e) {
            throw new ApiException(e.getMessage());

        }

    }

    public List<RdvRecord> getAllAppointments() {
        return rdvRepo.findAll().stream().map(rdv -> new RdvRecord(rdv.getId(), rdv.getDate(), rdv.getPatient().getUser().getNom(), rdv.getPatient().getUser().getPrénom(), rdv.getMedecin().getUser().getNom(), rdv.getMedecin().getUser().getPrénom(), rdv.getStatusRDV(), rdv.getPatient().getId())).toList();
    }

    public List<RdvRecord> getDoctorAppointments(String jwt) {

        String token = jwt.substring(7);
        String username = jwtService.extractUsername(token);
        Medecin medecin = medecinRepo.findByUser_Email(username).orElseThrow(() -> new ApiException("Doctor not found"));

        return rdvRepo.findRdvsByMedecin((medecin)).stream().map(rdv -> new RdvRecord(rdv.getId(), rdv.getDate(), rdv.getPatient().getUser().getNom(), rdv.getPatient().getUser().getPrénom(), rdv.getMedecin().getUser().getNom(), rdv.getMedecin().getUser().getPrénom(), rdv.getStatusRDV(), rdv.getPatient().getId())).toList();


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
                // No dossier exists, create one
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

    public void changeStatusRDV(StatusRDV statusRDV, Long rdvId) {
        System.out.println(statusRDV.name());
        Rdv rdv = rdvRepo.findById(rdvId).orElseThrow(() -> new ApiException("not found"));
        rdv.setStatusRDV(statusRDV);
        rdvRepo.save(rdv);
        if (statusRDV.equals(StatusRDV.ANNULE)) {
            emailService.sendEmail(rdv.getMedecin().getUser().getEmail(), "Annulation rdv", "le rendez vous avec " + rdv.getPatient().getUser().getNom() + " date " + rdv.getDate().format(java.time.format.DateTimeFormatter.ofPattern("yy-MM-dd HH:mm")) + " a été annulé");
            emailService.sendEmail(rdv.getPatient().getUser().getEmail(), "Annulation rdv", "le rendez vous avec " + rdv.getMedecin().getUser().getNom() + " date " + rdv.getDate().format(java.time.format.DateTimeFormatter.ofPattern("yy-MM-dd HH:mm")) + " a été annulé");
        }


    }

    public RdvRecord getLatestRdv(Long id) {
        Rdv rdv = rdvRepo.findNextPlannedRdvByPatientId(StatusRDV.PLANIFIE, id).getFirst();
        return new RdvRecord(rdv.getId(), rdv.getDate(), rdv.getPatient().getUser().getNom(), rdv.getPatient().getUser().getPrénom(), rdv.getMedecin().getUser().getNom(), rdv.getMedecin().getUser().getPrénom(), rdv.getStatusRDV(), rdv.getPatient().getId());
    }


}
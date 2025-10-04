package org.omnidoc.medicare.service.users;

import lombok.RequiredArgsConstructor;
import org.omnidoc.medicare.dto.UserDTO;
import org.omnidoc.medicare.entity.users.Medecin;
import org.omnidoc.medicare.entity.users.User;
import org.omnidoc.medicare.enums.Role;
import org.omnidoc.medicare.enums.Status;
import org.omnidoc.medicare.enums.Ville;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.*;
import org.omnidoc.medicare.response.KpiResponse;
import org.omnidoc.medicare.service.auth.JwtService;
import org.omnidoc.medicare.utils.DossierMedicaleUtil;
import org.omnidoc.medicare.utils.EmailService;
import org.omnidoc.medicare.utils.HmacUtil;
import org.omnidoc.medicare.utils.Util;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DossierMedicaleUtil dossierMedicaleUtil;
    private final UserRepo userRepo;
    private final MedecinRepo medecinRepo;
    private final EmailService emailService;
    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final JwtService jwtService;
    private final PatientRepo patientRepo;
    private final RdvRepo rdvRepo;

    public KpiResponse kpiResponse() {
        KpiResponse response = new KpiResponse();

        // Count total users
        long totalUsers = userRepository.count();
        response.setUserCount(totalUsers);

        // Count total doctors
        long totalDoctors = medecinRepo.count();
        response.setDoctorCount(totalDoctors);

        // Count total patients
        long totalPatients = patientRepo.count();
        response.setPatientCount(totalPatients);

        // Count total rdvs
        long totalRdvs = rdvRepo.count();
        response.setRdvCount(totalRdvs);

        // Map of APTE / NON_APTE per ville
        Map<String, Map<String, Integer>> aptesPerVilles = new HashMap<>();

        // Single query grouping by ville and status
        List<Object[]> counts = patientRepo.countByVilleAndStatus();
        for (Object[] row : counts) {
            Ville ville = (Ville) row[0];
            Status status = (Status) row[1];
            Long count = (Long) row[2];

            aptesPerVilles.computeIfAbsent(ville.name(), k -> new HashMap<>()).put(status == Status.APTE ? "APTE" : "NON_APTE", count.intValue());
        }

        // Ensure every ville has both keys
        for (Ville ville : Ville.values()) {
            aptesPerVilles.computeIfAbsent(ville.name(), k -> new HashMap<>());
            aptesPerVilles.get(ville.name()).putIfAbsent("APTE", 0);
            aptesPerVilles.get(ville.name()).putIfAbsent("NON_APTE", 0);
        }

        response.setAptesPerVilles(aptesPerVilles);

        return response;
    }

    private String safeDecrypt(String value, String fieldName) {
        try {
            return Util.decryptIfNotNull(value);
        } catch (Exception e) {
            System.out.println("Failed to decrypt field " + fieldName + ": " + e.getMessage());
            return null;
        }
    }


    public List<UserDTO> getAllUsers() {
        return userRepository.findAllUsersNoJoins()
                .stream()
                .map(u -> {
                    try {
                        return new UserDTO(
                                u.getId(),
                                safeDecrypt(u.getNom(), "nom"),
                                safeDecrypt(u.getPrénom(), "prénom"),
                                u.getSexe(),
                                u.getDateNaissance(),
                                safeDecrypt(u.getCinId(), "cinId"),
                                safeDecrypt(u.getMatriculeId(), "matriculeId"),
                                u.getVille(),
                                safeDecrypt(u.getAdresse(), "adresse"),
                                u.getTelephone(),
                                u.getEmail(),
                                u.getRole(),
                                u.getDateEntree(),
                                safeDecrypt(u.getProfession(), "profession")
                        );
                    } catch (Exception e) {
                        System.out.println("Failed to decrypt user " + u.getId() + ": " + e.getMessage());
                        return new UserDTO(u.getId(), null, null, u.getSexe(), u.getDateNaissance(), null, null, u.getVille(), null, u.getTelephone(), u.getEmail(), u.getRole(), u.getDateEntree(), u.getProfession());
                    }

                })
                .toList();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public HashMap<String, String> getUserName(String jwt) throws Exception {
        String token = jwt.substring(7);
        String username = jwtService.extractUsername(token);
        User user = userRepo.findByEmail(username).orElseThrow(() -> new ApiException("Doctor not found"));
        HashMap<String, String> result = new HashMap<>();
        result.put("email", user.getEmail());
        result.put("firstName", Util.decryptIfNotNull(user.getNom()));
        result.put("lastName", Util.decryptIfNotNull(user.getPrénom()));
        return result;
    }


    public User saveUser(User user) throws Exception {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new ApiException("Cet email est déjà utilisé");
        }

        if (userRepo.existsByTelephone(user.getTelephone())) {
            throw new ApiException("Ce numéro de téléphone est déjà associé à un compte");
        }

        if (userRepo.existsByNomAndPrénom(user.getNom(), user.getPrénom())) {
            throw new ApiException("Un compte avec ce nom et prénom est déjà enregistré");
        }

        String rawPasswordCreationToken = UUID.randomUUID().toString();
        String encryptedToken = HmacUtil.hmac(rawPasswordCreationToken);

        user.setPasswordCreationToken(encryptedToken);
        user.setDateEntree(new Date());

        user.setNom(Util.encryptIfNotNull(user.getNom()));
        user.setPrénom(Util.encryptIfNotNull(user.getPrénom()));
        user.setMatriculeId(Util.encryptIfNotNull(user.getMatriculeId()));
        user.setAdresse(Util.encryptIfNotNull(user.getAdresse()));
        user.setCinId(Util.encryptIfNotNull(user.getCinId()));

        User createdUser = userRepo.save(user);

        String subject = "Création de votre mot de passe";
        String body = "Bonjour,\n\n" + "Un compte vient d'être créé pour vous sur notre plateforme.\n" + "Veuillez cliquer sur le lien suivant pour définir votre mot de passe :\n\n" + "http://localhost:5173/create-password?token=" + rawPasswordCreationToken + "\n\n";

//        emailService.sendEmail(user.getEmail(), subject, body);

        if (user.getRole() == Role.PATIENT) {
            dossierMedicaleUtil.createDossier(createdUser, user.getChantier());
        } else if (user.getRole() == Role.MEDECIN) {
            Medecin medecin = medecinRepo.save(new Medecin(createdUser));
        }

        return createdUser;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void deleteDossier(Long id) {
        dossierMedicaleRepo.deleteById(id);
    }

    public User editUser(Long id, User updatedUser) throws Exception {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("Utilisateur non trouvé avec l'ID: " + id));

        // Decrypt before overwriting
        String existingNom = Util.decryptIfNotNull(existingUser.getNom());
        String existingPrenom = Util.decryptIfNotNull(existingUser.getPrénom());

        String updatedNom = updatedUser.getNom();
        String updatedPrenom = updatedUser.getPrénom();

        if (!(existingNom.equals(updatedNom) && existingPrenom.equals(updatedPrenom))) {
            if (userRepo.existsByNomAndPrénom(updatedNom, updatedPrenom)) {
                throw new ApiException("Un compte avec ce nom et prénom est déjà enregistré");
            }
        }

        // Now encrypt for saving
        existingUser.setNom(Util.encryptIfNotNull(updatedNom));
        existingUser.setPrénom(Util.encryptIfNotNull(updatedPrenom));
        existingUser.setSexe(updatedUser.getSexe());
        existingUser.setDateNaissance(updatedUser.getDateNaissance());
        existingUser.setVille(updatedUser.getVille());
        existingUser.setAdresse(Util.encryptIfNotNull(updatedUser.getAdresse()));
        existingUser.setProfession(Util.encryptIfNotNull(updatedUser.getProfession()));
        existingUser.setMatriculeId(Util.encryptIfNotNull(updatedUser.getMatriculeId()));
        existingUser.setCinId(Util.encryptIfNotNull(updatedUser.getCinId()));

        if (existingUser.getEmail() != null &&
                !existingUser.getEmail().equals(updatedUser.getEmail())) {
            if (userRepo.existsByEmail(updatedUser.getEmail())) {
                throw new ApiException("Cet email est déjà utilisé par un autre compte");
            }
            existingUser.setEmail(updatedUser.getEmail());
        }

        if (existingUser.getTelephone() != null &&
                !existingUser.getTelephone().equals(updatedUser.getTelephone())) {
            if (userRepo.existsByTelephone(updatedUser.getTelephone())) {
                throw new ApiException("Ce numéro de téléphone est déjà associé à un autre compte");
            }
            existingUser.setTelephone(updatedUser.getTelephone());
        }

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        if (existingUser.getRole() != updatedUser.getRole()) {
            existingUser.setRole(updatedUser.getRole());
        }

        return userRepository.save(existingUser);
    }


    public void createPassword(String rawToken, String password) throws ApiException {
        if (rawToken == null || rawToken.isEmpty()) {
            throw new ApiException("Token manquant");

        }

        String hashedToken = HmacUtil.hmac(rawToken);

        User user = userRepo.findByPasswordCreationToken(hashedToken).orElseThrow(() -> new ApiException("Token invalide"));

        user.setPassword(passwordEncoder.encode(password));
        user.setPasswordCreationToken(null);

        userRepo.save(user);
    }

    public void resetPassword(String rawToken, String password) throws ApiException {
        if (rawToken == null || rawToken.isEmpty()) {
            throw new ApiException("Token manquant");

        }

        String hashedToken = HmacUtil.hmac(rawToken);

        User user = userRepo.findByPasswordResetToken(hashedToken).orElseThrow(() -> new ApiException("Token invalide"));

        user.setPassword(passwordEncoder.encode(password));

        user.setPasswordResetToken(null);

        userRepo.save(user);
    }

    public void sendResetCode(String email) throws ApiException {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new ApiException("Aucun utilisateur trouvé avec cet email"));

        String rawToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(HmacUtil.hmac(rawToken));
        userRepo.save(user);

        String resetLink = "http://localhost:5173/reset-password?token=" + rawToken;
        String body = "Bonjour,\n\nNous avons reçu une demande de réinitialisation...\n" + resetLink + "\n\nCordialement,\nL'équipe.";
//        emailService.sendEmail(email, "Réinitialisation de votre mot de passe", body);
    }


}

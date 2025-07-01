package org.omnidoc.medicare.service.users;

import lombok.RequiredArgsConstructor;
import org.omnidoc.medicare.entity.users.Medecin;
import org.omnidoc.medicare.entity.users.User;
import org.omnidoc.medicare.enums.Role;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.omnidoc.medicare.repository.MedecinRepo;
import org.omnidoc.medicare.repository.UserRepo;
import org.omnidoc.medicare.service.auth.JwtService;
import org.omnidoc.medicare.utils.DossierMedicaleUtil;
import org.omnidoc.medicare.utils.EmailService;
import org.omnidoc.medicare.utils.HmacUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public HashMap<String, String> getUserName(String jwt) {
        String token = jwt.substring(7);
        String username = jwtService.extractUsername(token);
        User user = userRepo.findByEmail(username).orElseThrow(() -> new ApiException("Doctor not found"));
        HashMap<String, String> result = new HashMap<>();
        result.put("firstName", user.getNom());
        result.put("lastName", user.getPrénom());
        return result;
    }



    public User saveUser(User user) throws Exception {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new ApiException("Cet email est déjà utilisé");
        }

        if (userRepo.existsByCinId(user.getCinId())) {
            throw new ApiException("Ce numéro CIN est déjà enregistré");
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

        User createdUser = userRepo.save(user);

        String subject = "Création de votre mot de passe";
        String body = "Bonjour,\n\n" + "Un compte vient d'être créé pour vous sur notre plateforme.\n" + "Veuillez cliquer sur le lien suivant pour définir votre mot de passe :\n\n" + "http://localhost:5173/create-password?token=" + rawPasswordCreationToken + "\n\n";

        emailService.sendEmail(user.getEmail(), subject, body);

        if (user.getRole() == Role.PATIENT) {
            dossierMedicaleUtil.createDossier(createdUser);

        } else if (user.getRole() == Role.MEDECIN) {
            medecinRepo.save(new Medecin(createdUser));
        }
        return user;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public void deleteDossier(Long id ){
        dossierMedicaleRepo.deleteById(id);
    }

    public User editUser(Long id, User updatedUser) throws Exception {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new ApiException("Utilisateur non trouvé avec l'ID: " + id));

        existingUser.setNom(updatedUser.getNom());
        existingUser.setPrénom(updatedUser.getPrénom());
        existingUser.setSexe(updatedUser.getSexe());
        existingUser.setDateNaissance(updatedUser.getDateNaissance());
        existingUser.setVille(updatedUser.getVille());
        existingUser.setAdresse(updatedUser.getAdresse());
        existingUser.setProfession(updatedUser.getProfession());

        if (!existingUser.getEmail().equals(updatedUser.getEmail())) {
            if (userRepo.existsByEmail(updatedUser.getEmail())) {
                throw new ApiException("Cet email est déjà utilisé par un autre compte");
            }
            existingUser.setEmail(updatedUser.getEmail());
        }

        if (!existingUser.getCinId().equals(updatedUser.getCinId())) {
            if (userRepo.existsByCinId(updatedUser.getCinId())) {
                throw new ApiException("Ce numéro CIN est déjà enregistré par un autre compte");
            }
            existingUser.setCinId(updatedUser.getCinId());
        }

        if (!existingUser.getTelephone().equals(updatedUser.getTelephone())) {
            if (userRepo.existsByTelephone(updatedUser.getTelephone())) {
                throw new ApiException("Ce numéro de téléphone est déjà associé à un autre compte");
            }
            existingUser.setTelephone(updatedUser.getTelephone());
        }

        if (!(existingUser.getNom().equals(updatedUser.getNom()) && existingUser.getPrénom().equals(updatedUser.getPrénom()))) {
            if (userRepo.existsByNomAndPrénom(updatedUser.getNom(), updatedUser.getPrénom())) {
                throw new ApiException("Un compte avec ce nom et prénom est déjà enregistré");
            }
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
        emailService.sendEmail(email, "Réinitialisation de votre mot de passe", body);
    }


}

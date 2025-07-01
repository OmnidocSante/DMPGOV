package org.omnidoc.medicare.service.auth;


import org.omnidoc.medicare.entity.users.Patient;
import org.omnidoc.medicare.entity.users.User;
import org.omnidoc.medicare.enums.Role;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.PatientRepo;
import org.omnidoc.medicare.repository.UserRepo;
import org.omnidoc.medicare.response.AuthenticationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthenticationService {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PatientRepo patientRepo;

    public AuthenticationResponse login(User user) {
        User user1 = userRepo.findByEmail(user.getEmail()).orElseThrow(() -> new ApiException("Email invalide."));
        if (user1.getPassword() == null) {
            throw new ApiException("Mot de passe non encore créé. Un email contenant un lien de création de mot de passe vous a été envoyé. Veuillez consulter votre boîte mail.");
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        } catch (Exception e) {
            throw new ApiException("Email ou mot de passe invalide.");
        }

        User authenticatedUser = userRepo.findByEmail(user.getEmail()).orElseThrow(() -> new ApiException("Utilisateur introuvable."));


        Map<String, Object> role = new HashMap<>();
        role.put("role", authenticatedUser.getRole());

        if (authenticatedUser.getRole() == Role.PATIENT) {
            Patient patient = patientRepo.findByUser_Id(authenticatedUser.getId()).orElseThrow();
            role.put("id", patient.getId());
        } else {
            role.put("id", authenticatedUser.getId());
        }
        String token = jwtService.generateToken(role,authenticatedUser);

        return new AuthenticationResponse(token);
    }


}


package org.omnidoc.medicare.records;

import org.omnidoc.medicare.enums.Role;
import org.omnidoc.medicare.enums.Ville;

import java.util.Date;

public record UserRecord(
        Long id,
        String nom,
        String prénom,
        Character sexe,
        Date dateNaissance,
        String cinId,
        Ville ville,
        String adresse,
        String telephone,
        String email,
        Role role,
        Date dateEntree,
        String profession
) {}
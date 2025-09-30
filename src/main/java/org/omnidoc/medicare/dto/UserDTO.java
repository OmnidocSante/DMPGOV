package org.omnidoc.medicare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.omnidoc.medicare.enums.Role;
import org.omnidoc.medicare.enums.Ville;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String nom;
    private String prénom;
    private Character sexe;
    private Date dateNaissance;
    private String cinId;
    private String matriculeId;
    private Ville ville;
    private String adresse;
    private String telephone;
    private String email;
    private Role role;
    private Date dateEntree;
    private String profession;
}
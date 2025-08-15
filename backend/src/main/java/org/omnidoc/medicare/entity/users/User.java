package org.omnidoc.medicare.entity.users;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.omnidoc.medicare.enums.Role;
import org.omnidoc.medicare.enums.Ville;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prénom;

    @Column(nullable = false)
    private Character sexe;

    @Column(nullable = false)
    private Date dateNaissance;


    @Column(nullable = false)
    private String cinId;




    @Column(nullable = false,name = "matricule_id")
    private String matriculeId;

    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    private Ville ville;

    @Column(nullable = false)
    private String adresse;


    @Column(nullable = true)
    private String telephone;


    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @NotNull(message = "Role is required")
    @Enumerated(EnumType.STRING)
    private Role role;


    @JsonIgnore
    @Column(unique = true)
    private String passwordCreationToken;


    @JsonIgnore
    @Column(unique = true)
    private String passwordResetToken;

    @Column(nullable = false)
    private Date dateEntree;

    private String profession;

    @Transient
    private String chantier;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Patient patient;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Medecin medecin;


}

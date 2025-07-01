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


    @NotBlank(message = "Nom is required")
    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "Prénom is required")
    @Column(nullable = false)
    private String prénom;

    @NotNull(message = "Sexe is required")
    @Column(nullable = false)
    private Character sexe;

    @NotNull(message = "Date de naissance is required")
    @Past(message = "Date must be in the past")
    @Column(nullable = false)
    private Date dateNaissance;

    @NotBlank(message = "CIN is required")
    @Pattern(regexp = "^[A-Z]{1,2}\\d{6}$", message = "Invalid CIN format (e.g., A123456)")
    @Column(nullable = false)
    private String cinId;

    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    private Ville ville;

    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String adresse;


    @NotNull(message = "Phone number is required")
    @Column(nullable = false)
    private String telephone;


    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
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

    @Past(message = "Date must be in the past")
    @Column(nullable = false)
    private Date dateEntree;

    private String profession;

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

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Patient patient;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Medecin medecin;


}

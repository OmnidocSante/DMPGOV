package org.omnidoc.medicare.repository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.omnidoc.medicare.dto.UserDTO;
import org.omnidoc.medicare.entity.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email);
    Optional<User> findByPasswordCreationToken(String passwordCreationToken);
    Optional<User> findByPasswordResetToken(String passwordResetToken);
    Boolean existsByEmail(String email);

    @Query("SELECT new org.omnidoc.medicare.dto.UserDTO(u.id, u.nom, u.prénom, u.sexe, u.dateNaissance, u.cinId, u.matriculeId, u.ville, u.adresse, u.telephone, u.email, u.role, u.dateEntree, u.profession) FROM User u")
    List<UserDTO> findAllUsersNoJoins();

    Boolean existsByTelephone(@NotNull(message = "Phone number is required") String telephone);
    Boolean existsByNomAndPrénom(@NotBlank(message = "Nom is required") String nom, @NotBlank(message = "Prénom is required") String prénom);

}

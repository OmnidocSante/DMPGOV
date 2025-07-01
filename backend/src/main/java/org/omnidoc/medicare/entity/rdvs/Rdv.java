package org.omnidoc.medicare.entity.rdvs;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.omnidoc.medicare.entity.users.Medecin;
import org.omnidoc.medicare.entity.users.Patient;
import org.omnidoc.medicare.enums.StatusRDV;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "rdvs")
public class Rdv {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La date du rendez-vous est obligatoire")
    @Column(nullable = false)
    private LocalDateTime date;

    @JsonIgnore
    @NotNull(message = "Le médecin est obligatoire")
    @ManyToOne
    @JoinColumn(name = "medecin_id", referencedColumnName = "id", nullable = false)
    private Medecin medecin;

    @JsonIgnore
    @NotNull(message = "Le jockey est obligatoire")
    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", nullable = false)
    private Patient patient;

    @Enumerated(value = EnumType.STRING)
    private StatusRDV statusRDV = StatusRDV.PLANIFIE;


}
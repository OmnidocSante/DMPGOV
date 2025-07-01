package org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.omnidoc.medicare.enums.TypeVaccination;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vaccinations")

public class Vaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TypeVaccination type;

    private LocalDate date;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "antecedent_id")
    private AntecedentsProfessionnels antecedentsProfessionnels;
}

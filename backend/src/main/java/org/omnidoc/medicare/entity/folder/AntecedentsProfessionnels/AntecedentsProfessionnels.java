package org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.users.Patient;
import org.omnidoc.medicare.enums.TypeVaccination;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AntecedentsProfessionnels {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String affectionsCongenitales;
    private String maladies;
    private String interventionsChirurgicales;
    private String accidentsDuTravail;
    private String autresAccidents;
    private String maladiesProfessionnellesIndemnisables;
    private String intoxicationsNonProfessionnelles;

    @OneToMany(mappedBy = "antecedentsProfessionnels", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vaccination> vaccinations = new ArrayList<>();

    @OneToMany(mappedBy = "antecedentsProfessionnels", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Serum> serums = new ArrayList<>();

    private String IPIaccidents;
    private String IPIMaladies;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "dossier_id")
    private DossierMedicale dossierMedicale;



    @PrePersist
    public void prePersist() {
        if (vaccinations.isEmpty()) {
            for (TypeVaccination type : TypeVaccination.values()) {
                Vaccination v = new Vaccination();
                v.setType(type);
                v.setAntecedentsProfessionnels(this);
                vaccinations.add(v);
            }
        }
    }




}

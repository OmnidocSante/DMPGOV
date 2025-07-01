package org.omnidoc.medicare.entity.folder.details;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.omnidoc.medicare.entity.folder.AntecedentsFamiliaux.AntecedentsFamiliaux;
import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.AntecedentsProfessionnels;
import org.omnidoc.medicare.entity.folder.examens.*;
import org.omnidoc.medicare.entity.users.Patient;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DossierMedicale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime date;


    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private AntecedentsFamiliaux antecedentsFamiliaux;
    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private AntecedentsProfessionnels antecedentsProfessionnels;

    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private Conclusion conclusion;

    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private Muscles muscles;

    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private OrganesSens organesSens;

    @OneToMany(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<ParcoursProfessionnel> parcoursProfessionnel;

    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private PatientDetail patientDetail;

    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private ExamenAuditif examenAuditif;
    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private ExamenAbdominaire examenAbdominaire;
    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private ExamenAppareilGenitoUrinaire examenAppareilGenitoUrinaire;
    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private Tolerance tolerance;
    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private ExamenPsychotechnique examenPsychotechnique;

    @OneToOne(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private ExamenRadiologique examenRadiologique;




    @OneToMany(mappedBy = "dossierMedicale",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<ParcoursProfessionnel> parcoursProfessionnels;





    private Boolean isCurrent=true;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
}

package org.omnidoc.medicare.entity.folder.details;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.omnidoc.medicare.entity.users.Patient;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String niveauScholaire;
    private String apprentissage;
    private String CAP;
    private String gout;
    private String travailMonotone;
    private String travailAttention;
    private String travailMachine;
    private String goutResponsabilites;



    @JsonIgnore

    @OneToOne
    @JoinColumn(name = "dossier_id")
    private DossierMedicale dossierMedicale;

}

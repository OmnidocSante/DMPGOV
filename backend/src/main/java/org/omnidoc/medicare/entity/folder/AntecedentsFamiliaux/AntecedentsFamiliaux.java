package org.omnidoc.medicare.entity.folder.AntecedentsFamiliaux;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.omnidoc.medicare.entity.folder.details.DossierMedicale;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AntecedentsFamiliaux {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ascendants;
    private String conjoint;
    private String collateraux;
    private String enfants;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "dossier_id")
    private DossierMedicale dossierMedicale;


}

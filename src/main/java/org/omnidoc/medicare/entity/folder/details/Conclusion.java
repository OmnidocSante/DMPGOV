package org.omnidoc.medicare.entity.folder.details;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Conclusion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String horaireTravail;
    private String deplacements;
    private String bilangenerale;
    private String epreuves;

    @JsonIgnore

    @OneToOne
    @JoinColumn(name = "dossier_id")
    private DossierMedicale dossierMedicale;


}

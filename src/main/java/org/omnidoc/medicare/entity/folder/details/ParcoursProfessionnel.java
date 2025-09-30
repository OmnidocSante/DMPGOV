package org.omnidoc.medicare.entity.folder.details;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ParcoursProfessionnel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date debut;
    private Date fin;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "dossier_id")
    private DossierMedicale dossierMedicale;

}

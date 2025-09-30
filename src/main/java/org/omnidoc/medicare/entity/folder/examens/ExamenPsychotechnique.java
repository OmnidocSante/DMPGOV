package org.omnidoc.medicare.entity.folder.examens;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.omnidoc.medicare.entity.folder.details.DossierMedicale;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExamenPsychotechnique {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String lieu;
    private LocalDateTime date;


    @JsonIgnore

    @OneToOne
    @JoinColumn(name = "dossier_id")
    private DossierMedicale dossierMedicale;

}

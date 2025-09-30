package org.omnidoc.medicare.entity.folder.examens;


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
public class ExamenAbdominaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String abdomen;


    @JsonIgnore

    @OneToOne
    @JoinColumn(name = "dossier_id")
    private DossierMedicale dossierMedicale;




}

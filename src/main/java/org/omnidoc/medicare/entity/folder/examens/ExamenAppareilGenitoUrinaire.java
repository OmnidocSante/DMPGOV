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
public class ExamenAppareilGenitoUrinaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String albumine;
    private String sucre;
    private String regles;
    private String ganglions;
    private String urinaire;
    private String rate;
    private String glandesEndocrines;
    private String neuroPsychisme;
    private String tremblement;
    private String equilibre;
    private String reflexes;
    private String tendinaux;
    private String oculaires;


    @JsonIgnore

    @OneToOne
    @JoinColumn(name = "dossier_id")
    private DossierMedicale dossierMedicale;

    public ExamenAppareilGenitoUrinaire(DossierMedicale dossierMedicale, String oculaires, String tendinaux, String reflexes, String equilibre, String tremblement, String neuroPsychisme, String glandesEndocrines, String rate, String urinaire, String ganglions, String regles, String sucre, String albumine) {
        this.dossierMedicale = dossierMedicale;
        this.oculaires = oculaires;
        this.tendinaux = tendinaux;
        this.reflexes = reflexes;
        this.equilibre = equilibre;
        this.tremblement = tremblement;
        this.neuroPsychisme = neuroPsychisme;
        this.glandesEndocrines = glandesEndocrines;
        this.rate = rate;
        this.urinaire = urinaire;
        this.ganglions = ganglions;
        this.regles = regles;
        this.sucre = sucre;
        this.albumine = albumine;
    }
}

package org.omnidoc.medicare.entity.users;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.omnidoc.medicare.entity.folder.details.Access;
import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.entity.folder.details.HistoriqueStatus;
import org.omnidoc.medicare.entity.folder.details.ParcoursProfessionnel;
import org.omnidoc.medicare.entity.rdvs.Rdv;
import org.omnidoc.medicare.enums.PlanMedical;
import org.omnidoc.medicare.enums.Status;


import java.sql.Blob;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;

    @JsonIgnore
    @Lob
    private Blob image;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String teguments;
    private String taille;
    private String poids;
    private String perimetreThoracique;

    @Enumerated(EnumType.STRING)
    private PlanMedical planMedical;

    private String atelier;
    private String entreprise;

    private String chantier;

    @JsonIgnore
    @OneToMany(mappedBy = "patient",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<DossierMedicale> dossierMedicales;


    @OneToMany(mappedBy = "patient",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Access> accesses;


    @OneToMany(mappedBy = "patient",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<HistoriqueStatus> historiqueStatuses;


    @OneToMany(mappedBy = "patient",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Rdv> rdvs;


}

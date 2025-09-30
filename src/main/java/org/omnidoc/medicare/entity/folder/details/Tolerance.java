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
public class Tolerance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String trepidation;
    private String imtemperance;
    private String temperance;
    private String irritationsTeguments;
    private String irritantsRespiration;
    private String toxiques;


    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "dossier_id")
    private DossierMedicale dossierMedicale;




}

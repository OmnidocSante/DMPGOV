package org.omnidoc.medicare.entity.folder.details;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.omnidoc.medicare.entity.users.Medecin;
import org.omnidoc.medicare.entity.users.Patient;

import java.sql.Blob;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HistoriqueStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @CreationTimestamp
    @Column(name = "date", updatable = false)
    private LocalDateTime date;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    private String status;

    private String signature;

    @JsonIgnore
    @Lob
    private Blob certificate;

    private String comment;


}
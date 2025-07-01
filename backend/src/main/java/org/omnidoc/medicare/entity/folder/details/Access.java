package org.omnidoc.medicare.entity.folder.details;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.omnidoc.medicare.entity.users.Medecin;
import org.omnidoc.medicare.entity.users.Patient;

@Entity
@Table(name = "access")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Access {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "jockey_id")
    private Patient patient;
}
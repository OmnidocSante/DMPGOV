package org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels;


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
@Table(name = "serums")

public class Serum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String injection;
    private Date date;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "antecedent_id")
    private AntecedentsProfessionnels antecedentsProfessionnels;
}

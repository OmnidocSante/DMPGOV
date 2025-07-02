package org.omnidoc.medicare.entity.users;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.omnidoc.medicare.entity.folder.details.Access;
import org.omnidoc.medicare.entity.rdvs.Rdv;

import java.util.List;

@Entity
@Table(name = "medecins")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Medecin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id",unique = true)
    private User user;

    @OneToMany(mappedBy = "medecin",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Access> accesses;


    @OneToMany(mappedBy = "medecin",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Rdv> rdvs;

    public Medecin(User createdUser) {
        this.user = createdUser;
    }
}
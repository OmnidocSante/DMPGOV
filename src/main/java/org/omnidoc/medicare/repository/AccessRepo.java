package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.details.Access;
import org.omnidoc.medicare.entity.users.Medecin;
import org.omnidoc.medicare.entity.users.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessRepo extends JpaRepository<Access,Long> {
    Boolean existsByMedecinAndPatient(Medecin medecin, Patient patient);
}

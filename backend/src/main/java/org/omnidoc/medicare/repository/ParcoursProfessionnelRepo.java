package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.details.ParcoursProfessionnel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParcoursProfessionnelRepo extends JpaRepository<ParcoursProfessionnel,Long> {
}

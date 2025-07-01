package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.Serum;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SerumRepo extends JpaRepository<Serum,Long> {
}

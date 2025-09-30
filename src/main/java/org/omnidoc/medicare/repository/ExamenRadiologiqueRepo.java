package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.examens.ExamenRadiologique;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamenRadiologiqueRepo extends JpaRepository<ExamenRadiologique,Long> {
}

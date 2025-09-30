package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.details.Tolerance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToleranceRepo extends JpaRepository<Tolerance,Long> {
}

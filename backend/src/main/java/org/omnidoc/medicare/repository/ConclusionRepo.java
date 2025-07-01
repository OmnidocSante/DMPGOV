package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.details.Conclusion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConclusionRepo extends JpaRepository<Conclusion,Long> {
}

package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.examens.ExamenAuditif;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamenAuditifRepo extends JpaRepository<ExamenAuditif,Long> {
}

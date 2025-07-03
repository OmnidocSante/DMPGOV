package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.examens.ExamenVasculaire;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamenVasculaireRepo extends JpaRepository<ExamenVasculaire,Long> {
}

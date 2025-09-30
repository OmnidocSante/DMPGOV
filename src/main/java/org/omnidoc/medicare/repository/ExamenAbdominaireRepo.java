package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.examens.ExamenAbdominaire;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamenAbdominaireRepo extends JpaRepository<ExamenAbdominaire,Long> {
}

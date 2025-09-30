package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.Vaccination;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccinationRepo extends JpaRepository<Vaccination,Long> {
}

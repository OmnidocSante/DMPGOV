package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.details.PatientDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientDetailRepo extends JpaRepository<PatientDetail,Long> {
}

package org.omnidoc.medicare.repository;

import org.omnidoc.medicare.entity.folder.AntecedentsFamiliaux.AntecedentsFamiliaux;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AntecedentsFamiliauxRepo extends JpaRepository<AntecedentsFamiliaux,Long> {
}

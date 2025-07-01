package org.omnidoc.medicare.service.details;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.records.DossierMedicaleRecord;
import org.omnidoc.medicare.repository.DossierMedicaleRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistoriqueService {


    private final DossierMedicaleRepo dossierMedicaleRepo;

    public HistoriqueService(DossierMedicaleRepo dossierMedicaleRepo) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
    }

    public List<DossierMedicaleRecord> fetchHistorique(Long jockeyId) {
        Optional<List<DossierMedicale>> dossierMedicales = dossierMedicaleRepo.getDossierMedicalesByPatient_IdAndIsCurrentFalse(jockeyId);
        return dossierMedicales.map(medicales -> medicales.stream().map(dossierMedicale -> new DossierMedicaleRecord(dossierMedicale.getId().intValue(), dossierMedicale.getDate())).toList()).orElse(null);

    }
}

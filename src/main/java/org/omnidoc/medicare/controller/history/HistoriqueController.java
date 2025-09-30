package org.omnidoc.medicare.controller.history;

import org.omnidoc.medicare.entity.folder.details.DossierMedicale;
import org.omnidoc.medicare.records.DossierMedicaleRecord;
import org.omnidoc.medicare.service.details.HistoriqueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patient/{patientId}/historique")
public class HistoriqueController {

    private final HistoriqueService historiqueService;

    public HistoriqueController(HistoriqueService historiqueService) {
        this.historiqueService = historiqueService;
    }

    @GetMapping
    public ResponseEntity<List<DossierMedicaleRecord>> getDossiersMedicales(@PathVariable Long patientId) {
        return ResponseEntity.ok(historiqueService.fetchHistorique(patientId));
    }
}

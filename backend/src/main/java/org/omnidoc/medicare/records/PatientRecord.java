package org.omnidoc.medicare.records;

import org.omnidoc.medicare.enums.PlanMedical;
import org.omnidoc.medicare.enums.Status;

public record PatientRecord(
        Long id,
        UserRecord user,
        Status status,
        String teguments,
        String taille,
        String poids,
        String perimetreThoracique,
        PlanMedical planMedical,
        String atelier,
        String entreprise
) {}
package org.omnidoc.medicare.records;


import org.omnidoc.medicare.enums.StatusRDV;
import org.omnidoc.medicare.enums.TypeRdv;

import java.time.LocalDateTime;

public record RdvRecord(Long id, LocalDateTime dateTime, String userName, String userLastName, String doctorName,
                        String doctorLastName, StatusRDV statusRDV, Long patientId, TypeRdv typeRdv) {
}
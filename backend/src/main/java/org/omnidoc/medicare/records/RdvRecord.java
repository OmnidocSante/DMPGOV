package org.omnidoc.medicare.records;


import org.omnidoc.medicare.enums.StatusRDV;
import org.omnidoc.medicare.enums.TypeRdv;

import java.time.LocalDateTime;
import java.util.Date;

public record RdvRecord(Long id, Date dateTime, String userName, String userLastName, String doctorName,
                        String doctorLastName, StatusRDV statusRDV, Long patientId, TypeRdv typeRdv) {
}
package org.omnidoc.medicare.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KpiResponse {
    private Long doctorCount;
    private Long patientCount;
    private Long rdvCount;
    private Long userCount;
    private Map<String, Map<String, Integer>> aptesPerVilles;
}

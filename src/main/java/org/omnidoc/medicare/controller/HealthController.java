package org.omnidoc.medicare.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@PreAuthorize("hasAuthority('MEDECIN')")
@RestController
@RequestMapping("/healthcheck")
public class HealthController {

    @PreAuthorize("hasAuthority('MEDECIN')")
    @GetMapping
    public String checkHealth() {
        return "Application is running";
    }
}

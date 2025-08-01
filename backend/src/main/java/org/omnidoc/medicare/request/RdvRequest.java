package org.omnidoc.medicare.request;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.omnidoc.medicare.enums.TypeRdv;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RdvRequest {
    @Min(value = 1, message = "L'identifiant du jockey doit être valide")
    private Long patientId;

    @Min(value = 1, message = "L'identifiant du médecin doit être valide")
    private Long medecinId;

    @NotNull(message = "La date du rendez-vous est obligatoire")
    @FutureOrPresent(message = "La date du rendez-vous doit être dans le présent ou le futur")
    private Date date;

    private TypeRdv typeRdv;
}
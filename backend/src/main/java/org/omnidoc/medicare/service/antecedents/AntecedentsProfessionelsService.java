package org.omnidoc.medicare.service.antecedents;

import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.AntecedentsProfessionnels;
import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.Serum;
import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.Vaccination;
import org.omnidoc.medicare.enums.TypeVaccination;
import org.omnidoc.medicare.repository.AntecedentsProfessionelsRepo;
import org.omnidoc.medicare.repository.SerumRepo;
import org.omnidoc.medicare.repository.VaccinationRepo;
import org.omnidoc.medicare.utils.Util;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AntecedentsProfessionelsService {

    private final AntecedentsProfessionelsRepo antecedentsProfessionelsRepo;
    private final VaccinationRepo vaccinationRepo;
    private final SerumRepo serumRepo;

    public AntecedentsProfessionelsService(AntecedentsProfessionelsRepo antecedentsProfessionelsRepo, VaccinationRepo vaccinationRepo, SerumRepo serumRepo) {
        this.antecedentsProfessionelsRepo = antecedentsProfessionelsRepo;
        this.vaccinationRepo = vaccinationRepo;
        this.serumRepo = serumRepo;
    }

    public AntecedentsProfessionnels getAntecedentsProfessionnels(Long patientId) throws Exception {
        AntecedentsProfessionnels antecedentsProfessionnels = antecedentsProfessionelsRepo.findByDossierMedicale_Patient_IdAndDossierMedicale_IsCurrent(patientId, true);
        return getAntecedentsProfessionnels(antecedentsProfessionnels);
    }

    public AntecedentsProfessionnels getAntecedentsProfessionnelsByDossier(Long dossierId) throws Exception {
        AntecedentsProfessionnels antecedentsProfessionnels = antecedentsProfessionelsRepo.findByDossierMedicale_Id(dossierId).orElseThrow();
        return getAntecedentsProfessionnels(antecedentsProfessionnels);
    }

    private AntecedentsProfessionnels getAntecedentsProfessionnels(AntecedentsProfessionnels antecedentsProfessionnels) throws Exception {
        antecedentsProfessionnels.setAffectionsCongenitales(Util.decryptIfNotNull(antecedentsProfessionnels.getIntoxicationsNonProfessionnelles()));
        antecedentsProfessionnels.setMaladies(Util.decryptIfNotNull(antecedentsProfessionnels.getMaladies()));
        antecedentsProfessionnels.setInterventionsChirurgicales(Util.decryptIfNotNull(antecedentsProfessionnels.getInterventionsChirurgicales()));
        antecedentsProfessionnels.setAccidentsDuTravail(Util.decryptIfNotNull(antecedentsProfessionnels.getAccidentsDuTravail()));
        antecedentsProfessionnels.setAutresAccidents(Util.decryptIfNotNull(antecedentsProfessionnels.getAutresAccidents()));
        antecedentsProfessionnels.setMaladiesProfessionnellesIndemnisables(Util.decryptIfNotNull(antecedentsProfessionnels.getMaladiesProfessionnellesIndemnisables()));
        antecedentsProfessionnels.setIntoxicationsNonProfessionnelles(Util.decryptIfNotNull(antecedentsProfessionnels.getIntoxicationsNonProfessionnelles()));
        antecedentsProfessionnels.setIPIaccidents(Util.decryptIfNotNull(antecedentsProfessionnels.getIPIaccidents()));
        antecedentsProfessionnels.setIPIMaladies(Util.decryptIfNotNull(antecedentsProfessionnels.getIPIMaladies()));
        return antecedentsProfessionnels;
    }

    public AntecedentsProfessionnels updateAntecedentsProfessionnels(Long dossierId, AntecedentsProfessionnels updatedData) throws Exception {
        AntecedentsProfessionnels existing = antecedentsProfessionelsRepo.findByDossierMedicale_Id(dossierId).orElseThrow(() -> new Exception("AntecedentsProfessionnels not found for dossierId: " + dossierId));

        existing.setAffectionsCongenitales(Util.encryptIfNotNull(updatedData.getAffectionsCongenitales()));
        existing.setMaladies(Util.encryptIfNotNull(updatedData.getMaladies()));
        existing.setInterventionsChirurgicales(Util.encryptIfNotNull(updatedData.getInterventionsChirurgicales()));
        existing.setAccidentsDuTravail(Util.encryptIfNotNull(updatedData.getAccidentsDuTravail()));
        existing.setAutresAccidents(Util.encryptIfNotNull(updatedData.getAutresAccidents()));
        existing.setMaladiesProfessionnellesIndemnisables(Util.encryptIfNotNull(updatedData.getMaladiesProfessionnellesIndemnisables()));
        existing.setIntoxicationsNonProfessionnelles(Util.encryptIfNotNull(updatedData.getIntoxicationsNonProfessionnelles()));
        existing.setIPIaccidents(Util.encryptIfNotNull(updatedData.getIPIaccidents()));
        existing.setIPIMaladies(Util.encryptIfNotNull(updatedData.getIPIMaladies()));

        return antecedentsProfessionelsRepo.save(existing);
    }





    public List<Serum> getSerumByPatientId(Long patientId) throws Exception {
        List<Serum> serums = antecedentsProfessionelsRepo.findByDossierMedicale_Patient_IdAndDossierMedicale_IsCurrent(patientId, true).getSerums();

        for (Serum serum : serums) {
            serum.setInjection(Util.decryptIfNotNull(serum.getInjection()));
        }
        return serums;
    }

    public List<Serum> getSerumByDossierId(Long dossierId) {
        return antecedentsProfessionelsRepo.findByDossierMedicale_Id(dossierId).get().getSerums();
    }

    public void addSerum(Long patientId, Serum addedSerum) throws Exception {
        AntecedentsProfessionnels antecedentsProfessionnels = antecedentsProfessionelsRepo.findByDossierMedicale_Patient_IdAndDossierMedicale_IsCurrent(patientId, true);
        addedSerum.setAntecedentsProfessionnels(antecedentsProfessionnels);
        addedSerum.setInjection(Util.encryptIfNotNull(addedSerum.getInjection()));
        serumRepo.save(addedSerum);
    }

    public void deleteSerum(Long serumId) {
        serumRepo.deleteById(serumId);
    }




}

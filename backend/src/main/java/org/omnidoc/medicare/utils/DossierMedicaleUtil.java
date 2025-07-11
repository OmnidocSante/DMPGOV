package org.omnidoc.medicare.utils;


import org.omnidoc.medicare.entity.folder.AntecedentsFamiliaux.AntecedentsFamiliaux;
import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.AntecedentsProfessionnels;
import org.omnidoc.medicare.entity.folder.AntecedentsProfessionnels.Vaccination;
import org.omnidoc.medicare.entity.folder.details.*;
import org.omnidoc.medicare.entity.folder.examens.*;
import org.omnidoc.medicare.entity.users.Patient;
import org.omnidoc.medicare.entity.users.User;
import org.omnidoc.medicare.enums.PlanMedical;
import org.omnidoc.medicare.enums.Status;
import org.omnidoc.medicare.exceptions.ApiException;
import org.omnidoc.medicare.repository.*;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


@Component
public class DossierMedicaleUtil {
    private final DossierMedicaleRepo dossierMedicaleRepo;
    private final AntecedentsProfessionelsRepo antecedentsProfessionelsRepo; // These repos might become unnecessary for saving
    private final AntecedentsFamiliauxRepo antecedentsFamiliauxRepo;      // child entities if cascading works as expected.
    private final ConclusionRepo conclusionRepo;
    private final MusclesRepo musclesRepo;
    private final OrganesSensRepo organesSensRepo;
    private final PatientDetailRepo patientDetailRepo;
    private final ToleranceRepo toleranceRepo;
    private final ExamenPsychotechniqueRepo examenPsychotechniqueRepo;
    private final ExamenAuditifRepo examenAuditifRepo;
    private final ExamenAppareilGenitoUrinaireRepo examenAppareilGenitoUrinaireRepo;
    private final ExamenAbdominaireRepo examenAbdominaireRepo;
    private final PatientRepo patientRepo;
    private final HistoriqueStatusRepo historiqueStatusRepo;
    private final ExamenRadiologiqueRepo examenRadiologiqueRepo;
    private final VaccinationRepo vaccinationRepo;

    public DossierMedicaleUtil(DossierMedicaleRepo dossierMedicaleRepo, AntecedentsProfessionelsRepo antecedentsProfessionelsRepo, AntecedentsFamiliauxRepo antecedentsFamiliauxRepo, ConclusionRepo conclusionRepo, MusclesRepo musclesRepo, OrganesSensRepo organesSensRepo, PatientDetailRepo patientDetailRepo, ToleranceRepo toleranceRepo, ExamenPsychotechniqueRepo examenPsychotechniqueRepo, ExamenAuditifRepo examenAuditifRepo, ExamenAppareilGenitoUrinaireRepo examenAppareilGenitoUrinaireRepo, ExamenAbdominaireRepo examenAbdominaireRepo, PatientRepo patientRepo, HistoriqueStatusRepo historiqueStatusRepo, ExamenRadiologiqueRepo examenRadiologiqueRepo, VaccinationRepo vaccinationRepo) {
        this.dossierMedicaleRepo = dossierMedicaleRepo;
        this.antecedentsProfessionelsRepo = antecedentsProfessionelsRepo;
        this.antecedentsFamiliauxRepo = antecedentsFamiliauxRepo;
        this.conclusionRepo = conclusionRepo;
        this.musclesRepo = musclesRepo;
        this.organesSensRepo = organesSensRepo;
        this.patientDetailRepo = patientDetailRepo;
        this.toleranceRepo = toleranceRepo;
        this.examenPsychotechniqueRepo = examenPsychotechniqueRepo;
        this.examenAuditifRepo = examenAuditifRepo;
        this.examenAppareilGenitoUrinaireRepo = examenAppareilGenitoUrinaireRepo;
        this.examenAbdominaireRepo = examenAbdominaireRepo;
        this.patientRepo = patientRepo;
        this.historiqueStatusRepo = historiqueStatusRepo;
        this.examenRadiologiqueRepo = examenRadiologiqueRepo;
        this.vaccinationRepo = vaccinationRepo;
    }


    @Transactional
    public void createDossier(User createdUser, String chantier) throws Exception {
        Patient patient = new Patient();
        patient.setUser(createdUser);
        patient.setStatus(Status.A_RECLASSER);
        patient.setPlanMedical(PlanMedical.NORMAL);
        patient.setChantier(Util.encryptIfNotNull(chantier));
        patientRepo.save(patient);

        DossierMedicale dossierMedicale = new DossierMedicale();
        dossierMedicale.setPatient(patient);

        HistoriqueStatus historiqueStatus = new HistoriqueStatus();
        historiqueStatus.setStatus(Util.encryptIfNotNull(Status.A_RECLASSER.name()));
        historiqueStatus.setCertificate(null);
        historiqueStatus.setSignature(null);
        historiqueStatus.setMedecin(null);
        historiqueStatus.setPatient(patient);
        historiqueStatusRepo.save(historiqueStatus);

        AntecedentsFamiliaux antecedentsFamiliaux = new AntecedentsFamiliaux();
        antecedentsFamiliaux.setDossierMedicale(dossierMedicale);
        antecedentsFamiliaux.setAscendants(null);
        antecedentsFamiliaux.setConjoint(null);
        antecedentsFamiliaux.setCollateraux(null);
        antecedentsFamiliaux.setEnfants(null);
        // antecedentsFamiliauxRepo.save(antecedentsFamiliaux); // Removed, as it will be cascaded
        dossierMedicale.setAntecedentsFamiliaux(antecedentsFamiliaux); // Set on parent

        AntecedentsProfessionnels antecedentsProfessionnels = new AntecedentsProfessionnels();
        antecedentsProfessionnels.setDossierMedicale(dossierMedicale);
        antecedentsProfessionnels.setAffectionsCongenitales(null);
        antecedentsProfessionnels.setMaladies(null);
        antecedentsProfessionnels.setInterventionsChirurgicales(null);
        antecedentsProfessionnels.setAccidentsDuTravail(null);
        antecedentsProfessionnels.setAutresAccidents(null);
        antecedentsProfessionnels.setMaladiesProfessionnellesIndemnisables(null);
        antecedentsProfessionnels.setIntoxicationsNonProfessionnelles(null);
        antecedentsProfessionnels.setIPIMaladies(null);
        antecedentsProfessionnels.setIPIaccidents(null);
        // antecedentsProfessionelsRepo.save(antecedentsProfessionnels); // Removed
        dossierMedicale.setAntecedentsProfessionnels(antecedentsProfessionnels); // Set on parent

        Conclusion conclusion = new Conclusion();
        conclusion.setDossierMedicale(dossierMedicale);
        conclusion.setHoraireTravail(null);
        conclusion.setDeplacements(null);
        conclusion.setBilangenerale(null);
        conclusion.setEpreuves(null);
        // conclusionRepo.save(conclusion); // Removed
        dossierMedicale.setConclusion(conclusion); // Set on parent

        Muscles muscles = new Muscles();
        muscles.setDossierMedicale(dossierMedicale);
        muscles.setEquilibre(null);
        muscles.setStationDebout(null);
        muscles.setMouvementsTronc(null);
        muscles.setMouvementsMiBassin(null);
        muscles.setValeurMusculaireMiBassin(null);
        muscles.setValeurMusculaireTronc(null);
        // musclesRepo.save(muscles); // Removed, as this was the original source of the confusion and is now cascaded
        dossierMedicale.setMuscles(muscles); // <--- **Crucially added this line for Muscles**

        OrganesSens organesSens = new OrganesSens();
        organesSens.setDossierMedicale(dossierMedicale);
        organesSens.setAudition(null);
        organesSens.setVisionPres(null);
        organesSens.setVisionLoin(null);
        organesSens.setVisionCouleurs(null);
        // organesSensRepo.save(organesSens); // Removed
        dossierMedicale.setOrganesSens(organesSens); // Set on parent

        PatientDetail patientDetail = new PatientDetail();
        patientDetail.setDossierMedicale(dossierMedicale);
        patientDetail.setNiveauScholaire(null);
        patientDetail.setApprentissage(null);
        patientDetail.setCAP(null);
        patientDetail.setGout(null);
        patientDetail.setTravailAttention(null);
        patientDetail.setTravailMonotone(null);
        patientDetail.setTravailMachine(null);
        patientDetail.setGoutResponsabilites(null);
        // patientDetailRepo.save(patientDetail); // Removed
        dossierMedicale.setPatientDetail(patientDetail); // Set on parent

        Tolerance tolerance = new Tolerance();
        tolerance.setDossierMedicale(dossierMedicale);
        tolerance.setTrepidation(null);
        tolerance.setImtemperance(null);
        tolerance.setTemperance(null);
        tolerance.setIrritantsRespiration(null);
        tolerance.setIrritationsTeguments(null);
        tolerance.setToxiques(null);
        // toleranceRepo.save(tolerance); // Removed
        dossierMedicale.setTolerance(tolerance); // Set on parent

        ExamenPsychotechnique examenPsychotechnique = new ExamenPsychotechnique();
        examenPsychotechnique.setDossierMedicale(dossierMedicale);
        examenPsychotechnique.setLieu(null);
        examenPsychotechnique.setDate(null);
        // examenPsychotechniqueRepo.save(examenPsychotechnique); // Removed
        dossierMedicale.setExamenPsychotechnique(examenPsychotechnique); // Set on parent

        ExamenRadiologique examenRadiologique = new ExamenRadiologique();
        examenRadiologique.setDossierMedicale(dossierMedicale);
        examenRadiologique.setNotes(null);
        examenRadiologique.setHasPassed(null);
        dossierMedicale.setExamenRadiologique(examenRadiologique); // Set on parent

        ExamenVasculaire examenVasculaire = new ExamenVasculaire();
        examenVasculaire.setDossierMedicale(dossierMedicale);
        examenVasculaire.setVarices(null);
        examenVasculaire.setPouls(null);
        examenVasculaire.setPressionArterielle(null);
        examenVasculaire.setAppareilRespiratoire(null);
        dossierMedicale.setExamenVasculaire(examenVasculaire); // Set on parent


        ExamenAuditif examenAuditif = new ExamenAuditif();
        examenAuditif.setDossierMedicale(dossierMedicale);
        examenAuditif.setVisionDePresDroit(null);
        examenAuditif.setVisionDePresGauche(null);
        examenAuditif.setVisionDeLoinGauche(null);
        examenAuditif.setVisionDeLoinDroit(null);
        examenAuditif.setOeilDroit(null);
        examenAuditif.setOeilGauche(null);
        // examenAuditifRepo.save(examenAuditif); // Removed
        dossierMedicale.setExamenAuditif(examenAuditif); // Set on parent

        // Note: The constructor for ExamenAppareilGenitoUrinaire already sets dossierMedicale
        ExamenAppareilGenitoUrinaire examenAppareilGenitoUrinaire = new ExamenAppareilGenitoUrinaire(dossierMedicale, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // examenAppareilGenitoUrinaireRepo.save(examenAppareilGenitoUrinaire); // Removed
        dossierMedicale.setExamenAppareilGenitoUrinaire(examenAppareilGenitoUrinaire); // Set on parent

        ExamenAbdominaire examenAbdominaire = new ExamenAbdominaire();
        examenAbdominaire.setDossierMedicale(dossierMedicale);
        examenAbdominaire.setAbdomen(null);
        // examenAbdominaireRepo.save(examenAbdominaire); // Removed
        dossierMedicale.setExamenAbdominaire(examenAbdominaire); // Set on parent

        Vaccination vaccination = new Vaccination();
        vaccination.setDossierMedicale(dossierMedicale);
        vaccination.setNotes(null);
        vaccination.setIsWellVaccinated(null);
        dossierMedicale.setVaccination(vaccination);

        // --- Final Save ---
        // This single save will persist dossierMedicale AND all the child entities
        // that have been linked to it in memory, due to CascadeType.ALL.
        dossierMedicaleRepo.save(dossierMedicale);
    }

    public void copyDossier(Patient patient) {
        DossierMedicale oldDossier = dossierMedicaleRepo.getDossierMedicalesByPatient_idAndIsCurrentTrue(patient.getId()).orElseThrow(() -> new ApiException("Dossier not found"));
        dossierMedicaleRepo.deactivateOldVersions(patient.getId());
        DossierMedicale newDossier = new DossierMedicale();
        newDossier.setPatient(patient);
        newDossier.setIsCurrent(true);
        dossierMedicaleRepo.save(newDossier);
        AntecedentsFamiliaux oldAF = oldDossier.getAntecedentsFamiliaux();
        AntecedentsFamiliaux af = new AntecedentsFamiliaux();
        af.setDossierMedicale(newDossier);
        af.setAscendants(oldAF.getAscendants());
        af.setConjoint(oldAF.getConjoint());
        af.setCollateraux(oldAF.getCollateraux());
        af.setEnfants(oldAF.getEnfants());
        antecedentsFamiliauxRepo.save(af);
        AntecedentsProfessionnels oldAP = oldDossier.getAntecedentsProfessionnels();
        AntecedentsProfessionnels ap = new AntecedentsProfessionnels();
        ap.setDossierMedicale(newDossier);
        ap.setAffectionsCongenitales(oldAP.getAffectionsCongenitales());
        ap.setMaladies(oldAP.getMaladies());
        ap.setInterventionsChirurgicales(oldAP.getInterventionsChirurgicales());
        ap.setAccidentsDuTravail(oldAP.getAccidentsDuTravail());
        ap.setAutresAccidents(oldAP.getAutresAccidents());
        ap.setMaladiesProfessionnellesIndemnisables(oldAP.getMaladiesProfessionnellesIndemnisables());
        ap.setIntoxicationsNonProfessionnelles(oldAP.getIntoxicationsNonProfessionnelles());
        ap.setIPIMaladies(oldAP.getIPIMaladies());
        ap.setIPIaccidents(oldAP.getIPIaccidents());
        antecedentsProfessionelsRepo.save(ap);
        Conclusion oldC = oldDossier.getConclusion();
        Conclusion c = new Conclusion();
        c.setDossierMedicale(newDossier);
        c.setHoraireTravail(oldC.getHoraireTravail());
        c.setDeplacements(oldC.getDeplacements());
        c.setBilangenerale(oldC.getBilangenerale());
        c.setEpreuves(oldC.getEpreuves());
        conclusionRepo.save(c);
        Muscles oldM = oldDossier.getMuscles();
        Muscles m = new Muscles();
        m.setDossierMedicale(newDossier);
        m.setEquilibre(oldM.getEquilibre());
        m.setStationDebout(oldM.getStationDebout());
        m.setMouvementsTronc(oldM.getMouvementsTronc());
        m.setMouvementsMiBassin(oldM.getMouvementsMiBassin());
        m.setValeurMusculaireMiBassin(oldM.getValeurMusculaireMiBassin());
        m.setValeurMusculaireTronc(oldM.getValeurMusculaireTronc());
        musclesRepo.save(m);
        OrganesSens oldOS = oldDossier.getOrganesSens();
        OrganesSens os = new OrganesSens();
        os.setDossierMedicale(newDossier);
        os.setAudition(oldOS.getAudition());
        os.setVisionPres(oldOS.getVisionPres());
        os.setVisionLoin(oldOS.getVisionLoin());
        os.setVisionCouleurs(oldOS.getVisionCouleurs());
        organesSensRepo.save(os);
        PatientDetail oldPD = oldDossier.getPatientDetail();
        PatientDetail pd = new PatientDetail();
        pd.setDossierMedicale(newDossier);
        pd.setNiveauScholaire(oldPD.getNiveauScholaire());
        pd.setApprentissage(oldPD.getApprentissage());
        pd.setCAP(oldPD.getCAP());
        pd.setGout(oldPD.getGout());
        pd.setTravailAttention(oldPD.getTravailAttention());
        pd.setTravailMonotone(oldPD.getTravailMonotone());
        pd.setTravailMachine(oldPD.getTravailMachine());
        pd.setGoutResponsabilites(oldPD.getGoutResponsabilites());
        patientDetailRepo.save(pd);
        Tolerance oldT = oldDossier.getTolerance();
        Tolerance t = new Tolerance();
        t.setDossierMedicale(newDossier);
        t.setTrepidation(oldT.getTrepidation());
        t.setImtemperance(oldT.getImtemperance());
        t.setTemperance(oldT.getTemperance());
        t.setIrritantsRespiration(oldT.getIrritantsRespiration());
        t.setIrritationsTeguments(oldT.getIrritationsTeguments());
        t.setToxiques(oldT.getToxiques());
        toleranceRepo.save(t);
        ExamenPsychotechnique oldEP = oldDossier.getExamenPsychotechnique();
        ExamenPsychotechnique ep = new ExamenPsychotechnique();
        ep.setDossierMedicale(newDossier);
        ep.setLieu(oldEP.getLieu());
        ep.setDate(oldEP.getDate());
        examenPsychotechniqueRepo.save(ep);
        ExamenRadiologique oldER = oldDossier.getExamenRadiologique();
        ExamenRadiologique er = new ExamenRadiologique();
        er.setDossierMedicale(newDossier);
        er.setNotes(oldER.getNotes());
        er.setHasPassed(oldER.getHasPassed());

        examenRadiologiqueRepo.save(er);
        ExamenAuditif oldEA = oldDossier.getExamenAuditif();
        ExamenAuditif ea = new ExamenAuditif();
        ea.setDossierMedicale(newDossier);
        ea.setVisionDePresDroit(oldEA.getVisionDePresDroit());
        ea.setVisionDePresGauche(oldEA.getVisionDePresGauche());
        ea.setVisionDeLoinDroit(oldEA.getVisionDeLoinDroit());
        ea.setVisionDeLoinGauche(oldEA.getVisionDeLoinGauche());
        ea.setOeilDroit(oldEA.getOeilDroit());
        ea.setOeilGauche(oldEA.getOeilGauche());
        examenAuditifRepo.save(ea);

        ExamenAppareilGenitoUrinaire oldEAG = oldDossier.getExamenAppareilGenitoUrinaire();
        ExamenAppareilGenitoUrinaire eag = new ExamenAppareilGenitoUrinaire(newDossier, oldEAG.getOculaires(), oldEAG.getTendinaux(), oldEAG.getReflexes(), oldEAG.getEquilibre(), oldEAG.getTremblement(), oldEAG.getNeuroPsychisme(), oldEAG.getGlandesEndocrines(), oldEAG.getRate(), oldEAG.getUrinaire(), oldEAG.getGanglions(), oldEAG.getRegles(), oldEAG.getSucre(), oldEAG.getAlbumine());
        examenAppareilGenitoUrinaireRepo.save(eag);
        ExamenAbdominaire oldEAb = oldDossier.getExamenAbdominaire();
        ExamenAbdominaire eab = new ExamenAbdominaire();
        eab.setDossierMedicale(newDossier);
        eab.setAbdomen(oldEAb.getAbdomen());

        Vaccination vaccination = oldDossier.getVaccination();
        Vaccination vaccination1 = new Vaccination();
        vaccination1.setDossierMedicale(newDossier);
        vaccination1.setIsWellVaccinated(vaccination.getIsWellVaccinated());
        vaccination1.setNotes(vaccination.getNotes());
        vaccinationRepo.save(vaccination1);


        examenAbdominaireRepo.save(eab);
    }
}

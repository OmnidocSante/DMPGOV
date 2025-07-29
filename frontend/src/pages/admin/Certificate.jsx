import React from "react";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Font,
  Image,
} from "@react-pdf/renderer";
import roboto from "../../components/fonts/Roboto.ttf";
import robotoBold from "../../components/fonts/Roboto-Bold.ttf";
import logo from "../../assets/images/logo.png";

Font.register({
  family: "Roboto",
  src: roboto,
});

Font.register({
  family: "Roboto-Bold",
  src: robotoBold,
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 12,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: "contain",
  },
  companyInfo: {
    flex: 1,
    marginLeft: 12,
    fontSize: 10,
    textAlign: "right",
  },
  date: {
    textAlign: "right",
    marginBottom: 8,
    fontSize: 10,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    flex: 1,
    fontSize: 10,
  },
  attestation: {
    marginVertical: 8,
    fontSize: 12,
    textAlign: "justify",
  },
  footer: {
    marginTop: 16,
    fontSize: 10,
  },
  signature: {
    marginTop: 32,
    textAlign: "right",
    fontSize: 10,
  },
});

const CertificatePDF = ({
  firstName,
  lastName,
  patientFirstName,
  patientLastName,
  patientCin,
  status,
  matriculeId,
  dateNaissance,
  dateEntree,
  profession,
  signature,
  nextRdv,
}) => {
  const now = new Date();
  const formattedDate = now.toDateString("fr-FR");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.companyInfo}>
            <Text>Siège Social, Bureau & Entrepôts</Text>
            <Text>Angle rue Mohamed El Mesfioui & Corbi</Text>
            <Text>Oukacha - CP 20580 - Casablanca 05 - Maroc</Text>
            <Text>Email: somagec@somagec.ma</Text>
            <Text>Tél: (+212) 522-35-49-45 / 46 / 47</Text>
            <Text>Mobile: (+212) 661-91-22-11 /12 /13 /14 /15</Text>
            <Text>Fax: (+212) 522-35-44-24, 35-59-95</Text>
          </View>
        </View>

        <Text style={styles.date}>Date: {formattedDate}</Text>

        <Text style={styles.title}>Fiche médicale d'aptitude physique</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              Nom/Prénom: {patientLastName} {patientFirstName}
            </Text>
            <Text style={styles.tableCell}>N° Matricule: {matriculeId}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              Date de naissance: {dateNaissance}
            </Text>
            <Text style={styles.tableCell}>CIN N°: {patientCin}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Date d'embauche: {dateEntree}</Text>
            <Text style={styles.tableCell}>Fonction/Poste: {profession}</Text>
          </View>
        </View>
        <Text style={styles.title}>Attestation Medicale</Text>

        <Text style={styles.attestation}>
          Je soussigné, Dr {firstName} {lastName}, médecin de travail, certifie
          avoir examiné ce jour {patientLastName} {patientFirstName} et déclare
          après examen médical qu'il(elle) est:
          <Text
            style={{
              fontWeight: "bold",
              fontFamily: "Roboto-Bold",
            }}
          >
            {" "}
            {status === "APTE" ? "Apte" : "Non Apte"}
          </Text>
          .
        </Text>

        <View style={styles.footer}>
          <Text>Date prochaine visite le: {nextRdv}</Text>
        </View>
        <View
          style={{
            ...styles.signature,
            maxWidth: 200,
            fontSize: 8,
            alignSelf: "flex-end",
          }}
        >
          <Text style={{ textAlign: "right" }}>Signature</Text>
          <Text style={{ textAlign: "right" }}>et cachet du médecin</Text>
          {signature && (
            <Text style={{ textAlign: "right", wordWrap: "break-word" }}>
              : {signature}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CertificatePDF;

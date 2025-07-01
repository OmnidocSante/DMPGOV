import React from "react";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Font,
} from "@react-pdf/renderer";
import roboto from "../../components/fonts/Roboto.ttf";

Font.register({
  family: "Roboto",
  src: roboto,
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 14,
    lineHeight: 1.5,
    fontFamily: "Roboto",
    width: "800px",
  },
  title: {
    textAlign: "center",
    color: "#1d4ed8",
    fontSize: 20,
    fontWeight: "semibold",
    marginBottom: 64,
  },
  bodyText: {
    marginBottom: 16,
  },
  footer: {
    marginTop: 80,
  },
  signature: {
    textAlign: "right",
    paddingRight: 40,
    marginTop: 80,
  },
  signatureLabel: {
    marginBottom: 8,
  },
  signatureValue: {
    position: "absolute",
    right: 100,
    top: 30,
    maxWidth: 200,
    fontSize: 12,
    textAlign: "right",
    wordWrap: "break-word",
  },
});

const CertificatePDF = ({
  firstName,
  lastName,
  patientFirstName,
  patientLastName,
  patientCin,
  signature,
  gender,
  status,
}) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedDate = now.toLocaleDateString("fr-FR");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Certificat d’aptitude physique</Text>

        <Text style={styles.bodyText}>
          Je soussigné Dr {firstName} {lastName}, atteste par la présente avoir
          examiné {gender === "M" ? "Mr" : "Mme"} {patientFirstName}{" "}
          {patientLastName}, numéro CIN {patientCin}, certifie qu’il est
           {status == "APTE" ? " apte" : " non apte"} à exercer sa fonction de
          patient dans les courses hippiques conformément aux prérequis de la
          santé physique.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.bodyText}>
            Fait le {formattedDate}, à {formattedTime},
          </Text>
          <View style={styles.signature}>
            <Text style={styles.signatureLabel}>
              Signature et cachet du médecin
            </Text>
            {signature && (
              <Text style={styles.signatureValue}>
                {signature.substring(0, 10)}
              </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CertificatePDF;

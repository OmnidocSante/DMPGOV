import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import PasswordCreation from "./pages/auth/PasswordCreation";
import PasswordReset from "./pages/auth/PasswordReset";
import PasswordForgot from "./pages/auth/PasswordForgot";
import Unauthorized from "./pages/auth/Unauthorized";
import NotFound from "./pages/auth/NotFound";
import AdminDashboard from "./pages/admin/admin-dashboard";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import DoctorDashboard from "./pages/medecin/medecin-dashboard";
import PatientTab from "./pages/patient/PatientTab";
import AntecedentsProfessionnelsDetails from "./pages/patient/AntecedentsProfessionelsDetails";
import AntecedentsProfessionnels from "./pages/patient/AntecedentsProfessionels";
import Serums from "./pages/patient/Serums";
import Vaccinations from "./pages/patient/Vaccinations";
import AntecedentsFamiliaux from "./pages/patient/AntecedentsFamiliaux";
import Examens from "./pages/patient/Examens/examens";
import ExamenAudioVisuelle from "./pages/patient/Examens/ExamenAudioVisuelle";
import ExamenGenitoUrinaire from "./pages/patient/Examens/ExamenGenitoUrinaire";
import ToleranceDetails from "./pages/patient/Tolerance";
import ConclusionDetails from "./pages/patient/Conclusion";
import MusclesDetails from "./pages/patient/Muscles";
import PatientDetails from "./pages/patient/PatientDetails";
import ExamenPsychotechniqueDetails from "./pages/patient/Examens/ExamenPsychoTechnique";
import ParcoursProfessionnels from "./pages/patient/ParcoursProfessionel";
import ExamenAbdominaireDetails from "./pages/patient/Examens/ExamenAbdominaire";
import ExamenRadiologique from "./pages/patient/Examens/ExamenRadiologique";
import ExamenVasculaire from "./pages/patient/Examens/ExamenVasculaire";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route Component={App} path="/" />
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route Component={AdminDashboard} path="/admin" />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route Component={AdminDashboard} path="/user" />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={["MEDECIN", "PATIENT"]} />}
        >
          <Route Component={DoctorDashboard} path="/medecin" />
          <Route path="/patient/:id" Component={PatientTab} />
          <Route path="/patient/:id/examens" Component={Examens} />
          <Route
            path="/patient/:id/parcours-professionnel"
            Component={ParcoursProfessionnels}
          />
          <Route
            path="/patient/:id/examens/abdominal"
            Component={ExamenAbdominaireDetails}
          />
          <Route
            path="/patient/:id/examens/audio-visuelle"
            Component={ExamenAudioVisuelle}
          />
          <Route
            path="/patient/:id/examens/radiologique"
            Component={ExamenRadiologique}
          />
          <Route
            path="/patient/:id/examens/vasculaire"
            Component={ExamenVasculaire}
          />
          <Route
            path="/patient/:id/examens/psychotechnique"
            Component={ExamenPsychotechniqueDetails}
          />
          <Route
            path="/patient/:id/examens/genito-urinaire"
            Component={ExamenGenitoUrinaire}
          />
          <Route path="/patient/:id/tolerance" Component={ToleranceDetails} />
          <Route path="/patient/:id/muscles" Component={MusclesDetails} />
          <Route path="/patient/:id/conclusion" Component={ConclusionDetails} />
          <Route path="/patient/:id/details" Component={PatientDetails} />
          <Route
            path="/patient/:id/antecedent_professionnels/details"
            Component={AntecedentsProfessionnelsDetails}
          />
          <Route
            path="/patient/:id/antecedent_professionnels/serums"
            Component={Serums}
          />
          <Route
            path="/patient/:id/antecedent_familiaux"
            Component={AntecedentsFamiliaux}
          />
          <Route
            path="/patient/:id/antecedent_professionnels/vaccinations"
            Component={Vaccinations}
          />
          <Route
            path="/patient/:id/antecedent_professionnels"
            Component={AntecedentsProfessionnels}
          />
        </Route>

        <Route path="/login" Component={Login} />
        <Route path="/create-password" Component={PasswordCreation} />
        <Route path="/reset-password" Component={PasswordReset} />
        <Route path="/forgot-password" Component={PasswordForgot} />
        <Route path="/unauthorized" Component={Unauthorized} />
        <Route path="*" Component={NotFound} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

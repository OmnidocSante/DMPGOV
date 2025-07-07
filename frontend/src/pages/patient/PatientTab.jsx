import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  HeartPulse,
  Stethoscope,
  Pill,
  ClipboardList,
  ChevronRight,
  Pencil,
  Brush,
  FileText,
  Camera,
  LogOut,
  ShieldCheck,
  Ear,
  Dumbbell,
  Briefcase,
  Rotate3D,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Font, pdf, PDFDownloadLink } from "@react-pdf/renderer";
import roboto from "../../components/fonts/Roboto.ttf";
import CertificatePDF from "../admin/Certificate";
import instance from "../auth/AxiosInstance";
import useUser from "../auth/useUser";
import { planMedicalOptions, Status } from "@/enums/enums";
import { BiHealth } from "react-icons/bi";

export default function PatientTab() {
  const user = useUser();

  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [planMedical, setPlanMedical] = useState("");
  const [isPlanMedicalDialogOpen, setIsPlanMedicalDialogOpen] = useState(false);
  const updatePlanMedical = async () => {
    try {
      await instance.patch(`/api/patient/${id}/plan?plan=${planMedical}`);
      fetchData();
      setIsPlanMedicalDialogOpen(false);
    } catch (error) {
      console.error("Error updating medical plan:", error);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState();
  const [rdv, setRdv] = useState(null);

  const detailsSchema = z.object({
    teguments: z.string().nullable(),
    taille: z.string().nullable(),
    poids: z.string().nullable(),
    perimetreThoracique: z.string().nullable(),
    atelier: z.string().nullable(),
    entreprise: z.string().nullable(),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm({
    resolver: zodResolver(detailsSchema),
  });

  const fetchData = async () => {
    try {
      const [patientResponse, imageResponse, rdvResponse] = await Promise.all([
        instance.get(`/api/patient/${id}`, { timeout: 3000 }),
        instance.get(`/api/patient/${id}/image`, {
          responseType: "blob",
          timeout: 3000,
        }),
        // Use `validateStatus` to prevent Axios from throwing an error on 404 for rdvResponse
        // This allows you to check the status manually in the `.then()` block for this specific request
        instance.get(`/api/rdv/latest/${id}`, {
          timeout: 3000,
          validateStatus: function (status) {
            return (status >= 200 && status < 300) || status === 404; // Accept 2xx and 404
          },
        }),
      ]);

      const patientData = patientResponse.data;

      // Handle image response
      if (imageResponse.status === 204) {
        setPatient({ ...patientData, image: null });
      } else {
        const imageData = URL.createObjectURL(imageResponse.data);
        setPatient({ ...patientData, image: imageData });
      }

      // --- Handle rdvResponse specifically for 404 ---
      if (rdvResponse.status === 404) {
        // No upcoming appointment found
        console.log(`No latest RDV found for patient ${id}.`);
        setRdv(null); // Or set to a default empty object/value indicating no RDV
        // You might want to display a message to the user here
      } else if (rdvResponse.status === 200) {
        // Latest RDV found, process the data
        setRdv(rdvResponse.data);
      } else {
        // Handle other unexpected status codes for rdvResponse if necessary
        console.warn(
          `Unexpected status for RDV request: ${rdvResponse.status}`
        );
        setRdv(null); // Or handle as an error
      }

      setStatus(patientData.status);

      setValue("teguments", patientData.teguments);
      setValue("taille", patientData.taille);
      setValue("poids", patientData.poids);
      setValue("perimetreThoracique", patientData.perimetreThoracique);
      setValue("atelier", patientData.atelier);
      setValue("entreprise", patientData.entreprise);
    } catch (error) {
      // This catch block will now primarily handle network errors,
      // timeouts (ECONNABORTED), or other HTTP errors not explicitly
      // whitelisted by validateStatus for individual requests.

      console.error("Error fetching data:", error);

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          console.error("Request timed out:", error.message);
          // Specific timeout handling:
          // You could check error.config.url to see which request timed out
          // and update UI accordingly (e.g., show a loading spinner for that part).
        } else if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx (and wasn't explicitly caught by validateStatus)
          // or specific API errors like "not allowed"

          if (
            error.response.data &&
            error.response.data.message === "not allowed"
          ) {
            navigate("/unauthorized");
          } else if (
            error.response.status === 401 ||
            error.response.status === 403
          ) {
            // Handle unauthorized/forbidden errors (e.g., redirect to login)
            console.error(
              "Authentication/Authorization error:",
              error.response.status
            );
            navigate("/login"); // Or appropriate unauthorized route
          } else {
            // General HTTP error handling
            console.error(
              `HTTP error ${error.response.status}:`,
              error.response.data
            );
            // Display a generic error message to the user
          }
        } else if (error.request) {
          // The request was made but no response was received (e.g., network down)
          console.error("No response received from server.");
          // Display a network error message
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up Axios request:", error.message);
        }
      } else {
        // Non-Axios errors
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const statusColor = {
    APTE: "bg-green-100 text-green-800",
    A_RECLASSER: "bg-red-100 text-red-800",
    INAPTE_DEFINITIF: "bg-amber-100 text-amber-800",
    INAPTE_TEMPORAIRE: "bg-blue-100 text-blue-800",
  };
  const planMedicalColor = {
    NORMAL: "bg-green-100 text-green-800",
    AFFECTION_CONGENITABLE: "bg-yellow-100 text-yellow-800",
    AFFECTION_ACQUISE: "bg-red-100 text-red-800",
    AFFECTION_DECOUVERTE: "bg-blue-100 text-blue-800",
  };
  const getPlanLabel = (value) => {
    const option = planMedicalOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const onSubmit = async (data) => {
    console.log(data);

    await instance.patch(`/api/patient/${id}`, {
      ...data,
      planMedical: patient.planMedical,
    });
    setIsDialogOpen(false);
    fetchData();
  };

  Font.register({
    family: "Roboto",
    src: roboto,
  });

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const toggleStatus = async () => {
    try {
      await Promise.all([
        instance.patch(`/api/patient/${id}/status?status=${status}`),
        instance.post(`/api/historique-status/${id}?status=${status}`, {
          status,
        }),
      ]);

      fetchData();
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await instance.patch(`/api/patient/${id}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const response = await instance.get(`/api/patient/${id}/image`, {
        responseType: "blob",
      });

      if (response.status == 204) {
        setPatient({ ...patient, image: null });
      } else {
        const imageData = URL.createObjectURL(response.data);
        setPatient({ ...patient, image: imageData });
      }
      setIsImageDialogOpen(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  console.log(patient);
  

  const sendCertificate = async () => {
    const response = await instance.get("/api/users/user");

    const { firstName, lastName } = response.data;
    const signature = localStorage.getItem("token")?.split(".")[2];
    const blob = await pdf(
      <CertificatePDF
        patientFirstName={patient.user.nom}
        patientLastName={patient.user.prénom}
        gender={patient.user.sexe}
        status={patient.status}
        firstName={firstName}
        lastName={lastName}
        patientCin={patient.user.cinId}
        signature={signature}
      />
    ).toBlob();
    const formData = new FormData();
    formData.append("signature", signature);
    formData.append("certificateFile", blob);

    try {
      const response = await instance.post(
        `/api/historique-status/signature-certificate/${id}`,
        formData,
        {
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      const filenameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "certificate.pdf";

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error uploading signature or getting certificate:", error);

      if (error.response && error.response.data) {
        const reader = new FileReader();
        reader.onload = () => alert(`Server error: ${reader.result}`);
        reader.readAsText(error.response.data);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);

  const handleGenerateCertificate = () => {
    sendCertificate();
    setIsCertificateDialogOpen(true);
  };

  if (!patient) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-bay-of-many-50"
      >
        <motion.div
          className="flex flex-col items-center space-y-4 p-6 bg-white border border-bay-of-many-200 rounded-xl shadow-md"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-bay-of-many-400 border-t-transparent rounded-full animate-spin"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p className="text-bay-of-many-700 font-medium text-sm tracking-wide">
            Chargement du profil du patient...
          </p>
        </motion.div>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 min-h-screen bg-bay-of-many-50"
      >
        {user.role == "MEDECIN" ? (
          <div className="w-full flex justify-end mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/medecin")}
              className="flex items-center gap-2 p-2 px-4 bg-gray-50 rounded-xl shadow-sm border border-bay-of-many-200 text-bay-of-many-600 hover:text-bay-of-many-800 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Retour au tableau de bord</span>
            </motion.button>
          </div>
        ) : (
          <div className="w-full flex justify-end mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 px-4 bg-gray-50 rounded-xl shadow-sm border border-bay-of-many-200 text-bay-of-many-600 hover:text-bay-of-many-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Deconnexion</span>
            </motion.button>
          </div>
        )}

        <div className="flex-1 flex-col md:flex-row gap-6 mb-8">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md border border-bay-of-many-100 flex-1"
          >
            <div className="md:flex  w-full items-center justify-between gap-4 mb-4">
              <div className="flex flex-1 justify-between items-center w-full">
                <div className="flex  gap-4">
                  <div
                    className={` min-w-22 bg-bay-of-many-100 ${
                      patient.image ?? "p-3"
                    }  rounded-full`}
                  >
                    {patient.image ? (
                      <img
                        src={patient.image}
                        alt={`${patient.nom} ${patient.prénom}`}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-bay-of-many-600" />
                    )}
                  </div>
                  <div className="flex justify-between flex-col ">
                    <h1 className="text-2xl font-bold text-bay-of-many-900">
                      {patient.user.nom} {patient.user.prénom}
                    </h1>
                    <span
                      className={`px-3 mr-2 py-1 rounded-full text-sm font-medium ${
                        statusColor[patient.status]
                      }`}
                    >
                      {patient.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        planMedicalColor[patient.planMedical]
                      }`}
                    >
                      {patient.planMedical}
                    </span>
                  </div>
                </div>
              </div>

              {user.role === "MEDECIN" && (
                <div className="gap-x-4 mt-5 md:mt-0  grid md:grid-cols-2 lg:grid-cols-3  gap-y-2 grid-cols-1  items-center ">
                  <Dialog
                    open={isStatusDialogOpen}
                    onOpenChange={setIsStatusDialogOpen}
                  >
                    <DialogTrigger onClick={() => setIsStatusDialogOpen(true)}>
                      <button className="px-4 py-2 bg-transparent border border-bay-of-many-600 text-bay-of-many-600 rounded-lg text-sm font-medium hover:bg-bay-of-many-300 duration-300 transition-all flex items-center justify-around gap-x-4 md:w-56 w-full h-12 ">
                        <ClipboardList className="size-4" />
                        <p>Changement status patient</p>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Modifier le statut du patient</DialogTitle>
                        <div className="flex flex-col gap-4 mt-4">
                          <div className="flex flex-col gap-1">
                            <label
                              className="text-sm font-medium text-bay-of-many-600"
                              htmlFor="status"
                            >
                              Statut
                            </label>
                            <select
                              onChange={(e) => setStatus(e.target.value)}
                              id="status"
                              className="border border-bay-of-many-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bay-of-many-600"
                              defaultValue={patient.status}
                            >
                              {Status.map((status) => (
                                <option key={status.label} value={status.label}>
                                  {status.value}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </DialogHeader>
                      <DialogFooter className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500"
                          onClick={() => setIsStatusDialogOpen(false)}
                        >
                          Annuler
                        </button>
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-bay-of-many-600 rounded-md hover:bg-bay-of-many-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={toggleStatus}
                        >
                          Confirmer
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={isPlanMedicalDialogOpen}
                    onOpenChange={setIsPlanMedicalDialogOpen}
                  >
                    <DialogTrigger
                      onClick={() => setIsPlanMedicalDialogOpen(true)}
                    >
                      <button className="px-4 py-2 bg-transparent border border-bay-of-many-600 text-bay-of-many-600 rounded-lg text-sm font-medium hover:bg-bay-of-many-300 duration-300 transition-all flex items-center justify-around gap-x-2 md:w-56 w-full h-12  ">
                        <HeartPulse className="size-4" />
                        <p>Changement plan médical</p>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>
                          Modifier le plan médical du patient
                        </DialogTitle>
                        <div className="flex flex-col gap-4 mt-4">
                          <div className="flex flex-col gap-1">
                            <label
                              className="text-sm font-medium text-bay-of-many-600"
                              htmlFor="planMedical"
                            >
                              Plan Médical
                            </label>
                            <select
                              onChange={(e) => setPlanMedical(e.target.value)}
                              id="planMedical"
                              className="border border-bay-of-many-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bay-of-many-600"
                              defaultValue={patient.planMedical}
                            >
                              {planMedicalOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </DialogHeader>
                      <DialogFooter className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500"
                          onClick={() => setIsPlanMedicalDialogOpen(false)}
                        >
                          Annuler
                        </button>
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-bay-of-many-600 rounded-md hover:bg-bay-of-many-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={updatePlanMedical}
                        >
                          Confirmer
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger onClick={() => setIsDialogOpen(true)}>
                      <button className="px-4 py-2 bg-transparent border border-bay-of-many-600 text-bay-of-many-600 rounded-lg text-sm font-medium hover:bg-bay-of-many-300 duration-300 transition-all flex items-center justify-around gap-x-4 md:w-56 w-full h-12 ">
                        <Pencil className="size-4" />
                        <p>Modifier les informations</p>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Modifier les informations</DialogTitle>
                        <div className="flex flex-col gap-4 mt-4">
                          <div className="flex flex-col gap-4 mt-4">
                            {/* Teguments */}
                            <div className="flex flex-col gap-1">
                              <label
                                className="text-sm font-medium text-bay-of-many-600"
                                htmlFor="teguments"
                              >
                                Téguments
                              </label>
                              <input
                                {...register("teguments")}
                                id="teguments"
                                type="text"
                                placeholder="Ex: Pâles / Normaux"
                                className="border border-bay-of-many-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bay-of-many-600"
                              />
                              {errors.teguments && (
                                <p className="text-red-600 text-sm">
                                  {errors.teguments.message}
                                </p>
                              )}
                            </div>

                            {/* Taille */}
                            <div className="flex flex-col gap-1">
                              <label
                                className="text-sm font-medium text-bay-of-many-600"
                                htmlFor="taille"
                              >
                                Taille (cm)
                              </label>
                              <input
                                {...register("taille")}
                                id="taille"
                                type="text"
                                placeholder="Ex: 175"
                                className="border border-bay-of-many-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bay-of-many-600"
                              />
                              {errors.taille && (
                                <p className="text-red-600 text-sm">
                                  {errors.taille.message}
                                </p>
                              )}
                            </div>

                            {/* Poids */}
                            <div className="flex flex-col gap-1">
                              <label
                                className="text-sm font-medium text-bay-of-many-600"
                                htmlFor="poids"
                              >
                                Poids (kg)
                              </label>
                              <input
                                {...register("poids")}
                                id="poids"
                                type="text"
                                placeholder="Ex: 70.5"
                                className="border border-bay-of-many-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bay-of-many-600"
                              />
                              {errors.poids && (
                                <p className="text-red-600 text-sm">
                                  {errors.poids.message}
                                </p>
                              )}
                            </div>

                            {/* Périmètre Thoracique */}
                            <div className="flex flex-col gap-1">
                              <label
                                className="text-sm font-medium text-bay-of-many-600"
                                htmlFor="perimetreThoracique"
                              >
                                Périmètre Thoracique (cm)
                              </label>
                              <input
                                {...register("perimetreThoracique")}
                                id="perimetreThoracique"
                                type="text"
                                placeholder="Ex: 95"
                                className="border border-bay-of-many-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bay-of-many-600"
                              />
                              {errors.perimetreThoracique && (
                                <p className="text-red-600 text-sm">
                                  {errors.perimetreThoracique.message}
                                </p>
                              )}
                            </div>

                            {/* Atelier */}
                            <div className="flex flex-col gap-1">
                              <label
                                className="text-sm font-medium text-bay-of-many-600"
                                htmlFor="atelier"
                              >
                                Atelier
                              </label>
                              <input
                                {...register("atelier")}
                                id="atelier"
                                type="text"
                                placeholder="Ex: Atelier A"
                                className="border border-bay-of-many-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bay-of-many-600"
                              />
                              {errors.atelier && (
                                <p className="text-red-600 text-sm">
                                  {errors.atelier.message}
                                </p>
                              )}
                            </div>

                            {/* Entreprise */}
                            <div className="flex flex-col gap-1">
                              <label
                                className="text-sm font-medium text-bay-of-many-600"
                                htmlFor="entreprise"
                              >
                                Entreprise
                              </label>
                              <input
                                {...register("entreprise")}
                                id="entreprise"
                                type="text"
                                placeholder="Ex: Mon Entreprise S.A."
                                className="border border-bay-of-many-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bay-of-many-600"
                              />
                              {errors.entreprise && (
                                <p className="text-red-600 text-sm">
                                  {errors.entreprise.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </DialogHeader>
                      <DialogFooter className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Annuler
                        </button>
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-bay-of-many-600 rounded-md hover:bg-bay-of-many-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleSubmit(onSubmit)}
                        >
                          Confirmer
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={isImageDialogOpen}
                    onOpenChange={setIsImageDialogOpen}
                  >
                    <DialogTrigger onClick={() => setIsImageDialogOpen(true)}>
                      <button className="px-4 py-2 bg-transparent border border-bay-of-many-600 text-bay-of-many-600 rounded-lg text-sm font-medium hover:bg-bay-of-many-300 duration-300 transition-all flex items-center justify-around gap-x-4 md:w-56 w-full h-12">
                        <Camera className="size-4" />
                        <p>Changer la photo</p>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Changer la photo du patient</DialogTitle>
                        <DialogDescription>
                          Téléchargez une nouvelle photo pour ce patient
                          (formats acceptés: JPEG, PNG).
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 mt-4">
                        <input
                          type="file"
                          lang="fr"
                          accept="image/jpeg, image/png, image/jpg"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="border border-bay-of-many-400 rounded-lg p-2"
                        />
                      </div>
                      <DialogFooter className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          onClick={() => setIsImageDialogOpen(false)}
                        >
                          Annuler
                        </button>
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-bay-of-many-600 rounded-md hover:bg-bay-of-many-700"
                          onClick={handleImageUpload}
                        >
                          Enregistrer
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={isCertificateDialogOpen}
                    onOpenChange={setIsCertificateDialogOpen}
                  >
                    <DialogTrigger onClick={handleGenerateCertificate}>
                      <button
                        className="px-4 py-2 bg-transparent border border-bay-of-many-600 text-bay-of-many-600 rounded-lg text-sm font-medium hover:bg-bay-of-many-300 duration-300 transition-all flex items-center justify-around gap-x-4 md:w-56 w-full h-12 cursor-pointer disabled:pointer-events-none disabled:opacity-50 "
                        disabled={
                          patient.status !== "APTE" &&
                          patient.status !== "NON_APTE"
                        }
                      >
                        <ShieldCheck className="size-4" />
                        <p>Générer certificat</p>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Confirmer statut</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p>Statut du patient: {patient.status}</p>
                      </div>
                      <DialogFooter className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500"
                          onClick={() => setIsCertificateDialogOpen(false)}
                        >
                          Annuler
                        </button>
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-bay-of-many-600 rounded-md hover:bg-bay-of-many-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500"
                          onClick={() => {
                            setIsCertificateDialogOpen(false);
                          }}
                        >
                          Confirmer
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            <div
              className={`grid grid-cols-1 ${
                user.role === "PATIENT" ? "md:grid-cols-3" : "md:grid-cols-2"
              } gap-4`}
            >
              <div className="bg-bay-of-many-50 p-4 rounded-lg">
                <p className="text-sm text-bay-of-many-600">
                  Date de naissance
                </p>
                <p className="font-medium">
                  {format(patient?.user?.dateNaissance, "yyyy/MM/dd")}
                </p>
              </div>
              <div className="bg-bay-of-many-50 p-4 rounded-lg">
                <p className="text-sm text-bay-of-many-600">Ville</p>
                <p className="font-medium ">
                  {patient.user.ville.charAt(0).toUpperCase() +
                    patient.user.ville.slice(1).toLowerCase()}
                </p>
              </div>
              {user.role === "PATIENT" &&
                (rdv ? (
                  <div className="bg-bay-of-many-50 p-4 rounded-lg">
                    <p className="text-sm text-bay-of-many-600">
                      Prochain rendez-vous
                    </p>
                    <p className="font-medium">
                      {format(rdv.dateTime, "yyyy/MM/dd HH:mm")} — Docteur{" "}
                      {rdv.doctorName} {rdv.doctorLastName}
                    </p>
                  </div>
                ) : (
                  <div className="bg-bay-of-many-50 p-4 rounded-lg">
                    <p className="text-sm text-bay-of-many-600">
                      Prochain rendez-vous
                    </p>
                    <p className="font-medium">
                      Aucun rendez-vous prévu dans les prochains jours.
                    </p>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() =>
                navigate(`/patient/${id}/antecedent_professionnels`)
              }
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <HeartPulse className="w-8 h-8 text-blue-600" />
                <ChevronRight className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-1">
                Antecedent professionnels
              </h3>
              <p className="text-sm text-blue-600">
                Antecedent professionnels du patient
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/patient/${id}/antecedent_familiaux`)}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <ClipboardList className="w-8 h-8 text-purple-600" />
                <ChevronRight className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-1">
                Antecedant familaux
              </h3>
              <p className="text-sm text-purple-600">
                Historique familial médical
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/patient/${id}/examens`)}
              className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <Stethoscope className="w-8 h-8 text-green-600" />
                <ChevronRight className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">
                Examens
              </h3>
              <p className="text-sm text-green-600">Résultats des examens</p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/patient/${id}/muscles`)}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-sm border border-indigo-200 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <Dumbbell className="w-8 h-8 text-indigo-600" />{" "}
                <ChevronRight className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-800 mb-1">
                Évaluation Musculaire
              </h3>
              <p className="text-sm text-indigo-600">
                Analyse de la force musculaire du patient
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/patient/${id}/tolerance`)}
              className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <Brush className="w-8 h-8 text-green-600" />
                <ChevronRight className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">
                Tolérances
              </h3>
              <p className="text-sm text-green-600">
                Informations sur la sensibilité du patient aux substances
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/patient/${id}/conclusion`)}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-sm border border-indigo-200 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <Rotate3D className="w-8 h-8 text-indigo-600" />
                <ChevronRight className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-800 mb-1">
                Mode de Vie
              </h3>
              <p className="text-sm text-indigo-600">
                Informations sur les habitudes de vie du patient 
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/patient/${id}/details`)}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <User className="w-8 h-8 text-blue-600" />
                <ChevronRight className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-1">
                Détails Patient
              </h3>
              <p className="text-sm text-blue-600">
                Informations sur le patient
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/patient/${id}/parcours-professionnel`)}
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm border border-orange-200 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <Briefcase className="w-8 h-8 text-orange-600" />{" "}
                <ChevronRight className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-orange-800 mb-1">
                Parcours Professionnel
              </h3>
              <p className="text-sm text-orange-600">
                Historique des postes occupés
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }
}

import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  HeartPulse,
  Stethoscope,
  Pill,
  ClipboardList,
  ChevronRight,
  Heart,
  Eye,
  Ear,
  Bone,
  Brain,
  Package,
  PillBottle,
  CircleEllipsis,
} from "lucide-react";
import { BiInjection } from "react-icons/bi";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../auth/AxiosInstance";

export default function AntecedentsProfessionnels() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(`/api/patient/${id}`);
        setPatient(response.data);
      } catch (error) {
        if (error.response.data.message == "not allowed") {
          navigate("/unauthorized");
        }
      }
    };
    fetchData();
  }, [id]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const statusColor = {
    APTE: "bg-green-100 text-green-800",
    NON_APTE: "bg-red-100 text-red-800",
    EN_ATTENTE_DE_REEVALUATION: "bg-amber-100 text-amber-800",
    EXAMEN_ANNUEL_A_PREVOIR: "bg-blue-100 text-blue-800",
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
        <div className="w-full flex justify-between mb-8">
          <motion.div
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 p-2 px-4 bg-gray-50 rounded-xl shadow-sm border border-bay-of-many-200 text-bay-of-many-600 hover:text-bay-of-many-800 transition-colors cursor-pointer"
          >
            {/* <div className="bg-bay-of-many-100 p-3 rounded-full">
              <User className="w-6 h-6 text-bay-of-many-600" />
            </div> */}
            <div>
              <h1 className="text-2xl font-bold text-bay-of-many-900">
                {patient.user.nom} {patient.user.prénom}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColor[patient.status]
                }`}
              >
                {patient.status}
              </span>
            </div>
          </motion.div>
          <div className="align-middle justify-self-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 p-2 px-4 bg-gray-50 rounded-xl shadow-sm border border-bay-of-many-200 text-bay-of-many-600 hover:text-bay-of-many-800 transition-colors h-fit"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Retour au tableau de bord</span>
            </motion.button>
          </div>
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -5 }}
            onClick={() =>
              navigate(`/patient/${id}/antecedent_professionnels/details`)
            }
            className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-sm border border-red-200 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <CircleEllipsis className="w-8 h-8 text-red-600" />
              <ChevronRight className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-1">
              Antécédents Professionnels details
            </h3>
            <p className="text-sm text-red-600">
              Consultez et gérez les details ( accidents , Maladies ...)
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -5 }}
            onClick={() =>
              navigate(`/patient/${id}/antecedent_professionnels/vaccinations`)
            }
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <BiInjection className="w-8 h-8 text-blue-600" />
              <ChevronRight className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-blue-800 mb-1">
              Vaccinations
            </h3>
            <p className="text-sm text-blue-600">
              l'historique de vaccination du patient.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -5 }}
            onClick={() =>
              navigate(`/patient/${id}/antecedent_professionnels/serums`)
            }
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-sm border border-indigo-200 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <BiInjection className="w-8 h-8 text-indigo-600" />
              <ChevronRight className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-indigo-800 mb-1">
              Serums
            </h3>
            <p className="text-sm text-indigo-600">
              les différentes sérothérapies administrées au patient.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
}

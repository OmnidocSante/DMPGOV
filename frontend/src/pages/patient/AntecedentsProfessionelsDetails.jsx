import { motion } from "framer-motion";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatePresence } from "framer-motion";
import { Ban, HistoryIcon, History } from "lucide-react";
import useUser from "../auth/useUser";
import instance from "../auth/AxiosInstance";

export default function AntecedentsProfessionnelsDetails() {
  const user = useUser();

  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [antecedents, setAntecedents] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [isHistory, setIsHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [IsShowHistorique, setIsShowHistorique] = useState(false);

  const fetchData = async (url) => {
    setLoading(true);
    try {
      const response = await instance.get(url);

      const data = response.data;

      setAntecedents(data);
    } catch (err) {
      console.error("Error fetching AntecedentsProfessionnels:", err);
      setAntecedents(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(`/api/antecedents-professionnels/patient/${id}`);
  }, [id]);

  const handleFieldChange = (key, value) => {
    if (!isEditMode || isHistory || !antecedents) return;

    setAntecedents((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!isEditMode || isHistory || !antecedents) return;

    try {

      if (!antecedents.id) {
        console.error("Dossier ID not found for saving.");
        return;
      }

      await instance.put(
        `/api/antecedents-professionnels/dossier/${antecedents.id}`,
        antecedents
      );

      fetchData(`/api/antecedents-professionnels/patient/${id}`);
      setIsEditMode(false);
    } catch (err) {
      console.error("Error saving AntecedentsProfessionnels:", err);
    }
  };

  const handleHistoriqueClick = async () => {
    if (isEditMode) return;
    if (isHistory) {
      fetchData(`/api/antecedents-professionnels/patient/${id}`);
      setIsHistory(false);
      setIsShowHistorique(false);
    } else {
      if (historique.length === 0) {
        try {
          const response = await instance.get(`/api/patient/${id}/historique`);
          setHistorique(response.data);
          setIsShowHistorique(false);
        } catch (err) {
          console.error("Error fetching history:", err);
          setHistorique([]);
        }
      }
      setIsHistory(true);
    }
  };

  const fetchItem = async (dossierId) => {
    fetchData(`/api/antecedents-professionnels/dossier/${dossierId}`);
    setIsHistory(true);
    setIsEditMode(false);
    setIsShowHistorique(true);
  };

  if (loading) {
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
            Chargement des informations
          </p>
        </motion.div>
      </motion.div>
    );
  } else if (!antecedents) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bay-of-many-50 p-6">
        <Alert variant="destructive" className="max-w-sm">
          <Ban className="size-5" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            Impossible de charger les données des antécédents professionnels.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 min-h-screen bg-bay-of-many-50"
    >
      <AnimatePresence>
        {IsShowHistorique && (
          <motion.div
            className="w-full max-w-md fixed top-20 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Alert
              variant="default"
              className="bg-white/95 backdrop-blur-sm border border-blue-100 shadow-lg"
            >
              <HistoryIcon className="size-5 text-blue-600 shrink-0" />
              <AlertTitle className="text-sm font-semibold text-blue-800 mb-1">
                Historique Mode Active
              </AlertTitle>
              <AlertDescription className="text-sm text-blue-700 leading-snug">
                <div>
                  Consultation seule - Les modifications sont désactivées dans
                  ce mode
                  <span
                    onClick={handleHistoriqueClick}
                    className="text-red-500 cursor-pointer hover:underline"
                  >
                    restaurer
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className=" text-2xl font-bold text-gray-800">
          Antécédents Professionnels
        </h1>
        {user.role === "MEDECIN" && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleHistoriqueClick}
              className={`p-2 pl-4 rounded-lg flex items-center gap-2 transition-all ${
                isEditMode
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-blue-50 hover:-translate-y-0.5"
              }`}
              disabled={isEditMode}
            >
              <History className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                {isHistory ? "Cacher l'historique" : "Voir historique"}
              </span>
            </button>

            {isEditMode ? (
              <button
                type="button"
                onClick={() => {
                  fetchData(`/api/antecedents-professionnels/patient/${id}`);
                  setIsEditMode(false);
                }}
                className={`p-2 pl-4 ${
                  isHistory && "cursor-not-allowed"
                } rounded-lg flex items-center gap-2 transition-all ${
                  isEditMode ? " " : "hover:bg-blue-50 hover:-translate-y-0.5"
                }`}
                disabled={isHistory}
              >
                <Ban className="h-6 w-6 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Annuler
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className={`p-2 pl-4 ${
                  isHistory && "cursor-not-allowed"
                } rounded-lg flex items-center gap-2 transition-all ${
                  isEditMode ? "" : "hover:bg-blue-50 hover:-translate-y-0.5"
                }`}
                disabled={isEditMode || isHistory}
              >
                <Edit className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Modifier
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className={`p-2 pl-4 rounded-lg flex items-center gap-2 transition-all ${
                !isEditMode || isHistory
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-green-50 hover:-translate-y-0.5"
              } `}
              disabled={!isEditMode || isHistory}
            >
              <Save className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Enregistrer
              </span>
            </button>
          </div>
        )}
      </div>

      {isHistory && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="my-4 space-y-2 bg-white p-4 rounded-xl shadow-inner"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
            Versions Historiques
          </h3>
          {historique.length > 0 ? (
            historique.map((item) => (
              <div
                key={item.id}
                onClick={() => fetchItem(item.id)}
                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <p className="text-sm font-medium text-gray-700">
                  <span className="mr-2 text-gray-500">Date du dossier:</span>
                  {new Date(item.date).toLocaleString("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">
              Aucun historique disponible.
            </p>
          )}
        </motion.div>
      )}

      <div className="space-y-6">
        {antecedents && (
          <div className="space-y-6">
            {Object.entries(antecedents).map(([key, value]) => {
              const label = key
                .replace(/([A-Z])/g, " $1")
                .trim()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

              if (key === "serums" || key === "vaccinations" || key === "id") {
                return;
              }

              return (
                <motion.div
                  key={key}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {label}
                    </h2>
                  </div>
                  <div>
                    <input
                      id={`top-level-${key}`}
                      value={value || ""}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      placeholder={label + "..."}
                      type="text"
                      disabled={!isEditMode || isHistory}
                      className={`w-full px-4 py-3 border ${
                        isEditMode && !isHistory
                          ? "border-blue-200"
                          : "border-gray-200"
                      } rounded-lg focus:outline-none focus:ring-2 ${
                        isEditMode && !isHistory
                          ? "focus:ring-blue-300"
                          : "focus:ring-gray-300"
                      } transition-all ${
                        !isEditMode || isHistory
                          ? "bg-gray-50 cursor-not-allowed"
                          : ""
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {!loading && !antecedents && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 italic mt-8"
        >
          Aucune donnée d'antécédents professionnels enregistrée ou visible pour
          ce dossier.
        </motion.div>
      )}
    </motion.div>
  );
}

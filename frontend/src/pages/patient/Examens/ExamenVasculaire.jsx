import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Edit, Save, Ban, HistoryIcon, History } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useUser from "@/pages/auth/useUser";
import instance from "@/pages/auth/AxiosInstance";

export default function ExamenVasculaire() {
  const user = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const [examen, setExamen] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isHistory, setIsHistory] = useState(false);
  const [showHistoryBanner, setShowHistoryBanner] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await instance.get(url);
      
      setExamen(res.data);
    } catch (err) {
      console.error("Error fetching Examen Radiologique:", err);
      setError("Impossible de charger l'examen radiologique.");
      setExamen(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(`/api/examens/vasculaire/patient/${id}`);
  }, [id]);

  const handleFieldChange = (key, value) => {
    if (!isEditMode || isHistory || !examen) return;
    setExamen((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!isEditMode || isHistory || !examen?.id) return;
    try {
      await instance.put(`/api/examens/vasculaire/patient/${id}`, examen);
      setIsEditMode(false);
      fetchData(`/api/examens/vasculaire/patient/${id}`);
    } catch (err) {
      console.error("Error saving Examen Radiologique:", err);
      setError("Erreur lors de l'enregistrement de l'examen.");
    }
  };

  const handleHistoriqueClick = async () => {
    if (isEditMode) return;
    if (isHistory) {
      fetchData(`/api/examens/vasculaire/patient/${id}`);
      setIsHistory(false);
      setShowHistoryBanner(false);
    } else {
      if (historique.length === 0) {
        try {
          const res = await instance.get(`/api/patient/${id}/historique`);
          setHistorique(res.data);
        } catch (err) {
          console.error("Error fetching history metadata:", err);
          setHistorique([]);
        }
      }
      setIsHistory(true);
    }
  };

  const fetchItem = async (dossierId) => {
    fetchData(`/api/examens/vasculaire/dossier/${dossierId}`);
    setIsHistory(true);
    setIsEditMode(false);
    setShowHistoryBanner(true);
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
            Chargement des données
          </p>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bay-of-many-50">
        <Alert variant="destructive" className="max-w-sm">
          <Ban className="size-5" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const fields = [
    { key: "pouls", label: "Pouls" },
    { key: "pressionArterielle", label: "Pression Artérielle" },
    { key: "varices", label: "Varices" },
    { key: "appareilRespiratoire", label: "Appareil Respiratoire" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-bay-of-many-50 min-h-screen"
    >
      <AnimatePresence>
        {showHistoryBanner && (
          <motion.div
            className="w-full max-w-md fixed top-20 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Alert
              variant="default"
              className="bg-white/95 backdrop-blur-sm border border-green-100 shadow-lg"
            >
              <HistoryIcon className="size-5 text-green-600 shrink-0" />
              <AlertTitle className="text-sm font-semibold text-green-800 mb-1">
                Historique Mode Active
              </AlertTitle>
              <AlertDescription className="text-sm text-gray-700">
                <span>Consultation seule - modifications désactivées </span>
                <span
                  onClick={handleHistoriqueClick}
                  className="text-red-500 cursor-pointer hover:underline"
                >
                  restaurer
                </span>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Examen Vasculaire</h1>
        {user.role === "MEDECIN" && (
          <div className="flex gap-3">
            <button
              onClick={handleHistoriqueClick}
              disabled={isEditMode}
              className={`p-2 pl-4 rounded-lg flex items-center gap-2 transition-all ${
                isEditMode
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-50 hover:-translate-y-0.5"
              }`}
            >
              <History className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                {isHistory ? "Cacher l'historique" : "Voir historique"}
              </span>
            </button>
            {isEditMode ? (
              <button
                onClick={() => {
                  fetchData(`/api/examens/vasculaire/patient/${id}`);
                  setIsEditMode(false);
                }}
                disabled={isHistory}
                className="p-2 pl-4 rounded-lg flex items-center gap-2 hover:bg-red-50"
              >
                <Ban className="h-6 w-6 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Annuler
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                disabled={isHistory}
                className="p-2 pl-4 rounded-lg flex items-center gap-2 hover:bg-green-50"
              >
                <Edit className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Modifier
                </span>
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!isEditMode || isHistory}
              className={`p-2 pl-4 rounded-lg flex items-center gap-2 transition-all ${
                !isEditMode || isHistory
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-blue-50 hover:-translate-y-0.5"
              }`}
            >
              <Save className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
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
            <p className="text-gray-500 italic text-sm">
              Aucun historique disponible.
            </p>
          )}
        </motion.div>
      )}

      <div className="space-y-6">
        {examen &&
          fields.map(({ key, label }) => (
            <motion.div
              key={key}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {label}
              </h2>
              <input
                value={examen[key] || ""}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                placeholder={label}
                disabled={!isEditMode || isHistory}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  isEditMode && !isHistory
                    ? "border-green-200 focus:ring-green-300"
                    : "border-gray-200 focus:ring-gray-200 bg-gray-50 cursor-not-allowed"
                }`}
              />
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}

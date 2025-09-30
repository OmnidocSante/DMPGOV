import { motion } from "framer-motion";
import { ArrowLeft, Edit, Save, Ban } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useUser from "../auth/useUser";
import instance from "../auth/AxiosInstance";

export default function AntecedentsFamiliaux() {
  const user = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(
        `/api/antecedents-familiaux/patient/${id}`
      );
      setData(response.data);
    } catch (err) {
      console.error("Error fetching AntecedentsFamiliaux:", err);
      setError("Impossible de charger les antécédents familiaux.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleChange = (key, value) => {
    if (!isEditMode || !data) return;
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!isEditMode || !data?.id) return;
    try {
      await instance.put(`/api/antecedents-familiaux/patient/${id}`, data);
      setIsEditMode(false);
      fetchData();
    } catch (err) {
      console.error("Error saving AntecedentsFamiliaux:", err);
      setError("Erreur lors de l'enregistrement.");
    }
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
            Chargement du profil du patient...
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-gradient-to-b from-green-50 to-teal-50 min-h-screen"
    >
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Antécédents Familiaux
        </h1>
        {user.role === "MEDECIN" && (
          <div className="flex gap-3">
            {isEditMode ? (
              <button
                onClick={() => {
                  setIsEditMode(false);
                  fetchData();
                }}
                className="p-2 flex items-center gap-2 rounded-lg hover:bg-red-50"
              >
                <Ban className="h-6 w-6 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Annuler
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="p-2 flex items-center gap-2 rounded-lg hover:bg-blue-50"
              >
                <Edit className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Modifier
                </span>
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={!isEditMode}
              className={`p-2 flex items-center gap-2 rounded-lg transition-colors ${
                isEditMode
                  ? "hover:bg-green-50"
                  : "bg-gray-200 cursor-not-allowed"
              }`}
            >
              <Save className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Enregistrer
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {data &&
          [
            { key: "ascendants", label: "Ascendants" },
            { key: "conjoint", label: "Conjoint" },
            { key: "collateraux", label: "Collatéraux" },
            { key: "enfants", label: "Enfants" },
          ].map(({ key, label }) => (
            <motion.div
              key={key}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {label}
              </h2>
              <input
                value={data[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={label}
                disabled={!isEditMode}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  isEditMode
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

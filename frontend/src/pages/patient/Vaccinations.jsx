import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Ban, Edit, Save } from "lucide-react"; // No Plus or Trash needed for this logic
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import useUser from "../auth/useUser";
import instance from "../auth/AxiosInstance";
import { format, parseISO } from "date-fns"; // parseISO to handle ISO date strings from backend
import { TypeVaccinationOptions } from "@/enums/enums";

// Define the schema for a single vaccination entry
const vaccinationSchema = z.object({
  id: z.number().optional(), // Existing vaccinations will have an ID
  type: z.string(), // Type will be read-only, but part of the form data
  date: z
    .string()
    .nullable()
    .transform((e) => (e === "" ? null : e)), // Date can be null or a string, transform empty string to null
});

export default function Vaccinations() {
  const user = useUser();
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // 'id' will refer to 'patientId' for vaccinations
  const [loading, setLoading] = useState(true);
  const [existingVaccinations, setExistingVaccinations] = useState([]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        vaccinations: z.array(vaccinationSchema),
      })
    ),
    defaultValues: {
      vaccinations: [],
    },
  });

  const { fields } = useFieldArray({
    // No append or remove needed since types are pre-built
    control,
    name: "vaccinations",
  });

  const fetchData = async () => {
    try {
      // For vaccinations, we always fetch by patient ID
      const response = await instance.get(
        `/api/antecedents-professionnels/patient/${id}/vaccinations`
      );
      console.log(response.data);

      // Map the fetched data to the form structure.
      // Ensure date is in 'yyyy-MM-dd' format for input type="date"
      const formattedVaccinations = response.data.map((vac) => ({
        ...vac,
        date: vac.date ? format(parseISO(vac.date), "yyyy-MM-dd") : "", // Format for input[type="date"]
      }));
      setExistingVaccinations(formattedVaccinations);
      reset({ vaccinations: formattedVaccinations }); // Populate form with existing data
    } catch (err) {
      if (err.response && err.response.data.message === "not allowed") {
        navigate("/unauthorized");
      }
      console.error("Error fetching vaccinations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); // Re-fetch if 'id' changes

  const handleSave = async (formData) => {
    try {
      // The backend expects a List<Vaccination> and handles updates
      // We need to transform the date back to a format acceptable by LocalDate (e.g., ISO string or null)
      const vaccinationsToSave = formData.vaccinations.map((vac) => ({
        id: vac.id,
        type: vac.type,
        date: vac.date ? vac.date : null, // Send null if date is empty
      }));

      await instance.put(
        `/api/antecedents-professionnels/patient/${id}/vaccinations`,
        vaccinationsToSave
      );

      await fetchData(); // Re-fetch to update the list
      setIsEditMode(false);
      // No reset for new items, as we are only modifying existing ones.
      // The `reset` call within `fetchData` will handle repopulating the form.
    } catch (err) {
      console.error("Error saving vaccinations:", err);
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
            Chargement des vaccinations...
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit(handleSave)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 min-h-screen bg-bay-of-many-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Vaccinations
        </h1>
        {user.role === "MEDECIN" && (
          <div className="flex gap-3">
            {isEditMode ? (
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  fetchData(); // Revert changes by re-fetching original data
                }}
                className={`p-2 pl-4 rounded-lg flex items-center gap-2 transition-all`}
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
                className={`p-2 pl-4 rounded-lg flex items-center gap-2 transition-all ${
                  isEditMode
                    ? "bg-gray-200 cursor-not-allowed"
                    : "hover:bg-blue-50 hover:-translate-y-0.5"
                }`}
                disabled={isEditMode}
              >
                <Edit className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Modifier
                </span>
              </button>
            )}

            <button
              type="submit"
              className={`p-2 pl-4 rounded-lg flex items-center gap-2 transition-all ${
                !isEditMode
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-green-50 hover:-translate-y-0.5"
              }`}
              disabled={!isEditMode}
            >
              <Save className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Enregistrer
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6 mb-12  md:grid md:grid-cols-3 md:gap-x-5">
        {existingVaccinations.length > 0 ? (
          fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {TypeVaccinationOptions.find(
                    ({ value }) => value === field.type
                  )?.label || field.type}
                </h2>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Date: </span>
                  {isEditMode ? (
                    <input
                      type="date"
                      {...register(`vaccinations.${index}.date`)}
                      className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    <span>{field.date || "Non renseignée"}</span>
                  )}
                </p>
                {errors.vaccinations?.[index]?.date && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.vaccinations[index].date.message}
                  </p>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="w-full p-4 bg-white text-blue-600">
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">
                Aucune vaccination n’a encore été attribuée.
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.form>
  );
}

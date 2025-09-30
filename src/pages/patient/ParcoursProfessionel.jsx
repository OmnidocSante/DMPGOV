import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Ban, Edit, Plus, Save, Trash, HistoryIcon, History } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import useUser from "../auth/useUser";
import instance from "../auth/AxiosInstance";
import { format, parseISO } from "date-fns";

const parcoursSchema = z.object({
  debut: z.string().min(1, "Required"),
  fin: z.string().min(1, "Required"),
});

export default function ParcoursProfessionnels() {
  const user = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [existing, setExisting] = useState([]);
  const [toDelete, setToDelete] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({ parcours: z.array(parcoursSchema) })),
    defaultValues: { parcours: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'parcours' });

  const fetchData = async () => {
    try {
      const res = await instance.get(`/api/parcours-professionnel/patient/${id}`);
      setExisting(res.data);
    } catch (err) {
      if (err.response?.data?.message === 'not allowed') navigate('/unauthorized');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const onSubmit = async (data) => {
    try {
      // delete
      await Promise.all(toDelete.map(pid => instance.delete(`/api/parcours-professionnel/${pid}`)));
      // add new
      await Promise.all(data.parcours.map(p => instance.post(`/api/parcours-professionnel/patient/${id}`, p)));
      fetchData();
      setIsEditMode(false);
      reset({ parcours: [] });
      setToDelete([]);
    } catch (err) { console.error(err); }
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
            Chargement du parcours
          </p>
        </motion.div>
      </motion.div>
    );
  } 

  return (
    <motion.form onSubmit={handleSubmit(onSubmit)} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}} className="p-6 min-h-screen bg-bay-of-many-50">
      <div className="flex items-center justify-between mb-8">
        <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Parcours Professionnels</h1>
        {user.role === 'MEDECIN' && (
          <div className="flex gap-3">
            {isEditMode ? (
              <button type="button" onClick={() => { setIsEditMode(false); reset({ parcours: [] }); setToDelete([]); }} className="p-2 pl-4 rounded-lg flex items-center gap-2 transition-all hover:bg-red-50">
                <Ban className="h-6 w-6 text-red-600" />
                <span className="text-sm font-medium text-red-800">Annuler</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="p-2 pl-4 rounded-lg flex items-center gap-2 transition-all hover:bg-blue-50 hover:-translate-y-0.5"
                disabled={isEditMode}
              >
                {existing.length > 0 ? (
                  <>
                    <Edit className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Modifier</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Ajouter</span>
                  </>
                )}
              </button>
            )}
            <button type="submit" disabled={!isEditMode} className={`p-2 pl-4 rounded-lg flex items-center gap-2 transition-all ${!isEditMode ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-green-50 hover:-translate-y-0.5'}`}>
              <Save className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-green-800">Enregistrer</span>
            </button>
          </div>
        )}
      </div>

      {/* Existing */}
      <div className="space-y-6 mb-12">
        {existing.filter(e => !toDelete.includes(e.id)).map(e => (
          <div key={e.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{format(parseISO(e.debut), 'yyyy-MM-dd')} → {format(parseISO(e.fin), 'yyyy-MM-dd')}</h2>
              {isEditMode && (
                <button type="button" onClick={() => setToDelete([...toDelete, e.id])} className="p-2 hover:bg-red-50 rounded-full transition-colors">
                  <Trash className="h-5 w-5 text-red-600" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New */}
      {isEditMode && (
        <div className="space-y-6">
          {fields.map((field, idx) => (
            <motion.div key={field.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Nouvelle Période</h3>
                <button type="button" onClick={() => remove(idx)} className="p-2 hover:bg-red-50 rounded-full transition-colors">
                  <Trash className="h-5 w-5 text-red-600" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <input {...register(`parcours.${idx}.debut`)} type="date" className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
                  {errors.parcours?.[idx]?.debut && <p className="text-red-500 text-sm mt-2">{errors.parcours[idx].debut.message}</p>}
                </div>
                <div>
                  <input {...register(`parcours.${idx}.fin`)} type="date" className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
                  {errors.parcours?.[idx]?.fin && <p className="text-red-500 text-sm mt-2">{errors.parcours[idx].fin.message}</p>}
                </div>
              </div>
            </motion.div>
          ))}
          <button type="button" onClick={() => append({ debut: '', fin: '' })} className="w-full p-4 bg-white border-2 border-dashed border-blue-200 rounded-xl hover:border-blue-300 transition-colors text-blue-600 hover:text-blue-700">
            <div className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              <span className="font-medium">Ajouter une période</span>
            </div>
          </button>
        </div>
      )}
    </motion.form>
  );
}

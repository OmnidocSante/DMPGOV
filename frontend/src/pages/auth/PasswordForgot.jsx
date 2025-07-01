import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

const schema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
});

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [alertContent, setAlertContent] = useState({
    title: "",
    description: "",
  });
  const rootUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";


  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${rootUrl}/api/auth/request-password-reset`,
        {
          email: data.email,
        }
      );

      setAlertContent({
        title: "Succès",
        description:
          "Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.",
      });
    } catch (error) {
      console.log(error);

      setAlertContent({
        title: "Erreur",
        description:
          error?.response?.data?.message || "Une erreur est survenue.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bay-of-many-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AnimatePresence>
        {alertContent.title && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="sm:mx-auto sm:w-full sm:max-w-md mb-4"
          >
            <Alert
              className={
                alertContent.title === "Erreur"
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{alertContent.title}</AlertTitle>
              <AlertDescription>{alertContent.description}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-xl font-extrabold text-bay-of-many-900">
          Demander la réinitialisation du mot de passe
        </h2>
        <p className="mt-2 text-sm text-bay-of-many-700">
          Entrez votre adresse email pour recevoir un lien de réinitialisation
          du mot de passe.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-bay-of-many-700"
              >
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="mt-1 block w-full px-3 py-2 border border-bay-of-many-300 rounded-md shadow-sm placeholder-bay-of-many-400 focus:outline-none focus:ring-bay-of-many-500 focus:border-bay-of-many-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-bay-of-many-600 hover:bg-bay-of-many-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500"
            >
              {isSubmitting
                ? "Envoi en cours..."
                : "Envoyer le lien de réinitialisation"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

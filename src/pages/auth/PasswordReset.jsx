import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[a-z]/, "Le mot de passe doit contenir une lettre minuscule")
      .regex(/[A-Z]/, "Le mot de passe doit contenir une lettre majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre")
      .regex(
        /[^A-Za-z0-9]/,
        "Le mot de passe doit contenir un caractère spécial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function PasswordReset() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState({
    title: "",
    description: "",
  });

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const token = queryParams.get("token");
  const rootUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";


  const onSubmit = async (data) => {
    try {
      await axios.patch(
        `${rootUrl}/api/auth/reset-password?token=${token}`,
        {
          password: data.password,
        }
      );

      setAlertContent({
        title: "Succès",
        description:
          "Mot de passe changé avec succès. Vous allez être redirigé vers la page de connexion.",
      });
      setShowAlert(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setAlertContent({
        title: "Erreur",
        description: error?.response?.data?.message || error.message,
      });
      setShowAlert(true);
    }
  };

  return (
    <div className="min-h-screen bg-bay-of-many-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AnimatePresence>
        {alertContent.title === "Erreur" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="sm:mx-auto sm:w-full sm:max-w-md mb-4"
          >
            <Alert className="text-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{alertContent.title}</AlertTitle>
              <AlertDescription>{alertContent.description}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        {alertContent.title === "Succès" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="sm:mx-auto sm:w-full sm:max-w-md mb-4"
          >
            <Alert className="text-green-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{alertContent.title}</AlertTitle>
              <AlertDescription>{alertContent.description}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-bay-of-many-600 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-bay-of-many-900">
          Modifiez votre mot de passe
        </h2>
        <p className="mt-2 text-sm text-bay-of-many-700">
          Vous êtes à une étape de la récupération de votre compte. Veuillez
          choisir un nouveau mot de passe.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-bay-of-many-700"
              >
                Mot de passe
              </label>
              <input
                type="password"
                {...register("password")}
                className="mt-1 block w-full px-3 py-2 border border-bay-of-many-300 rounded-md shadow-sm placeholder-bay-of-many-400 focus:outline-none focus:ring-bay-of-many-500 focus:border-bay-of-many-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-bay-of-many-700"
              >
                Confirmez le mot de passe
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="mt-1 block w-full px-3 py-2 border border-bay-of-many-300 rounded-md shadow-sm placeholder-bay-of-many-400 focus:outline-none focus:ring-bay-of-many-500 focus:border-bay-of-many-500 sm:text-sm"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-bay-of-many-600 hover:bg-bay-of-many-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500"
            >
              {isSubmitting ? "Création..." : "Créer le mot de passe"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

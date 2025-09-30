import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useToken from "./useToken";

export default function Login() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState({
    title: "",
    description: "",
  });
  const [token, setToken] = useToken();

  const schema = z.object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: zodResolver(schema) });
  const navigate = useNavigate();

  const rootUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${rootUrl}/api/auth/login`, data);
      const receivedToken = response.data.token;

      const payload = receivedToken.split(".")[1];
      const decoded = JSON.parse(atob(payload));

      setToken(receivedToken);

      if (decoded.role !== "PATIENT") {
        navigate(`/${decoded.role.toLowerCase()}`);
      } else {
        navigate(`/patient/${decoded.id}`);
      }
    } catch (error) {
      setAlertContent({
        title: "Erreur de connexion",
        description: error?.response?.data?.message || error.message,
      });
      setShowAlert(true);
    }
  };

  if (token) {

    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    if (decoded.role !== "PATIENT") {
      return <Navigate to={`/${decoded.role.toLowerCase()}`} />;
    } else {
      return <Navigate to={`/patient/${decoded.id}`} />;
    }
  }

  // Render login form
  return (
    <div className="min-h-screen bg-bay-of-many-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AnimatePresence>
        {showAlert && (
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
      </AnimatePresence>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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

        <h2 className="mt-6 text-center text-3xl font-extrabold text-bay-of-many-900">
          Connectez-vous à votre compte
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-bay-of-many-700"
              >
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  {...register("email")}
                  id="email"
                  name="email"
                  className="appearance-none block w-full px-3 py-2 border border-bay-of-many-300 rounded-md shadow-sm placeholder-bay-of-many-400 focus:outline-none focus:ring-bay-of-many-500 focus:border-bay-of-many-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-bay-of-many-700"
              >
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-bay-of-many-300 rounded-md shadow-sm placeholder-bay-of-many-400 focus:outline-none focus:ring-bay-of-many-500 focus:border-bay-of-many-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-bay-of-many-600 hover:bg-bay-of-many-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bay-of-many-500"
              >
                {isSubmitting ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
          </form>
          <Link
            to="/forgot-password"
            className="block text-sm font-medium text-red-700 mt-4 hover:text-red-900 transition-colors duration-200 underline underline-offset-4"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
}

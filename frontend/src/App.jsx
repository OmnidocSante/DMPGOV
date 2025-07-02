import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Users,
  FileText,
  Shield,
  Clock,
  Heart,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronRight,
  Activity,
  Database,
  Bell,
} from "lucide-react";
import doctor from "./assets/images/doctor.jpg";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      icon: Calendar,
      title: "Prise de rendez-vous",
      description: "Réservation de rendez-vous avec notifications de rappel.",
    },
    {
      icon: Users,
      title: "Dossiers des patients",
      description:
        "Profils numériques complets des patients avec antécédents médicaux et plans de traitement.",
    },
    {
      icon: Activity,
      title: "Visualisation des KPIs",
      description:
        "Tableaux de bord visuels présentant les indicateurs clés de performance pour les administrateurs et médecins.",
    },
    {
      icon: Database,
      title: "Stockage Cloud",
      description:
        "Stockage sécurisé basé sur le cloud avec chiffrement des données",
    },
  ];
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = doctor;
  }, [doctor]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                MediCare Pro
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Fonctionnalités
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                À propos
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
              <Button
                className="cursor-pointer bg-black text-white"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-100"
            >
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Fonctionnalités
                </a>
                <a
                  href="#about"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  À propos
                </a>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="outline bg-black text-white">
                    Se connecter
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Optimisation & Sécurité
                </motion.div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Gestion moderne des patients
                  <span className="text-blue-600"> simplifiée</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Une plateforme intuitive pour le suivi médical. Sécurisé,
                  efficace et conçu pour les professionnels de la santé
                  modernes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg bg-black text-white cursor-pointer px-8 py-3"
                  onClick={() => navigate("/login")}
                >
                  Accéder au portail
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Assistance 24/7
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
                <img
                  src={doctor}
                  height={400}
                  width={600}
                  className={`w-full h-auto rounded-lg shadow-2xl ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4"
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">
                        Prochain rendez-vous
                      </p>
                      <p className="text-xs text-gray-500">
                        Dr. Zakaria - 14h30
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1.5,
                  }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4"
                >
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Status de patient</p>
                      <p className="text-xs text-gray-500">Apte</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour gérer les patients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre plateforme complète fournit tous les outils dont les
              professionnels de la santé ont besoin pour offrir des soins aux
              patients exceptionnels de manière efficace.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg shadow-xl border-gray-200/80 transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg mr-4">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={doctor}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Développé avec le soutien de professionnels de santé
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                MediCare Pro a été conçu par des développeurs passionnés, en
                étroite collaboration avec des professionnels de santé, pour
                répondre aux besoins réels du terrain. Notre objectif : proposer
                une solution intuitive, fiable et adaptée à la réalité des soins
                médicaux.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      La sécurité avant tout
                    </h4>
                    <p className="text-gray-600">
                      Chiffrement de bout en bout des données
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Conception centrée sur l'utilisateur
                    </h4>
                    <p className="text-gray-600">
                      Interface intuitive conçue pour les flux de travail des
                      soins de santé occupés
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Contactez-nous
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vous avez des questions sur MediCare Pro ? Notre équipe est là
              pour vous aider à trouver la bonne solution pour votre cabinet.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Téléphone
              </h3>
              <p className="text-gray-600">06 27 55 55 55</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                E-mail
              </h3>
              <p className="text-gray-600">support@omnidoc.ma</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bureau
              </h3>
              <p className="text-gray-600">
                appartement 17 ,Etage 4, al mansour, 101 Bd Yacoub El Mansour,
                Casablanca 20303
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 lg:px-8">
          <div>
            <p className="text-gray-400 text-sm">
              © 2025 Omnidoc ( 1.0.2 ) Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

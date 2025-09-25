import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  BarChart3,
  Plus,
  Save,
  TrendingUp,
  Activity,
  UserCheck,
  Search,
  X,
  FolderOpen,
  LogOut,
  Stethoscope,
  Clock,
} from "lucide-react";
import instance from "../auth/AxiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
import { FixedSizeList as List } from "react-window";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/api/users");
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};

const useDoctorRdv = () => {
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRdvs = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/api/rdv/doctor-appointments");

      setRdvs(response.data);
    } catch (err) {
      if (err.response) {
        const errorData = err.response.data;

        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).join(" | ");
          setError(errorMessages);
        } else if (errorData.message) {
          setError(errorData.message);
        } else {
          setError("Une erreur inconnue est survenue.");
        }

        console.error("Erreur côté serveur:", errorData);
      } else if (err.request) {
        setError("Le serveur ne répond pas. Veuillez réessayer plus tard.");
        console.error("Pas de réponse du serveur:", err.request);
      } else {
        setError("Erreur inattendue: " + err.message);
        console.error("Erreur inattendue:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const createRdv = async (rdvData) => {
    try {
      const response = await instance.post(
        "/api/rdv/create-by-doctor",
        rdvData
      );
      await fetchRdvs();
      return true;
    } catch (err) {
      if (err.response) {
        const errorData = err.response.data;

        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).join(" | ");
          setError(errorMessages);
        } else if (errorData.message) {
          setError(errorData.message);
        } else {
          setError("Une erreur inconnue est survenue.");
        }

        console.error("Erreur côté serveur:", errorData);
      } else if (err.request) {
        setError("Le serveur ne répond pas. Veuillez réessayer plus tard.");
        console.error("Pas de réponse du serveur:", err.request);
      } else {
        setError("Erreur inattendue: " + err.message);
        console.error("Erreur inattendue:", err);
      }

      // Wait 1 second, then clear error and return true
      await new Promise((resolve) => {
        setTimeout(() => {
          setError("");
          resolve();
        }, 1000);
      });

      return true;
    }
  };

  const updateRdvStatus = async (rdvId, status) => {
    try {
      await instance.put(`/api/rdv/${rdvId}/status?statusRDV=${status}`);
      await fetchRdvs();
      return true;
    } catch (err) {
      if (err.response) {
        // Backend responded with an error status (e.g., 400, 500)
        const errorData = err.response.data;

        // Try to extract specific validation messages if available
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).join(" | ");
          setError(errorMessages);
        } else if (errorData.message) {
          setError(errorData.message);
        } else {
          setError("Une erreur inconnue est survenue.");
        }

        console.error("Erreur côté serveur:", errorData);
      } else if (err.request) {
        // Request made but no response received
        setError("Le serveur ne répond pas. Veuillez réessayer plus tard.");
        console.error("Pas de réponse du serveur:", err.request);
      } else {
        // Other errors (like bad config)
        setError("Erreur inattendue: " + err.message);
        console.error("Erreur inattendue:", err);
      }
    }
  };

  useEffect(() => {
    fetchRdvs();
  }, []);

  return {
    rdvs,
    loading,
    error,
    refetch: fetchRdvs,
    createRdv,
    updateRdvStatus,
  };
};

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showRdvModal, setShowRdvModal] = useState(false);
  const [rdvForm, setRdvForm] = useState({
    patientId: "",
    date: "",
    typeRdv: "",
  });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // RDV filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { users, loading: usersLoading, error: usersError } = useUsers();
  const {
    rdvs,
    loading: rdvsLoading,
    error: rdvsError,
    createRdv,
    updateRdvStatus,
  } = useDoctorRdv();

  const navigation = [
    { id: "dashboard", name: "Dashboard", icon: BarChart3 },
    { id: "rdv", name: "Rendez-vous", icon: Calendar },
  ];
  const finishedExams = rdvs.filter((rdv) => rdv.statusRDV === "TERMINE");
  const pendingExams = rdvs.filter((rdv) => rdv.statusRDV === "PLANIFIE");

  const prepareMonthlyChartData = () => {
    const monthlyLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyCounts = Array(12).fill(0);
    rdvs.forEach((rdv) => {
      if (["PLANIFIE", "TERMINE"].includes(rdv.statusRDV)) {
        const date = new Date(rdv.dateTime);
        const monthIndex = date.getMonth();
        monthlyCounts[monthIndex]++;
      }
    });

    return {
      labels: monthlyLabels,
      datasets: [
        {
          label: "Examens Effectués",
          data: monthlyCounts,
          backgroundColor: "rgba(99, 102, 241, 0.6)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Inter",
          },
        },
      },
      title: {
        display: true,
        font: {
          size: 16,
          family: "Inter",
        },
        padding: {
          top: 10,
          bottom: 10,
        },
      },
      tooltip: {
        bodyFont: {
          family: "Inter",
        },
        titleFont: {
          family: "Inter",
        },
      },
    },
  };

  const handleCreateRdv = async () => {
    try {
      const success = await createRdv(rdvForm);
      if (success) {
        setShowRdvModal(false);
        setRdvForm({ patientId: "", date: "", typeRdv: "" });
      }
    } catch (err) {
      console.error("Error creating RDV:", err);
    }
  };

  const handleStatusClick = (rdv) => {
    setSelectedRdv(rdv);
    setNewStatus(rdv.statusRDV);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedRdv || !newStatus) return;

    try {
      const success = await updateRdvStatus(selectedRdv.id, newStatus);
      if (success) {
        setShowStatusModal(false);
        setSelectedRdv(null);
        setNewStatus("");
      }
    } catch (err) {
      console.error("Error updating RDV status:", err);
      alert("Failed to update appointment status");
    }
  };

  const handleSeeFolder = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  // Filter RDVs based on search term and selected date
  const filteredRdvs = rdvs.filter((rdv) => {
    const matchesSearch =
      searchTerm === "" ||
      `${rdv.userName} ${rdv.userLastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDate =
      selectedDate === "" ||
      new Date(rdv.dateTime).toDateString() ===
        new Date(selectedDate).toDateString();

    return matchesSearch && matchesDate;
  });

  const handleSearch = () => {
    console.log("Searching with term:", searchTerm, "and date:", selectedDate);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
  };

  const renderDashboard = () => {
    const monthlyExaminationsData = prepareMonthlyChartData();

    if (users.length < 1) {
      return (
        <div className="flex flex-col h-[100vh]  items-center justify-center py-10 space-y-4">
          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          </motion.div>

          {/* Skeleton shimmer */}
          <motion.div
            className=" bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
            initial={{ backgroundPosition: "200% 0" }}
            animate={{ backgroundPosition: "-200% 0" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "400% 100%",
            }}
          ></motion.div>

          <p className="text-gray-500">Chargement des données...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord du médecin
        </h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.role === "PATIENT").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Mes rendez-vous
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {rdvs.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Rendez-vous d'aujourd'hui
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    rdvs.filter((rdv) => {
                      const today = new Date().toDateString();
                      const rdvDate = new Date(rdv.dateTime).toDateString();
                      return today === rdvDate;
                    }).length
                  }
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Terminé aujourd'hui
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    rdvs.filter((rdv) => {
                      const today = new Date().toDateString();
                      const rdvDate = new Date(rdv.dateTime).toDateString();
                      return today === rdvDate && rdv.statusRDV === "TERMINE";
                    }).length
                  }
                </p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Monthly Examinations Chart */}
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Examens Mensuels
            </h3>
            <div className="h-80">
              <Bar
                data={monthlyExaminationsData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: "Nombre d'examens effectués par mois",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [personSearchTerm, setPersonSearchTerm] = useState("");
  const handleInputChange = (e) => {
    setPersonSearchTerm(e.target.value);
  };

  const filteredPatients = users.filter(
    (user) =>
      user.role === "PATIENT" &&
      (`${user.prénom} ${user.nom}`
        .toLowerCase()
        .includes(personSearchTerm.toLowerCase()) ||
        (user.matriculeId || "")
          .toLowerCase()
          .includes(personSearchTerm.toLowerCase()))
  );

  const RDV_TYPES = [
    { label: "Aprés reprise de travail", data: "APRES_REPRISE_DE_TRAVAIL" },
    { label: "EMBAUCHE", data: "EMBAUCHE" },
    { label: "Accident de Travail", data: "AT" },
    { label: "Permission Payée", data: "PP" },
    { label: "ANNUELLE", data: "ANNUELLE" },
    { label: "DEPART", data: "DEPART" },
    { label: "SPONTANNEE", data: "SPONTANNEE" },
  ];

  const renderRdvManagement = () => {
    // const patients = users.filter((user) => user.role === "PATIENT");

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
          <button
            onClick={() => setShowRdvModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un RDV
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Filtrer les rendez-vous
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search by Patient Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Recherche par nom de patient
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Entrez nom de patient"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Filter by Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Filtrer par date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Actions
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Recherche
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Effacer
                </button>
              </div>
            </div>
          </div>

          {/* Filter Results Info */}
          <div className="mt-4 text-sm text-gray-600">
            Affichage de {filteredRdvs.length} sur {rdvs.length} rendez-vous
            {searchTerm && (
              <span className="ml-2">
                • Recherche pour : "<strong>{searchTerm}</strong>"
              </span>
            )}
            {selectedDate && (
              <span className="ml-2">
                • Date:{" "}
                <strong>{new Date(selectedDate).toLocaleDateString()}</strong>
              </span>
            )}
          </div>
        </div>

        {rdvsLoading ? (
          <div className="text-center py-8">Chargement des RDVs...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type Rendez-vous
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRdvs.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p>
                          {rdvs.length === 0
                            ? "Aucun rendez-vous trouvé"
                            : "Aucun rendez-vous ne correspond à vos critères de recherche"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRdvs.map((rdv) => (
                      <tr key={rdv.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(rdv.dateTime).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {rdv.userName} {rdv.userLastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleStatusClick(rdv)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                              rdv.statusRDV === "PLANIFIE"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                : rdv.statusRDV === "CONFIRME"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : rdv.statusRDV === "ANNULE"
                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                : rdv.statusRDV === "TERMINE"
                                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                : rdv.statusRDV === "PATIENT_ABSENT"
                                ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }`}
                          >
                            {rdv.statusRDV}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {RDV_TYPES.find((type) => type.data === rdv.typeRdv)
                              ?.label ||
                              rdv.typeRdv ||
                              "plannifié"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleSeeFolder(rdv.patientId)}
                            className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                          >
                            <FolderOpen className="h-4 w-4 mr-1" />
                            Voir dossier
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RDV Modal */}
        <AnimatePresence>
          {showRdvModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
              >
                {rdvsError && (
                  <div className="text-center py-8 text-red-600">
                    Error: {rdvsError}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Créer un RDV
                    </h2>
                    <button
                      onClick={() => setShowRdvModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Patient
                      </label>
                      <input
                        type="text"
                        value={personSearchTerm}
                        onChange={handleInputChange}
                        placeholder="Rechercher un patient… ( nom, prénom,matricule ) "
                        className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={rdvForm.patientId}
                        onChange={(e) =>
                          setRdvForm({ ...rdvForm, patientId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner Patient</option>
                        {filteredPatients.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.prénom} {patient.nom} (
                            {patient.matriculeId})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type de rendez-vous
                      </label>
                      <select
                        value={rdvForm.type}
                        onChange={(e) =>
                          setRdvForm({
                            ...rdvForm,
                            typeRdv: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner</option>
                        {RDV_TYPES.map((rdv, index) => (
                          <option key={index} value={rdv.data}>
                            visite {rdv.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date & Heure
                      </label>
                      <input
                        type="date"
                        value={rdvForm.date}
                        onChange={(e) =>
                          setRdvForm({ ...rdvForm, date: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setShowRdvModal(false);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCreateRdv}
                      disabled={
                        rdvForm.date?.length < 2 ||
                        !rdvForm.patientId ||
                        rdvForm.type?.length < 1
                      }
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Plannifier
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Modal */}
        <AnimatePresence>
          {showStatusModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Mettre à jour le statut du RDV
                    </h2>
                    <button
                      onClick={() => {
                        setShowStatusModal(false);
                        setSelectedRdv(null);
                        setNewStatus("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {selectedRdv && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Détails RDV
                        </h3>
                        <p className="text-sm text-gray-600">
                          <strong>Patient:</strong> {selectedRdv.userName}{" "}
                          {selectedRdv.userLastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong>{" "}
                          {new Date(selectedRdv.dateTime).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(selectedRdv.dateTime).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Statut actuel :</strong>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedRdv.statusRDV === "PLANIFIE"
                                ? "bg-blue-100 text-blue-800"
                                : selectedRdv.statusRDV === "CONFIRME"
                                ? "bg-green-100 text-green-800"
                                : selectedRdv.statusRDV === "ANNULE"
                                ? "bg-red-100 text-red-800"
                                : selectedRdv.statusRDV === "TERMINE"
                                ? "bg-gray-100 text-gray-800"
                                : selectedRdv.statusRDV === "PATIENT_ABSENT"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {selectedRdv.statusRDV}
                          </span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nouveau statut
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PLANIFIE">PLANIFIE</option>
                          <option value="TERMINE">TERMINE</option>
                          <option value="ANNULE">ANNULE</option>
                          <option value="PATIENT_ABSENT">PATIENT_ABSENT</option>
                        </select>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Significations des statuts :</strong>
                        </p>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                          <li>
                            • <strong>PLANIFIÉ :</strong> Le rendez-vous est
                            programmé
                          </li>
                          <li>
                            • <strong>TERMINE :</strong> Le rendez-vous s’est
                            déroulé avec succès
                          </li>
                          <li>
                            • <strong>ANNULÉ :</strong> Le rendez-vous a été
                            annulé
                          </li>
                          <li>
                            • <strong>PATIENT_ABSENT :</strong> Le patient ne
                            s’est pas présenté
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setShowStatusModal(false);
                        setSelectedRdv(null);
                        setNewStatus("");
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={
                        !newStatus || newStatus === selectedRdv?.statusRDV
                      }
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Mettre à jour le statut
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0  bg-white shadow-lg w-64  ">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Panel Médecin</h2>
        </div>
        <nav className="mt-6">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeSection === item.id
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("token"), navigate("/");
          }}
          className={`w-fit flex items-center px-6 py-3 text-left transition-colors
                 text-gray-600 hover:bg-gray-50 hover:text-red-500/80 fixed bottom-8 left-0`}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Déconnexion
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === "dashboard" && renderDashboard()}
            {activeSection === "rdv" && renderRdvManagement()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

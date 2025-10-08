import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  TrendingUp,
  Activity,
  UserCheck,
  Search,
  History,
  LogOut,
  Minus,
} from "lucide-react";
import instance from "../auth/AxiosInstance";
import { VILLES } from "@/enums/enums";
import { data, useNavigate } from "react-router-dom";
import useUser from "../auth/useUser";
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
import { Bar, Doughnut } from "react-chartjs-2";
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

  const updateUser = async (userId, userData) => {
    try {
      const response = await instance.put(`/api/users/${userId}`, userData);
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await instance.delete(`/api/users/${userId}`);
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await instance.post("/api/users", userData);
      if (response.data) {
        await fetchUsers();
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    updateUser,
    deleteUser,
    createUser,
    refetch: fetchUsers,
  };
};

const usePatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatientHistory = async (patientId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await instance.get(
        `/api/historique-status/patient/${patientId}`
      );
      setHistory(response.data);
    } catch (err) {
      console.error("Error fetching patient history:", err);
      setError(err.message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, error, fetchPatientHistory };
};

const useRdv = () => {
  const [rdvs, setRdvs] = useState([]);
  console.log(rdvs);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRdvs = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/api/rdv/all");
      setRdvs(response.data);
    } catch (err) {
      alert(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRdvs();
  }, []);

  return { rdvs, loading, error, refetch: fetchRdvs, fetchRdvs };
};
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRDVs() {
  const users = [
    { first: "BOUFARIK", last: "ABDELAZIZ" },
    { first: "ABID", last: "YOUSSEF" },
    { first: "ABOURIZK", last: "ABDERRAHIM" },
    { first: "DAMI", last: "MOUNIR" },
    { first: "KHOUYA", last: "MOHAMED" },
    { first: "ZAKARIA", last: "AMINE" },
  ];

  const doctors = [
    { first: "Khairi", last: "Jalal" },
    { first: "abdelbasset", last: "Hmidchat" },
    { first: "Fatima", last: "Zahra" },
  ];

  const types = ["ANNUELLE", "EMBAUCHE", "APRES_REPRISE_DE_TRAVAIL", null];

  const statuses = ["PLANIFIE", "TERMINE", "ANNULE"];

  let rdvs = [];
  let id = 1;

  function generateForMonth(year, month, count) {
    for (let i = 0; i < count; i++) {
      const user = randomChoice(users);
      const doctor = randomChoice(doctors);
      const typeRdv = randomChoice(types);
      const status = randomChoice(statuses);

      const day = Math.floor(Math.random() * 28) + 1; // 1–28 safe
      const dateTime = new Date(year, month - 1, day).toISOString();

      rdvs.push({
        id: id++,
        dateTime,
        userName: user.first,
        userLastName: user.last,
        doctorName: doctor.first,
        doctorLastName: doctor.last,
        statusRDV: status,
        patientId: Math.floor(Math.random() * 2000) + 1,
        typeRdv: typeRdv,
      });
    }
  }

  generateForMonth(2025, 7, 60);
  generateForMonth(2025, 8, 21);

  return rdvs;
}

const rds = generateRDVs();

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [showRdvModal, setShowRdvModal] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);
  // const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [patientSearchTermFilter, setPatientSearchTermFilter] = useState("");
  const [typeRdv, setTypeRdv] = useState("");

  const [kpi, setKpi] = useState();
  const fetchKpis = async () => {
    try {
      const response = await instance.get("/api/users/kpi");

      setKpi(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  function handleDoctorChange(e) {
    setSelectedDoctor(e.target.value);
    setSelectedPatients([]);
  }

  function handlePatientToggle(e) {
    const id = Number.parseInt(e.target.value);

    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  }
  const handleRdvTypeChange = (e) => {
    setTypeRdv(e.target.value);
  };

  function handleDateChange(e) {
    setSelectedDate(e.target.value);
  }

  function handleStartTimeChange(e) {
    setStartTime(e.target.value);
  }

  async function handleCreateRdv() {
    setIsLoading(true);
    try {
      const base = new Date(`${selectedDate}T${startTime}`);
      const rdvPayload = selectedPatients.map((patientId, idx) => {
        const dt = new Date(base.getTime() + idx * 10 * 60 * 1000);
        return {
          medecinId: selectedDoctor,
          patientId,
          date: dt.toISOString(),
          typeRdv: typeRdv,
        };
      });

      await instance.post("/api/rdv/mass-create", rdvPayload);
      await fetchRdvs();
      setSelectedDoctor("");
      setSelectedPatients([]);
      setSelectedDate("");
      setStartTime("");
      setShowRdvModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function resetModal() {
    setSelectedDoctor(null);
    setSelectedPatients([]);
    setSelectedDate("");
    setStartTime("");
    setShowRdvModal(false);
  }

  // const [rdvForm, setRdvForm] = useState({
  //   patientId: "",
  //   medecinId: "",
  //   date: "",
  // });
  // const [rdvForms, setRdvForms] = useState([
  //   { patientId: "", medecinId: "", date: "" },
  // ]);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // RDV filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("ALL");

  const {
    users,
    loading: usersLoading,
    error: usersError,
    updateUser,
    deleteUser,
    createUser,
  } = useUsers();

  const { rdvs, loading: rdvsLoading, error: rdvsError, fetchRdvs } = useRdv();

  // const prepareChartData = (kpi, selectedCity = "ALL") => {

  //   // All cities
  //   const cities = Object.keys(kpi.aptesPerVilles);

  //   // Filter city data
  //   let cityData = {};
  //   if (selectedCity === "ALL") {
  //     cityData = { ...kpi.aptesPerVilles };
  //   } else if (kpi.aptesPerVilles[selectedCity]) {
  //     cityData[selectedCity] = kpi.aptesPerVilles[selectedCity];
  //   }

  //   // Sum APTE / NON_APTE
  //   let aptes = 0;
  //   let nonAptes = 0;

  //   Object.values(cityData).forEach((city) => {
  //     aptes += city?.APTE || 0;
  //     nonAptes += city?.NON_APTE || 0;
  //   });

  //   // Patient aptitude chart
  //   const patientAptitudeData = {
  //     labels: ["Patients Aptes", "Patients Non Aptes"],
  //     datasets: [
  //       {
  //         data: [aptes, nonAptes],
  //         backgroundColor: ["#34D399", "#EF4444"],
  //         borderColor: ["#10B981", "#DC2626"],
  //         borderWidth: 1,
  //       },
  //     ],
  //   };

  //   // Monthly examinations placeholder
  //   const monthlyLabels = [
  //     "Jan",
  //     "Feb",
  //     "Mar",
  //     "Apr",
  //     "May",
  //     "Jun",
  //     "Jul",
  //     "Aug",
  //     "Sep",
  //     "Oct",
  //     "Nov",
  //     "Dec",
  //   ];
  //   const monthlyCounts = Array(12).fill(0);

  //   const monthlyExaminationsData = {
  //     labels: monthlyLabels,
  //     datasets: [
  //       {
  //         label: "Examens Effectués",
  //         data: monthlyCounts,
  //         backgroundColor: "rgba(99, 102, 241, 0.6)",
  //         borderColor: "rgba(99, 102, 241, 1)",
  //         borderWidth: 1,
  //       },
  //     ],
  //   };

  //   // Chart options
  //   const chartOptions = {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     plugins: {
  //       legend: { position: "top", labels: { font: { family: "Inter" } } },
  //       title: {
  //         display: true,
  //         font: { size: 16, family: "Inter" },
  //         padding: { top: 10, bottom: 10 },
  //       },
  //       tooltip: {
  //         bodyFont: { family: "Inter" },
  //         titleFont: { family: "Inter" },
  //       },
  //     },
  //   };

  //   return {
  //     patientAptitudeData,
  //     monthlyExaminationsData,
  //     chartOptions,
  //     cities,
  //   };
  // };
  const prepareChartData = (kpi, selectedCity = "ALL") => {
    // All cities
    const cities = Object.keys(kpi.aptesPerVilles);

    // Filter city data
    let cityData = {};
    if (selectedCity === "ALL") {
      cityData = { ...kpi.aptesPerVilles };
    } else if (kpi.aptesPerVilles[selectedCity]) {
      cityData[selectedCity] = kpi.aptesPerVilles[selectedCity];
    }

    // Sum APTE / NON_APTE
    let aptes = 0;
    let nonAptes = 0;

    Object.values(cityData).forEach((city) => {
      aptes += city?.APTE || 0;
      nonAptes += city?.NON_APTE || 0;
    });

    // Patient aptitude chart
    const patientAptitudeData = {
      labels: ["Patients Aptes", "Patients Non Aptes"],
      datasets: [
        {
          data: [aptes, nonAptes],
          backgroundColor: ["#34D399", "#EF4444"],
          borderColor: ["#10B981", "#DC2626"],
          borderWidth: 1,
        },
      ],
    };

    // Monthly examinations (count RDVs by month)
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

    rds.forEach((rdv) => {
      const date = new Date(rdv.dateTime);
      const monthIndex = date.getMonth(); // 0 = Jan, 6 = Jul, 7 = Aug ...
      monthlyCounts[monthIndex] += 1;
    });

    const monthlyExaminationsData = {
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

    // Chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", labels: { font: { family: "Inter" } } },
        title: {
          display: true,
          font: { size: 16, family: "Inter" },
          padding: { top: 10, bottom: 10 },
        },
        tooltip: {
          bodyFont: { family: "Inter" },
          titleFont: { family: "Inter" },
        },
      },
    };

    return {
      patientAptitudeData,
      monthlyExaminationsData,
      chartOptions,
      cities,
    };
  };

  const {
    history: patientHistory,
    loading: historyLoading,
    error: historyError,
    fetchPatientHistory,
  } = usePatientHistory();

  const user = useUser();
  const navigation =
    user.role === "ADMIN"
      ? [
          { id: "dashboard", name: "Dashboard", icon: BarChart3 },
          { id: "users", name: "Gestion des utilisateurs", icon: Users },
          { id: "rdv", name: "Rendez-vous", icon: Calendar },
          { id: "history", name: "Historique du patient", icon: History },
        ]
      : user.role === "USER"
      ? [
          { id: "dashboard", name: "Dashboard", icon: BarChart3 },
          { id: "history", name: "Historique du patient", icon: History },
        ]
      : [];

  const [disabled, setDisabled] = useState(false);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      nom: user.nom,
      prénom: user.prénom,
      sexe: user.sexe,
      dateNaissance: user.dateNaissance?.split("T")[0] || "",
      cinId: user.cinId,
      ville: user.ville || VILLES[1].value,
      adresse: user.adresse,
      telephone: user.telephone,
      email: user.email,
      role: user.role,
      profession: user.profession || "",
      matriculeId: user.matriculeId,
      chantier: user.patient?.chantier || "",
    });
    setShowUserModal(true);
  };
  const RDV_TYPES = [
    { label: "Aprés reprise de travail", data: "APRES_REPRISE_DE_TRAVAIL" },
    { label: "EMBAUCHE", data: "EMBAUCHE" },
    { label: "Accident de Travail", data: "AT" },
    { label: "Permission Payée", data: "PP" },
    { label: "ANNUELLE", data: "ANNUELLE" },
    { label: "DEPART", data: "DEPART" },
    { label: "SPONTANNEE", data: "SPONTANNEE" },
  ];

  const handleSaveUser = async () => {
    setDisabled(true);
    if (!validateForm()) {
      return;
    }
    if (selectedUser) {
      const success = await updateUser(selectedUser.id, editForm);
      if (success) {
        setShowUserModal(false);
        setSelectedUser(null);
        setFormErrors({});
        setDisabled(false);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  };

  const handleCreateUser = async () => {
    setDisabled(true);
    console.log("editForm", editForm);

    if (!validateForm()) {
      return;
    }

    const success = await createUser(editForm);
    if (success) {
      setShowCreateModal(false);
      setEditForm({});
      setFormErrors({});
      setDisabled(false);
    }
  };

  const resetCreateForm = () => {
    setEditForm({
      nom: "",
      prénom: "",
      sexe: "M",
      dateNaissance: "",
      cinId: "",
      ville: "",
      adresse: "",
      telephone: "",
      email: "",
      role: "",
      profession: "",
      matriculeId: "",
      chantier: "",
    });
  };

  // Filter RDVs based on search term and selected date
  const filteredRdvs = rdvs.filter((rdv) => {
    const matchesSearch =
      searchTerm === "" ||
      `${rdv.userName} ${rdv.userLastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      `${rdv.doctorName} ${rdv.doctorLastName}`
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

  const handleStatusClick = (rdv) => {
    setSelectedRdv(rdv);
    setNewStatus(rdv.statusRDV);
    setShowStatusModal(true);
  };

  const navigate = useNavigate();

  const handleStatusUpdate = async () => {
    if (!selectedRdv || !newStatus) return;

    try {
      await instance.put(
        `/api/rdv/${selectedRdv.id}/status?statusRDV=${newStatus}`
      );
      await fetchRdvs();

      setShowStatusModal(false);
      setSelectedRdv(null);
      setNewStatus("");
    } catch (err) {
      console.error("Error updating RDV status:", err);
      alert("Failed to update appointment status");
    }
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    if (patientId) {
      fetchPatientHistory(patientId);
    }
  };

  const [formErrors, setFormErrors] = useState({}); // State to hold validation errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setDisabled(false);
    // Clear the error for this field as the user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    let erreurs = {};
    let estValide = true;

    // Vérification des champs obligatoires
    if (!editForm.nom || editForm.nom.trim() === "") {
      erreurs.nom = "Le nom est requis.";
      estValide = false;
    }
    if (!editForm.prénom || editForm.prénom.trim() === "") {
      erreurs.prénom = "Le prénom est requis.";
      estValide = false;
    }
    if (!editForm.email || editForm.email.trim() === "") {
      erreurs.email = "L'adresse email est requise.";
      estValide = false;
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      erreurs.email = "L'adresse email est invalide.";
      estValide = false;
    }
    if (!editForm.telephone || editForm.telephone.trim() === "") {
      erreurs.telephone = "Le numéro de téléphone est requis.";
      estValide = false;
    }
    if (!editForm.sexe) {
      erreurs.sexe = "Le sexe est requis.";
      estValide = false;
    }
    if (!editForm.dateNaissance || editForm.dateNaissance.trim() === "") {
      erreurs.dateNaissance = "La date de naissance est requise.";
      estValide = false;
    }
    if (!editForm.cinId || editForm.cinId.trim() === "") {
      erreurs.cinId = "Le numéro de CIN est requis.";
      estValide = false;
    }
    if (!editForm.matriculeId || editForm.matriculeId.trim() === "") {
      erreurs.matriculeId = "Le matricule est requis.";
      estValide = false;
    }
    if (!editForm.ville || editForm.ville.trim() === "") {
      erreurs.ville = "La ville est requise.";
      estValide = false;
    }
    if (!editForm.adresse || editForm.adresse.trim() === "") {
      erreurs.adresse = "L'adresse est requise.";
      estValide = false;
    }
    if (!editForm.role) {
      erreurs.role = "Le rôle est requis.";
      estValide = false;
    }
    if (!editForm.profession || editForm.profession.trim() === "") {
      erreurs.profession = "La profession est requise.";
      estValide = false;
    }

    setFormErrors(erreurs);
    return estValide;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.prénom} ${user.nom}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      user.matriculeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>

        {start > 1 && <span className="px-2">...</span>}

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded ${
              currentPage === num
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}

        {end < totalPages && <span className="px-2">...</span>}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    );
  };

  const renderDashboard = () => {
    if (!kpi) {
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

    const {
      patientAptitudeData,
      monthlyExaminationsData,
      chartOptions,
      cities,
    } = prepareChartData(kpi, selectedCity);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total des utilisateurs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total RDVs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* {rdvs.length} */}
                  81
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.role === "PATIENT").length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Médecins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.role === "MEDECIN").length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Monthly Examinations Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Examens Mensuels
            </h3>
            <div className="h-64">
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

          {/* Jockey Aptitude Chart */}
          {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par ville
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="ALL">Toutes les villes</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city.includes("_")
                      ? `${city.split("_")[0]} ${city.split("_")[1]}`
                      : city}
                  </option>
                ))}
              </select>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Aptitude des Jockeys (
              {selectedCity === "ALL" ? "Toutes les villes" : selectedCity})
            </h3>
            <div className="h-64">
              <Doughnut
                data={patientAptitudeData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: "Répartition des patients par aptitude",
                    },
                  },
                }}
              />
            </div>
          </div> */}
        </div>
      </div>
    );
  };
  console.log("users", users);

  const renderUserManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des utilisateurs
          </h1>
          <div className="flex justify-between gap-x-4 items-center mb-4">
            <input
              type="text"
              placeholder="Rechercher par nom, matricule ou rôle..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border rounded-md w-fit focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => {
                resetCreateForm();
                setShowCreateModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer un utilisateur
            </button>
          </div>
        </div>

        {usersLoading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : usersError && users.length < 1 ? (
          <div className="text-center py-8 text-red-600">
            Error: {usersError}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ville
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.prénom} {user.nom}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-red-100 text-red-800"
                              : user.role === "MEDECIN"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "PATIENT"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.ville}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const patients = users.filter((user) => user.role === "PATIENT");

  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const filteredPatients = useMemo(() => {
    return patients.filter(
      (p) =>
        (!patientSearchTermFilter ||
          `${p.prénom} ${p.nom}`
            .toLowerCase()
            .includes(patientSearchTermFilter.toLowerCase()) ||
          (p.matriculeId &&
            p.matriculeId
              .toLowerCase()
              .includes(patientSearchTermFilter.toLowerCase()))) &&
        (p.medecinId === selectedDoctor || true)
    );
  }, [patients, patientSearchTermFilter, selectedDoctor]);

  const renderRdvManagement = () => {
    const doctors = users.filter((user) => user.role === "MEDECIN");

    return (
      <>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des rendez-vous
            </h1>

            <button
              onClick={() => setShowRdvModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer des rendez-vous
            </button>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Filtrer les rendez-vous
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search by Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rechercher par nom du patient ou du médecin
                </label>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Entrez le nom du patient ou du médecin..."
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
                    Rechercher
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
                  • Date :{" "}
                  <strong>{new Date(selectedDate).toLocaleDateString()}</strong>
                </span>
              )}
            </div>
          </div>

          {rdvsLoading ? (
            <div className="text-center py-8">Chargement des RDVs...</div>
          ) : rdvsError ? (
            <div className="text-center py-8 text-red-600">
              Error: {rdvsError}
            </div>
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
                        Docteur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
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
                            <div className="text-sm font-medium text-gray-900">
                              Dr. {rdv.doctorName} {rdv.doctorLastName}
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
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-lg shadow-xl max-w-3xl w-full"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">
                        Créer des RDVs
                      </h2>
                      <button
                        onClick={resetModal}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Doctor selector */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Médecin
                      </label>
                      <input
                        type="text"
                        placeholder="Rechercher un médecin..."
                        value={doctorSearchTerm}
                        onChange={(e) => setDoctorSearchTerm(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={selectedDoctor}
                        onChange={handleDoctorChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-10"
                      >
                        <option value="">Sélectionner</option>
                        {doctors
                          .filter((d) =>
                            `${d.prénom} ${d.nom}`
                              .toLowerCase()
                              .includes(doctorSearchTerm.toLowerCase())
                          )
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              Dr. {d.prénom} {d.nom}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type des rendez-vous
                      </label>
                      <select
                        value={typeRdv}
                        onChange={handleRdvTypeChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-10"
                      >
                        <option value="">Sélectionner</option>
                        {RDV_TYPES.map((rdv, index) => (
                          <option key={index} value={rdv.data}>
                            visite {rdv.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Patients multi-checkbox */}
                    {selectedDoctor && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Patients
                        </label>

                        {/* Search input */}
                        <input
                          type="text"
                          placeholder="Rechercher par nom, prénom ou matricule..."
                          value={patientSearchTermFilter}
                          onChange={(e) =>
                            setPatientSearchTermFilter(e.target.value)
                          }
                          className="w-full mb-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Filtered checkbox list */}
                        <div className="border rounded-md p-2 max-h-40 overflow-auto">
                          <List
                            height={120} // max height
                            itemCount={filteredPatients.length}
                            itemSize={35} // height of one checkbox row
                            width="100%"
                          >
                            {({ index, style }) => {
                              const p = filteredPatients[index];
                              return (
                                <label
                                  key={p.id}
                                  style={style}
                                  className="flex items-center"
                                >
                                  <input
                                    type="checkbox"
                                    value={p.id}
                                    checked={selectedPatients.includes(p.id)}
                                    onChange={handlePatientToggle}
                                    className="mr-2"
                                  />
                                  {p.prénom} {p.nom}
                                  {p.matriculeId && (
                                    <span className="ml-2 text-xs text-gray-400">
                                      ({p.matriculeId})
                                    </span>
                                  )}
                                </label>
                              );
                            }}
                          </List>
                        </div>
                      </div>
                    )}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {selectedPatients
                        .map((id) => {
                          const patient = patients.find((p) => p.id === id);
                          return patient
                            ? `${patient.nom} ${patient.prénom}`
                            : "";
                        })
                        .filter(Boolean)
                        .join(", ")}
                    </label>

                    {/* Date and starting time */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Heure début
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={handleStartTimeChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-10"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowRdvModal(false)}
                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleCreateRdv}
                        disabled={
                          !selectedDoctor ||
                          selectedPatients.length === 0 ||
                          !selectedDate ||
                          !startTime ||
                          isLoading ||
                          typeRdv === ""
                        }
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Créer RDVs
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
                        Mettre à jour le statut du rendez-vous
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
                            <strong>Doctor:</strong> Dr.{" "}
                            {selectedRdv.doctorName}{" "}
                            {selectedRdv.doctorLastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Date:</strong>{" "}
                            {new Date(
                              selectedRdv.dateTime
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              selectedRdv.dateTime
                            ).toLocaleTimeString()}
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
                            <option value="PATIENT_ABSENT">
                              PATIENT_ABSENT
                            </option>
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
                        Cancel
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
      </>
    );
  };

  const renderUserHistory = () => {
    const patients = users.filter((user) => user.role === "PATIENT");
    const selectedPatient = patients.find(
      (p) => p.id.toString() === selectedPatientId
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Patient History</h1>
        </div>

        {/* Patient Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Patient
          </h3>

          {/* Search Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher un patient par nom
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Tapez le nom ou le matricule du patient..."
                  value={patientSearchTerm}
                  onChange={(e) => {
                    setPatientSearchTerm(e.target.value);
                    // Clear selected patient when searching
                    if (e.target.value && selectedPatientId) {
                      setSelectedPatientId("");
                    }
                  }}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Dropdown Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ou sélectionnez dans la liste déroulante
              </label>

              <select
                value={selectedPatientId}
                onChange={(e) => {
                  handlePatientSelect(e.target.value);
                  if (e.target.value) {
                    setPatientSearchTerm("");
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez un patient...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.prénom} {patient.nom} - {patient.matriculeId}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Results */}
            {patientSearchTerm && (
              <div className="border border-gray-200 rounded-md max-h-48 overflow-y-auto">
                <div className="p-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Résultats de la recherche :
                  </p>

                  {patients
                    .filter((patient) =>
                      `${patient.prénom} ${patient.nom}`
                        .toLowerCase()
                        .includes(patientSearchTerm.toLowerCase())
                    )
                    .map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => {
                          handlePatientSelect(patient.id.toString());
                          setPatientSearchTerm(
                            `${patient.prénom} ${patient.nom}`
                          );
                        }}
                        su
                        className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {patient.prénom} {patient.nom}
                        </div>
                        <div className="text-xs text-gray-500">
                          {patient.email}
                        </div>
                      </button>
                    ))}
                  {patients.filter(
                    (patient) =>
                      `${patient.prénom} ${patient.nom}`
                        .toLowerCase()
                        .includes(patientSearchTerm.toLowerCase()) ||
                      patient.matriculeId
                        .toLowerCase()
                        .includes(patientSearchTerm.toLowerCase())
                  ).length === 0 && (
                    <p className="text-sm text-gray-500 p-2">
                      Aucun patient ne correspond à votre recherche.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedPatient && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Selected Patient Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <p>
                  <strong>Name:</strong> {selectedPatient.prénom}{" "}
                  {selectedPatient.nom}
                </p>
                <p>
                  <strong>Email:</strong> {selectedPatient.email}
                </p>
                <p>
                  <strong>Numéro de téléphone:</strong>{" "}
                  {selectedPatient.telephone}
                </p>
                <p>
                  <strong>Ville:</strong> {selectedPatient.ville}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* History Results */}
        {selectedPatientId && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Historique du statut du patient
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Afficher l’historique des statuts de {selectedPatient?.prénom}{" "}
                {selectedPatient?.nom}
              </p>
            </div>

            {historyLoading ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  Loading patient history...
                </div>
              </div>
            ) : historyError ? (
              <div className="text-center py-8 text-red-600">
                <History className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p>Error loading patient history: {historyError}</p>
              </div>
            ) : patientHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p>Aucun historique trouvé pour ce patient</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Heure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Médecin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commentaire
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patientHistory.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(record.date).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {record.doctorName} {record.doctorLastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {record.patientName} {record.patientLastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              record.status === "A_RECLASSER"
                                ? "bg-yellow-100 text-yellow-800"
                                : record.status === "APTE"
                                ? "bg-green-100 text-green-800"
                                : record.status === "INAPTE_DEFINITIF"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {record.comment}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderUserModal = () => (
    <AnimatePresence>
      {(showUserModal || showCreateModal) && (
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
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {showCreateModal ? "Create User" : "Edit User"}
                </h2>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setShowCreateModal(false);
                    setSelectedUser(null);
                    setFormErrors({}); // Clear errors when closing modal
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom" // Added name attribute
                    value={editForm.nom || ""}
                    onChange={handleInputChange} // Using unified handler
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.nom
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {formErrors.nom && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.nom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prénom" // Added name attribute
                    value={editForm.prénom || ""}
                    onChange={handleInputChange} // Using unified handler
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.prénom
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {formErrors.prénom && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.prénom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email" // Added name attribute
                    value={editForm.email || ""}
                    onChange={handleInputChange} // Using unified handler
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="text"
                    name="telephone" // Added name attribute
                    value={editForm.telephone || ""}
                    onChange={handleInputChange} // Using unified handler
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.telephone
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {formErrors.telephone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.telephone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexe
                  </label>
                  <select
                    name="sexe" // Added name attribute
                    value={editForm.sexe || "M"}
                    onChange={handleInputChange} // Using unified handler
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.sexe
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  {formErrors.sexe && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.sexe}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="dateNaissance" // Added name attribute
                    value={editForm.dateNaissance || ""}
                    onChange={handleInputChange} // Using unified handler
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.dateNaissance
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {formErrors.dateNaissance && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.dateNaissance}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CIN ID
                  </label>
                  <input
                    type="text"
                    name="cinId" // Added name attribute
                    value={editForm.cinId || ""}
                    onChange={handleInputChange} // Using unified handler
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.cinId
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {formErrors.cinId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.cinId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <select
                    name="ville" // Added name attribute
                    onChange={handleInputChange} // Using unified handler
                    value={editForm.ville || ""}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.ville
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <option value="">-- Sélectionner une ville --</option>
                    {VILLES.map((ville) => (
                      <option key={ville.value} value={ville.value}>
                        {ville.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.ville && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.ville}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adresse" // Added name attribute
                    value={editForm.adresse || ""}
                    onChange={handleInputChange} // Using unified handler
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.adresse
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {formErrors.adresse && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.adresse}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    N° Matricule
                  </label>
                  <input
                    type="text"
                    name="matriculeId"
                    value={editForm.matriculeId || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.matriculeId
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {formErrors.matriculeId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.matriculeId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role" // Added name attribute
                    value={editForm.role || ""}
                    onChange={handleInputChange} // Using unified handler
                    className={`w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.role
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    {/* Optional: Default prompt option */}
                    <option value="">-- Sélectionner un rôle --</option>
                    <option value="ADMIN">admin</option>
                    <option value="MEDECIN">docteur</option>
                    <option value="PATIENT">patient</option>
                    <option value="USER">user de consultation</option>
                  </select>
                  {formErrors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.role}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profession
                  </label>
                  <input
                    type="text"
                    name="profession" // Added name attribute
                    value={editForm.profession || ""}
                    onChange={handleInputChange} // Using unified handler
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.profession
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {formErrors.profession && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.profession}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setShowCreateModal(false);
                    setSelectedUser(null);
                    setDisabled(false);
                    setFormErrors({}); // Clear errors when closing modal
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={showCreateModal ? handleCreateUser : handleSaveUser}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={disabled}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {showCreateModal ? "Create" : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg ">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">
            {user.role === "ADMIN"
              ? "Panneau d’administration"
              : "Panneau utilisateur"}
          </h2>
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
      </div>
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
            {activeSection === "users" && (
              <>
                <div>{renderUserManagement()}</div>
                <div>{renderPagination()}</div>
              </>
            )}
            {activeSection === "rdv" && renderRdvManagement()}
            {activeSection === "history" && renderUserHistory()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal */}
      {renderUserModal()}
    </div>
  );
}

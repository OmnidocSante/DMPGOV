import { useState, useEffect } from "react";
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
} from "lucide-react";
import instance from "../auth/AxiosInstance";
import { VILLES } from "@/enums/enums";
import { useNavigate } from "react-router-dom";
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
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRdvs = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/api/rdv/all");
      console.log(response.data);
      

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

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  console.log("edit form", editForm);

  const [showRdvModal, setShowRdvModal] = useState(false);
  const [rdvForm, setRdvForm] = useState({
    patientId: "",
    medecinId: "",
    date: "",
  });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // RDV filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("ALL");

  const handleCreateRdv = async () => {
    try {
      await instance.post("/api/rdv/create", rdvForm);
      await fetchRdvs();
      setShowRdvModal(false);
      setRdvForm({ patientId: "", medecinId: "", dateTime: "" });
    } catch (err) {
      console.error("Error creating RDV:", err);
    }
  };

  const {
    users,
    loading: usersLoading,
    error: usersError,
    updateUser,
    deleteUser,
    createUser,
  } = useUsers();

  const { rdvs, loading: rdvsLoading, error: rdvsError, fetchRdvs } = useRdv();


   const prepareChartData = () => {
   
    const patients = users.filter(user => user.role === "PATIENT");
    console.log(patients);
    
    const doctors = users.filter(user => user.role === "MEDECIN");
    
    // Prepare cities for filter
    const cities = Array.from(
      new Set(patients.map(j => j.ville).filter(Boolean)
    ));
    
    
    // Filter jockeys by selected city
    const filteredJockeys = selectedCity === "ALL"
      ? patients
      : patients.filter(j => j.ville === selectedCity);

      console.log(filteredJockeys);
      
    
    // Calculate jockey aptitude data
    const aptes = filteredJockeys.filter(j => j.patient.status === "APTE").length;
    const nonAptes = filteredJockeys.filter(j => j.patient.status !== "APTE").length;
    
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
    
    // Calculate monthly examinations data
    const monthlyLabels = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const monthlyCounts = Array(12).fill(0);
    rdvs.forEach(rdv => {
      if (["PLANIFIE", "TERMINE"].includes(rdv.statusRDV)) {
        const date = new Date(rdv.dateTime);
        monthlyCounts[date.getMonth()]++;
      }
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
        legend: {
          position: "top",
          labels: { font: { family: "Inter" } }
        },
        title: {
          display: true,
          font: { size: 16, family: "Inter" },
          padding: { top: 10, bottom: 10 }
        },
        tooltip: {
          bodyFont: { family: "Inter" },
          titleFont: { family: "Inter" }
        }
      }
    };
    
    return {
      patientAptitudeData,
      monthlyExaminationsData,
      chartOptions,
      cities
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
          { id: "users", name: "User Management", icon: Users },
          { id: "rdv", name: "Rendez-vous", icon: Calendar },
          { id: "history", name: "Patient History", icon: History },
        ]
      : user.role === "USER"
      ? [
          { id: "dashboard", name: "Dashboard", icon: BarChart3 },
          { id: "history", name: "Patient History", icon: History },
        ]
      : [];

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
    });
    setShowUserModal(true);
  };
  console.log(editForm.ville);

  const handleSaveUser = async () => {
    if (selectedUser) {
      const success = await updateUser(selectedUser.id, editForm);
      if (success) {
        setShowUserModal(false);
        setSelectedUser(null);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  };

  const handleCreateUser = async () => {
    const success = await createUser(editForm);
    if (success) {
      setShowCreateModal(false);
      setEditForm({});
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
      role: "PATIENT",
      profession: "",
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

  const renderDashboard = () => {
    const { patientAptitudeData, monthlyExaminationsData, chartOptions, cities } = prepareChartData();
    
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total RDVs</p>
                <p className="text-2xl font-bold text-gray-900">{rdvs.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === "PATIENT").length}
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
                  {users.filter(u => u.role === "MEDECIN").length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
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
          </div>
        </div>
      </div>
    );
  };


  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => {
            resetCreateForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </button>
      </div>

      {usersLoading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : usersError && users.length < 1 ? (
        <div className="text-center py-8 text-red-600">Error: {usersError}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.prénom} {user.nom}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
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
                      {user.telephone}
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

  const renderRdvManagement = () => {
    const patients = users.filter((user) => user.role === "PATIENT");
    const doctors = users.filter((user) => user.role === "MEDECIN");

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Rendez-vous Management
          </h1>
          <button
            onClick={() => setShowRdvModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create RDV
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Filter Appointments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search by Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Search by Patient or Doctor Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter patient or doctor name..."
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
                Filter by Date
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
                  Search
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Filter Results Info */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRdvs.length} of {rdvs.length} appointments
            {searchTerm && (
              <span className="ml-2">
                • Searching for: "<strong>{searchTerm}</strong>"
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
          <div className="text-center py-8">Loading RDVs...</div>
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
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                            ? "No appointments found"
                            : "No appointments match your search criteria"}
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
                          <div className="text-sm text-gray-500">
                            {new Date(rdv.dateTime).toLocaleTimeString()}
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
                      Create Appointment
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
                      <select
                        value={rdvForm.patientId}
                        onChange={(e) =>
                          setRdvForm({ ...rdvForm, patientId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Patient</option>
                        {patients.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.prénom} {patient.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Doctor
                      </label>
                      <select
                        value={rdvForm.medecinId}
                        onChange={(e) =>
                          setRdvForm({ ...rdvForm, medecinId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr. {doctor.prénom} {doctor.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date & Time
                      </label>
                      <input
                        type="datetime-local"
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
                      onClick={() => setShowRdvModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateRdv}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Create
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
                      Update Appointment Status
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
                          Appointment Details
                        </h3>
                        <p className="text-sm text-gray-600">
                          <strong>Patient:</strong> {selectedRdv.userName}{" "}
                          {selectedRdv.userLastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Doctor:</strong> Dr. {selectedRdv.doctorName}{" "}
                          {selectedRdv.doctorLastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong>{" "}
                          {new Date(selectedRdv.dateTime).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(selectedRdv.dateTime).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Current Status:</strong>{" "}
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
                          New Status
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
                          <strong>Status Meanings:</strong>
                        </p>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                          <li>
                            • <strong>PLANIFIE:</strong> Appointment is
                            scheduled
                          </li>
                          <li>
                            • <strong>TERMINE:</strong> Appointment completed
                            successfully
                          </li>
                          <li>
                            • <strong>ANNULE:</strong> Appointment was cancelled
                          </li>
                          <li>
                            • <strong>PATIENT_ABSENT:</strong> Patient did not
                            show up
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
                      Update Status
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
                Search for a patient by name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type patient name or email..."
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
                Or select from dropdown
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  handlePatientSelect(e.target.value);
                  // Clear search when selecting from dropdown
                  if (e.target.value) {
                    setPatientSearchTerm("");
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a patient...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.prénom} {patient.nom} - {patient.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Results */}
            {patientSearchTerm && (
              <div className="border border-gray-200 rounded-md max-h-48 overflow-y-auto">
                <div className="p-2">
                  <p className="text-sm text-gray-600 mb-2">Search Results:</p>
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
                      patient.email
                        .toLowerCase()
                        .includes(patientSearchTerm.toLowerCase())
                  ).length === 0 && (
                    <p className="text-sm text-gray-500 p-2">
                      No patients found matching your search.
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
                  <strong>Phone:</strong> {selectedPatient.telephone}
                </p>
                <p>
                  <strong>City:</strong> {selectedPatient.ville}
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
                Patient Status History
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing status history for {selectedPatient?.prénom}{" "}
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
                <p>No history records found for this patient</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
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
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editForm.prénom || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, prénom: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editForm.nom || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nom: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.telephone || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, telephone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={editForm.sexe || "M"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, sexe: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={editForm.dateNaissance || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        dateNaissance: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CIN ID
                  </label>
                  <input
                    type="text"
                    value={editForm.cinId || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, cinId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    onChange={(e) => {
                      setEditForm({ ...editForm, ville: e.target.value });
                    }}
                    value={editForm.ville || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {VILLES.map((ville) => (
                      <option value={ville.value}>{ville.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editForm.adresse || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, adresse: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={editForm.role || "PATIENT"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ADMIN">admin</option>
                    <option value="MEDECIN">docteur</option>
                    <option value="PATIENT">patient</option>
                    <option value="USER">user de consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={editForm.profession || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, profession: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setShowCreateModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showCreateModal ? handleCreateUser : handleSaveUser}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
            {user.role === "ADMIN" ? "Admin Panel" : "User Panel"}
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
        className={`w-full flex items-center px-6 py-3 text-left transition-colors
         text-gray-600 hover:bg-gray-50 hover:text-gray-900 absolute bottom-8 left-0`}
      >
        <LogOut className="h-5 w-5 mr-3" />
        Log out
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
            {activeSection === "users" && renderUserManagement()}
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

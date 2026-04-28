import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

// ── Icons ──────────────────────────────────────────────────────────────────
const GridIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const PeopleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const PersonPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const HelpCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const SupportIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ── Avatar ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#14B8A6"];

const Avatar = ({ name, size = 36 }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colorIndex = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: AVATAR_COLORS[colorIndex],
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.34, fontWeight: 700, color: "white", flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

export default function AddEmployee() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const companyName = localStorage.getItem("companyName") || "Acme Corp";

  // Form state
  const [fullName, setFullName] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [overtimeRate, setOvertimeRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Recently added employees
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const getInitials = (name) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const token = localStorage.getItem("token");

  // Fetch recently added employees
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentEmployees(res.data.employees);
      } catch {
        // silently fail
      } finally {
        setLoadingRecent(false);
      }
    };
    if (token) fetchRecent();
    else setLoadingRecent(false);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/employees",
        {
          fullName,
          monthlySalary: Number(monthlySalary.replace(/,/g, "")),
          overtimeRate: overtimeRate ? Number(overtimeRate.replace(/,/g, "")) : 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(`${res.data.employee.fullName} added successfully!`);
      setRecentEmployees((prev) => [res.data.employee, ...prev].slice(0, 5));

      // Reset form
      setFullName("");
      setMonthlySalary("");
      setOvertimeRate("");

      // Clear success after 3s
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <GridIcon />, path: "/dashboard" },
    { id: "employees", label: "Employees", icon: <PeopleIcon />, path: "/add-employee" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <Helmet>
        <title>Add Employee | PaySphere</title>
        <meta name="description" content="Add a new employee to your payroll. Enter basic details to include them in the next payroll run." />
      </Helmet>

      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`w-56 bg-white border-r border-gray-200 fixed inset-y-0 left-0 flex flex-col z-50 transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              ₹
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">{companyName}</p>
              <p className="text-xs text-gray-400">Payroll ID: 8821</p>
            </div>
          </div>
          <button
            className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition ${
                item.id === "employees"
                  ? "bg-indigo-50 text-blue-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 space-y-2">
          <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition">
            <SupportIcon />
            Help & Support
          </button>
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition">
            Run Payroll
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col md:ml-56 transition-all duration-300">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <span className="font-bold text-blue-900 truncate">Ledger Payroll</span>
            <button className="hidden sm:block text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5 whitespace-nowrap">
              April 2026
            </button>
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <button className="hidden sm:flex"><BellIcon /></button>
            <button className="hidden sm:flex"><HelpCircleIcon /></button>
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
              {getInitials(companyName)}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("companyName");
                navigate("/auth");
              }}
              className="px-3 py-1.5 text-sm font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">

            {/* ── LEFT: Form Section ── */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-2">Add Employee</h1>
              <p className="text-gray-500 text-sm mb-8">
                Enter basic details to add someone to the next payroll run.
              </p>

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                {/* Full Name */}
                <label className="block mb-5">
                  <span className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 block">Full Name</span>
                  <input
                    id="employee-full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border border-transparent outline-none transition text-sm"
                  />
                </label>

                {/* Salary Row */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <label className="flex-1">
                    <span className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 block">Monthly Salary (₹)</span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                      <input
                        id="employee-salary"
                        type="text"
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(e.target.value.replace(/[^0-9,]/g, ""))}
                        placeholder="45,000"
                        required
                        className="w-full pl-8 pr-4 py-3.5 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border border-transparent outline-none transition text-sm"
                      />
                    </div>
                  </label>

                  <label className="flex-1">
                    <span className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 block">Overtime Rate (Optional)</span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                      <input
                        id="employee-overtime"
                        type="text"
                        value={overtimeRate}
                        onChange={(e) => setOvertimeRate(e.target.value.replace(/[^0-9,]/g, ""))}
                        placeholder="250 / hr"
                        className="w-full pl-8 pr-4 py-3.5 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border border-transparent outline-none transition text-sm"
                      />
                    </div>
                  </label>
                </div>

                {/* Messages */}
                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm font-medium flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {success}
                  </div>
                )}

                {/* Submit */}
                <button
                  id="add-employee-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PersonPlusIcon />
                  {loading ? "Adding..." : "Add Employee"}
                </button>
              </form>
            </div>

            {/* ── RIGHT: Sidebar Cards ── */}
            <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-6">

              {/* Recently Added */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircleIcon />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Recently Added</h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      Employees added here will automatically appear in your April 2026 payroll worksheet.
                    </p>
                  </div>
                </div>

                <div className="space-y-0">
                  {loadingRecent ? (
                    <div className="py-6 text-center text-sm text-gray-400">Loading...</div>
                  ) : recentEmployees.length === 0 ? (
                    <div className="py-6 text-center text-sm text-gray-400">No employees added yet.</div>
                  ) : (
                    recentEmployees.slice(0, 3).map((emp) => (
                      <div key={emp._id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                        <Avatar name={emp.fullName} size={36} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{emp.fullName}</p>
                          <p className="text-xs text-gray-400 truncate">{emp.role || "Employee"}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {fmt(emp.monthlySalary)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-3 text-blue-600 text-sm font-semibold hover:text-blue-700 transition flex items-center gap-1"
                >
                  View Full Directory <ArrowRightIcon />
                </button>
              </div>

              {/* Speed Tip Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 p-6 text-white shadow-lg">
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />
                <div className="absolute top-12 right-10 w-16 h-16 rounded-full bg-blue-500/10" />

                <div className="relative z-10">
                  <h3 className="font-bold text-base mb-1.5">Speed Tip</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    You can bulk upload employees via CSV in the Settings menu for larger teams.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

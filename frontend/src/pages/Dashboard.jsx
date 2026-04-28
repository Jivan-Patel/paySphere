import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// --- Dashboard Component ---
const DashboardOverview = ({ search, setSearch, filtered, getInitials, onAddUpdate, onAddEmployee }) => (
  <main className="p-4 sm:p-8">
    {/* Title */}
    <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
      <div>
        <p className="text-sm text-gray-400">Monthly Overview</p>
        <h1 className="text-3xl sm:text-4xl font-serif text-gray-900">April 2026</h1>
      </div>

      <div className="flex gap-3 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold hover:shadow">
          Reports
        </button>

        <button className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold">
          Run Payroll
        </button>
      </div>
    </div>

    {/* Stats */}
    <div className="flex flex-col sm:flex-row gap-4 mb-10">
      <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-xs uppercase text-gray-400 font-bold mb-2">
          Total Monthly Payout
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold">₹12,45,000</h2>
        <p className="text-green-500 text-sm mt-2">+4.2% vs last month</p>
      </div>

      <div className="w-full sm:w-64 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-xs uppercase text-gray-400 font-bold mb-2">
          Employees
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold">24</h2>
        <p className="text-gray-400 text-sm">Active this month</p>
      </div>
    </div>

    {/* Search */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h2 className="text-lg font-bold">Employee Directory</h2>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search employees..."
        className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
      />
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {filtered.map((emp) => {
        const isPending = emp.status === "Pending";

        return (
          <div key={emp.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: emp.color }}
                >
                  {getInitials(emp.name)}
                </div>

                <div>
                  <p className="font-bold text-sm">{emp.name}</p>
                  <p className="text-xs text-gray-400">{emp.role}</p>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-2 py-1 rounded-md border ${
                  isPending
                    ? "bg-orange-50 text-orange-600 border-orange-200"
                    : "bg-green-50 text-green-600 border-green-200"
                }`}
              >
                {emp.status}
              </span>
            </div>

            {/* Salary */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-400 uppercase">
                Base Salary
              </p>
              <p className="text-lg font-bold">{emp.salary}</p>
            </div>

            {/* Button */}
            <button 
              onClick={onAddUpdate}
              className="border border-gray-200 rounded-lg py-2 text-blue-600 font-semibold hover:bg-indigo-50"
            >
              + Add Update
            </button>
          </div>
        );
      })}

      {/* Add Card */}
      <div
        onClick={onAddEmployee}
        className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center min-h-45 hover:border-blue-500 hover:bg-indigo-50 cursor-pointer transition"
      >
        <p className="text-gray-400 font-semibold">+ Add Employee</p>
      </div>
    </div>
  </main>
);

// --- Employees Component ---
const EmployeeManagement = () => {
  const employees = [
    { id: 1, name: "Arjun Mehta", role: "Senior Developer", base: 120000, additions: 15400, deductions: 8200 },
    { id: 2, name: "Priya Sharma", role: "Product Designer", base: 95000, additions: 5000, deductions: 2500 },
    { id: 3, name: "Rohan Gupta", role: "Marketing Lead", base: 88000, additions: 0, deductions: 4400 },
    { id: 4, name: "Anjali Kapoor", role: "HR Manager", base: 72000, additions: 2200, deductions: 3600 },
  ];

  const fmt = (n) => "₹" + Math.abs(n).toLocaleString("en-IN");
  const totalNet = employees.reduce((s, e) => s + e.base + e.additions - e.deductions, 0);

  const initials = (name) =>
    name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <main className="p-4 sm:p-8">
      {/* Summary */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200 mb-4">
            Payroll done in 30 seconds
          </span>

          <p className="text-sm text-gray-400 mb-1">April 2026 Final Summary</p>

          <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-2">
            ₹{totalNet.toLocaleString("en-IN")}
          </h1>

          <p className="text-sm text-gray-400">
            Total Monthly Payout for <span className="text-gray-700 font-semibold">14 Employees</span>
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-5 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:shadow">
            Edit Updates
          </button>

          <button className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
            Finish & Pay
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {employees.map(emp => {
          const net = emp.base + emp.additions - emp.deductions;

          return (
            <div key={emp.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {initials(emp.name)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{emp.name}</p>
                    <p className="text-xs text-gray-400">{emp.role}</p>
                  </div>
                </div>

                <button className="p-2 rounded-lg hover:bg-indigo-50">
                  ⬇
                </button>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Base Salary</span>
                  <span className="font-semibold">{fmt(emp.base)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-green-600">+ Additions</span>
                  <span className="text-green-600 font-semibold">
                    + {fmt(emp.additions)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-red-600">− Deductions</span>
                  <span className="text-red-600 font-semibold">
                    - {fmt(emp.deductions)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-200 mb-4" />

              {/* Net */}
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase text-gray-400 font-bold">
                  Net Salary
                </span>
                <span className="text-2xl font-semibold text-blue-600">
                  {fmt(net)}
                </span>
              </div>
            </div>
          );
        })}

        {/* View More */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center min-h-50 hover:border-blue-500 hover:bg-indigo-50 cursor-pointer">
          <p className="text-gray-400 font-semibold">
            + View more employees
          </p>
        </div>
      </div>
    </main>
  );
};

export default function PaySphereDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const companyName = localStorage.getItem("companyName") || "Acme Corp";

  const employees = [
    { id: 1, name: "Ravi Kumar", role: "Software Engineer", salary: "₹35,000", status: "Paid", color: "#6366F1" },
    { id: 2, name: "Ananya Sharma", role: "Product Designer", salary: "₹52,000", status: "Paid", color: "#EC4899" },
    { id: 3, name: "Vikram Singh", role: "Senior Lead", salary: "₹1,15,000", status: "Pending", color: "#F59E0B" },
    { id: 4, name: "Priya Das", role: "Operations Manager", salary: "₹48,500", status: "Paid", color: "#10B981" },
  ];

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <Helmet>
        <title>{activePage === "Dashboard" ? "Payroll Dashboard | PaySphere" : "Employee Management | PaySphere"}</title>
        <meta name="description" content={`Manage ${companyName}'s payroll and employees with ease.`} />
      </Helmet>

      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
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
          {["Dashboard", "Employees"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActivePage(item);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition ${
                activePage === item
                  ? "bg-indigo-50 text-blue-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 space-y-2">
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm">
            Run Payroll
          </button>
        </div>
      </aside>

      {/* Main */}
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

        {/* Dynamic Content */}
        {activePage === "Dashboard" ? (
          <DashboardOverview 
            search={search} 
            setSearch={setSearch} 
            filtered={filtered} 
            getInitials={getInitials} 
            onAddUpdate={() => navigate("/monthly-updates")}
            onAddEmployee={() => navigate("/add-employee")}
          />
        ) : (
          <EmployeeManagement />
        )}

      </div>
    </div>
  );
}

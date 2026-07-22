import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import api from '../services/api';

// --- Lightweight SVG Chart Components ---

const BarChart = ({ data, xKey, yKey, labelKey, color = '#3b82f6' }) => {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map((d) => d[yKey]), 1);
  const barWidth = Math.min(40, (320 / data.length) - 4);
  const chartHeight = 180;

  return (
    <svg viewBox={`0 0 ${Math.max(data.length * (barWidth + 8) + 20, 200)} ${chartHeight + 40}`} className="w-full h-auto">
      {data.map((d, i) => {
        const barH = (d[yKey] / maxVal) * chartHeight;
        const x = i * (barWidth + 8) + 10;
        const y = chartHeight - barH + 10;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} rx={3} fill={color} opacity={0.85} />
            <text x={x + barWidth / 2} y={chartHeight + 24} textAnchor="middle" fontSize="9" fill="currentColor" className="fill-gray-500 dark:fill-slate-400">
              {d[labelKey]}
            </text>
            <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" fontSize="8" fill="currentColor" className="fill-gray-600 dark:fill-slate-300">
              ₹{(d[yKey] / 1000).toFixed(0)}k
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const HorizontalBarChart = ({ data, labelKey, valueKey, colors }) => {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map((d) => d[valueKey]), 1);
  const barHeight = 28;
  const chartWidth = 280;
  const defaultColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = (d[valueKey] / maxVal) * 100;
        const c = colors?.[i] || defaultColors[i % defaultColors.length];
        return (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-slate-300 font-medium">{d[labelKey]}</span>
              <span className="text-gray-500 dark:text-slate-400">₹{d[valueKey].toLocaleString('en-IN')}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: c }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DonutChart = ({ segments, size = 140 }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;
  const radius = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  let cumulative = 0;

  const paths = segments.map((seg) => {
    const pct = seg.value / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const largeArc = pct > 0.5 ? 1 : 0;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[160px]">
      {paths.map((d, i) => (
        <path key={i} d={d} fill={segments[i].color} opacity={0.85} />
      ))}
      <circle cx={cx} cy={cy} r={radius * 0.5} fill="white" className="dark:fill-slate-900" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor" className="fill-gray-900 dark:fill-white">
        ₹{(total / 1000).toFixed(0)}k
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="currentColor" className="fill-gray-500 dark:fill-slate-400">
        Total
      </text>
    </svg>
  );
};

// --- Stat Card ---
const StatCard = ({ label, value, sub, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400',
  };
  return (
    <div className={`p-5 rounded-xl border ${colorMap[color]} transition-colors`}>
      <p className="text-xs uppercase font-bold mb-1 opacity-70">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  );
};

// --- Month-Year Selector ---
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MonthYearSelector = ({ month, year, onChange }) => (
  <div className="flex gap-3">
    <select
      value={month}
      onChange={(e) => onChange(Number(e.target.value), year)}
      className="px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    >
      {MONTH_NAMES.map((name, i) => (
        <option key={i} value={i + 1}>{name}</option>
      ))}
    </select>
    <select
      value={year}
      onChange={(e) => onChange(month, Number(e.target.value))}
      className="px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    >
      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  </div>
);

// --- Download Helper ---
const downloadFile = (url, filename) => {
  const token = localStorage.getItem('token');
  fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => {
      if (!res.ok) throw new Error('Download failed');
      return res.blob();
    })
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    })
    .catch((err) => {
      console.error('Download failed:', err);
      alert('Failed to download report. No data for the selected period.');
    });
};

// --- Main Reports Page ---
export default function Reports() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [activePage, setActivePage] = useState('Reports');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const companyName = localStorage.getItem('companyName') || 'PaySphere';

  useEffect(() => {
    if (!token) navigate('/auth');
  }, [token, navigate]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/reports/analytics?months=6');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAnalytics();
  }, [token]);

  const handleMonthChange = (m, y) => {
    setMonth(m);
    setYear(y);
  };

  const handleDownloadPDF = () => {
    downloadFile(`/api/reports/download-pdf?month=${month}&year=${year}`, `payroll-report-${MONTH_NAMES[month - 1]}-${year}.pdf`);
  };

  const handleExportCSV = () => {
    downloadFile(`/api/payroll/export-csv?month=${month}&year=${year}`, `payroll-export-${MONTH_NAMES[month - 1]}-${year}.csv`);
  };

  const getInitials = (name) =>
    name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const summary = analytics?.summary;
  const trends = analytics?.monthlyTrends || [];
  const roles = analytics?.roleBreakdown || [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex font-sans text-slate-800 dark:text-slate-200 transition-colors duration-200">
      <Helmet>
        <title>Reports & Analytics | PaySphere</title>
        <meta name="description" content={`View payroll analytics and generate reports for ${companyName}.`} />
      </Helmet>

      <Sidebar
        companyName={companyName}
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'Reports') navigate(`/${page.toLowerCase()}`);
        }}
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col md:ml-56 transition-all duration-300">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              className="md:hidden p-2 -ml-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <span className="font-bold text-blue-900 dark:text-blue-400 truncate">Ledger Payroll</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {getInitials(companyName)}
            </div>
            <button
              onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('companyName'); navigate('/'); }}
              className="px-3 py-1.5 cursor-pointer text-sm font-semibold text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <p className="text-sm text-gray-400 dark:text-slate-400">Payroll Analytics</p>
              <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 dark:text-white">Reports</h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <MonthYearSelector month={month} year={year} onChange={handleMonthChange} />
            </div>
          </div>

          {/* Export Action Bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-200 dark:shadow-none transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Report
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-slate-800 dark:text-slate-200 rounded-lg text-sm font-semibold hover:shadow dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Accounting CSV
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : !analytics || trends.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No payroll data yet</h3>
              <p className="text-gray-400 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                Run payroll for at least one month to see analytics and generate reports.
              </p>
              <button
                onClick={() => navigate('/monthly-updates')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition shadow-md shadow-blue-200 dark:shadow-none"
              >
                Run Payroll
              </button>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <StatCard label="Total Payout" value={`₹${summary.totalPayout.toLocaleString('en-IN')}`} sub={`${summary.monthsCovered} months`} color="blue" />
                <StatCard label="Base Salary" value={`₹${summary.totalBase.toLocaleString('en-IN')}`} color="green" />
                <StatCard label="Overtime Pay" value={`₹${summary.totalOvertime.toLocaleString('en-IN')}`} color="purple" />
                <StatCard label="Deductions" value={`₹${summary.totalDeductions.toLocaleString('en-IN')}`} color="red" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Monthly Payout Trends */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Monthly Payout Trends</h2>
                  <BarChart
                    data={trends}
                    xKey="label"
                    yKey="totalPayout"
                    labelKey="label"
                    color="#3b82f6"
                  />
                </div>

                {/* Role Breakdown */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cost by Role</h2>
                  <HorizontalBarChart data={roles} labelKey="role" valueKey="totalPayout" />
                </div>
              </div>

              {/* Overtime vs Base */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors mb-10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Salary Composition</h2>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <DonutChart
                    segments={[
                      { label: 'Base Salary', value: summary.totalBase, color: '#3b82f6' },
                      { label: 'Overtime', value: summary.totalOvertime, color: '#8b5cf6' },
                      { label: 'Bonus', value: summary.totalBonus, color: '#10b981' },
                    ]}
                  />
                  <div className="space-y-3 flex-1">
                    {[
                      { label: 'Base Salary', value: summary.totalBase, color: '#3b82f6' },
                      { label: 'Overtime Pay', value: summary.totalOvertime, color: '#8b5cf6' },
                      { label: 'Bonuses', value: summary.totalBonus, color: '#10b981' },
                      { label: 'Deductions', value: summary.totalDeductions, color: '#ef4444' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600 dark:text-slate-400 flex-1">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{item.value.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-slate-500 w-14 text-right">
                          {summary.totalPayout > 0 ? ((item.value / summary.totalPayout) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

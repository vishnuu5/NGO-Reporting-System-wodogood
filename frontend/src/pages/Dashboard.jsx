import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${year}-${month}`);
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchDashboardData();
    }
  }, [selectedMonth]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/api/dashboard`, {
        params: { month: selectedMonth },
      });
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, prefix = "" }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {value !== undefined && value !== null
              ? `${prefix}${value.toLocaleString()}`
              : "-"}
          </p>
        </div>
        <div className="text-3xl sm:text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h2>

          <div className="flex items-center gap-3">
            <label
              htmlFor="month"
              className="text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              Select Month:
            </label>
            <input
              type="month"
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
            <span className="ml-3 text-gray-600">
              Loading dashboard data...
            </span>
          </div>
        ) : dashboardData ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                title="Total NGOs Reporting"
                value={dashboardData.totalNGOs}
                icon="🏢"
                color="border-blue-500"
              />
              <StatCard
                title="Total People Helped"
                value={dashboardData.totalPeopleHelped}
                icon="👥"
                color="border-green-500"
              />
              <StatCard
                title="Total Events Conducted"
                value={dashboardData.totalEvents}
                icon="📅"
                color="border-purple-500"
              />
              <StatCard
                title="Total Funds Utilized"
                value={dashboardData.totalFunds}
                icon="💰"
                color="border-yellow-500"
                prefix="₹"
              />
            </div>

            {dashboardData.ngoBreakdown &&
              dashboardData.ngoBreakdown.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    NGO Breakdown
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            NGO ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            People Helped
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Events
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Funds (₹)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dashboardData.ngoBreakdown.map((ngo, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {ngo.ngoId}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {ngo.peopleHelped.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {ngo.eventsConducted.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              ₹{ngo.fundsUtilized.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Select a month to view dashboard data
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

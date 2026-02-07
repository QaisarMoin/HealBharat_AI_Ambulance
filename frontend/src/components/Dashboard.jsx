import React, { useState, useEffect } from "react";
import {
  MapPin,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Map,
  BarChart3,
  Users,
  Stethoscope,
} from "lucide-react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard/summary");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDashboardData(data.data || data); // Handle wrapped response
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getPressureLevelColor = (level) => {
    if (!level) return "text-gray-500";
    const upperLevel = String(level).toUpperCase();

    switch (upperLevel) {
      case "CRITICAL":
      case "HIGH":
        return "text-[#EF4444]";
      case "WARNING":
      case "MEDIUM":
      case "ELEVATED":
        return "text-[#F59E0B]";
      case "NORMAL":
      case "LOW":
      case "SUCCESS":
        return "text-[#10B981]";
      case "NO DATA":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  const getPressureLevelBg = (level) => {
    if (!level) return "bg-white/5 border-white/10";
    const upperLevel = String(level).toUpperCase();

    switch (upperLevel) {
      case "CRITICAL":
      case "HIGH":
        return "bg-[#EF4444]/10 border-[#EF4444]/20";
      case "WARNING":
      case "MEDIUM":
      case "ELEVATED":
        return "bg-[#F59E0B]/10 border-[#F59E0B]/20";
      case "NORMAL":
      case "LOW":
      case "SUCCESS":
        return "bg-[#10B981]/10 border-[#10B981]/20";
      case "NO DATA":
        return "bg-white/5 border-white/10";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading && !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#10B981]" />
          <p className="mt-4 text-lg text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 text-center border border-[#1A1A1A]">
            <AlertCircle className="mx-auto h-12 w-12 text-[#EF4444]" />
            <h2 className="mt-4 text-xl font-semibold text-white">
              Connection Error
            </h2>
            <p className="mt-2 text-gray-400">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 bg-[#10B981] text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-black shadow-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-[#10B981]/20 p-3 rounded-lg border border-[#10B981]/20">
                <Map className="h-8 w-8 text-[#10B981]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Emergency Operations Dashboard
                </h1>
                <p className="text-sm text-gray-400">
                  Real-time hospital pressure & ambulance availability
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="font-mono text-sm font-medium text-white">
                  {lastUpdated ? formatTime(lastUpdated) : "Never"}
                </p>
              </div>
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="flex items-center space-x-2 bg-[#0A0A0A] border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Overall Pressure Level */}
          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border-l-4 border-[#10B981] border-y border-r border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Overall Pressure
                </p>
                <p
                  className={`text-2xl font-bold ${getPressureLevelColor(dashboardData?.overallPressureLevel)}`}
                >
                  {dashboardData?.overallPressureLevel || "N/A"}
                </p>
              </div>
              <AlertTriangle
                className={`h-12 w-12 ${getPressureLevelColor(dashboardData?.overallPressureLevel)}`}
              />
            </div>
          </div>

          {/* Available Ambulances */}
          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border-l-4 border-[#10B981] border-y border-r border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Available Ambulances
                </p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData?.totalAmbulances > 0
                    ? `${dashboardData?.availableAmbulances} / ${dashboardData?.totalAmbulances}`
                    : "No Data"}
                </p>
              </div>
              <Stethoscope className="h-12 w-12 text-[#10B981]" />
            </div>
          </div>

          {/* Active Incidents */}
          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border-l-4 border-[#F59E0B] border-y border-r border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Active Incidents
                </p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData?.hospitalsMonitored > 0
                    ? dashboardData?.activeIncidents
                    : "No Data"}
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-[#F59E0B]" />
            </div>
          </div>

          {/* Hospitals Monitored */}
          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border-l-4 border-[#10B981] border-y border-r border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Hospitals Monitored
                </p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData?.hospitalsMonitored > 0
                    ? dashboardData?.hospitalsMonitored
                    : "No Data"}
                </p>
              </div>
              <Users className="h-12 w-12 text-[#10B981]" />
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pressure Trends */}
          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Pressure Trends
              </h2>
              <TrendingUp className="h-6 w-6 text-[#10B981]" />
            </div>
            <div className="space-y-4">
              {dashboardData?.pressureTrends?.map((trend, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getPressureLevelBg(trend.level)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">
                        {trend.hospitalName}
                      </p>
                      <p className="text-sm text-gray-400">{trend.location}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${getPressureLevelColor(trend.level)}`}
                      >
                        {trend.level}
                      </p>
                      <p className="text-sm text-gray-400">
                        {trend.percentage}% capacity
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ambulance Status */}
          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Ambulance Status
              </h2>
              <BarChart3 className="h-6 w-6 text-[#10B981]" />
            </div>
            <div className="space-y-4">
              {dashboardData?.ambulanceStatus?.map((status, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-white/5 bg-white/5 border-l-4 border-l-[#10B981]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">
                        {status.hospitalName}
                      </p>
                      <p className="text-sm text-gray-400">{status.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {status.available}
                      </p>
                      <p className="text-sm text-[#10B981]">Available</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
            <AlertTriangle className="h-6 w-6 text-[#F59E0B]" />
          </div>
          {dashboardData?.recentAlerts?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-3 bg-white/5 rounded-lg border border-white/5 border-l-4 ${
                    alert.severity === "CRITICAL"
                      ? "border-l-[#EF4444]"
                      : "border-l-[#F59E0B]"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      alert.severity === "CRITICAL"
                        ? "bg-[#EF4444]/10"
                        : "bg-[#F59E0B]/10"
                    }`}
                  >
                    <AlertTriangle
                      className={
                        alert.severity === "CRITICAL"
                          ? "text-[#EF4444]"
                          : "text-[#F59E0B]"
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{alert.message}</p>
                    <p className="text-sm text-gray-400">
                      {alert.hospitalName} • {alert.timestamp}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${
                      alert.severity === "CRITICAL"
                        ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                        : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-[#10B981]" />
              <p className="mt-4 text-gray-400">No recent alerts</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

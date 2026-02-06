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
      const response = await fetch(
        "http://localhost:5001/api/dashboard/summary",
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDashboardData(data);
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
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPressureLevelColor = (level) => {
    switch (level) {
      case "CRITICAL":
        return "text-emergency-red";
      case "WARNING":
        return "text-warning-orange";
      case "NORMAL":
        return "text-success-green";
      default:
        return "text-neutral-gray";
    }
  };

  const getPressureLevelBg = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-100 border-red-200";
      case "WARNING":
        return "bg-orange-100 border-orange-200";
      case "NORMAL":
        return "bg-green-100 border-green-200";
      default:
        return "bg-gray-100 border-gray-200";
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
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-info-blue" />
          <p className="mt-4 text-lg text-neutral-gray">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-emergency-red" />
            <h2 className="mt-4 text-xl font-semibold text-dark-navy">
              Connection Error
            </h2>
            <p className="mt-2 text-neutral-gray">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 bg-info-blue text-white px-4 py-2 rounded-lg hover:bg-info-blue/90 transition-colors"
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-info-blue p-3 rounded-lg">
                <Map className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark-navy">
                  Emergency Operations Dashboard
                </h1>
                <p className="text-sm text-neutral-gray">
                  Real-time hospital pressure & ambulance availability
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-neutral-gray">Last Updated</p>
                <p className="font-mono text-sm font-medium text-dark-navy">
                  {lastUpdated ? formatTime(lastUpdated) : "Never"}
                </p>
              </div>
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="flex items-center space-x-2 bg-white border border-gray-300 text-dark-navy px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
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
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-info-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-gray">
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
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-success-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-gray">
                  Available Ambulances
                </p>
                <p className="text-2xl font-bold text-dark-navy">
                  {dashboardData?.availableAmbulances || 0}
                </p>
              </div>
              <Stethoscope className="h-12 w-12 text-success-green" />
            </div>
          </div>

          {/* Active Incidents */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-warning-orange">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-gray">
                  Active Incidents
                </p>
                <p className="text-2xl font-bold text-dark-navy">
                  {dashboardData?.activeIncidents || 0}
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-warning-orange" />
            </div>
          </div>

          {/* Hospitals Monitored */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-info-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-gray">
                  Hospitals Monitored
                </p>
                <p className="text-2xl font-bold text-dark-navy">
                  {dashboardData?.hospitalsMonitored || 0}
                </p>
              </div>
              <Users className="h-12 w-12 text-info-blue" />
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pressure Trends */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">
                Pressure Trends
              </h2>
              <TrendingUp className="h-6 w-6 text-info-blue" />
            </div>
            <div className="space-y-4">
              {dashboardData?.pressureTrends?.map((trend, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getPressureLevelBg(trend.level)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-dark-navy">
                        {trend.hospitalName}
                      </p>
                      <p className="text-sm text-neutral-gray">
                        {trend.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${getPressureLevelColor(trend.level)}`}
                      >
                        {trend.level}
                      </p>
                      <p className="text-sm text-neutral-gray">
                        {trend.percentage}% capacity
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ambulance Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">
                Ambulance Status
              </h2>
              <BarChart3 className="h-6 w-6 text-success-green" />
            </div>
            <div className="space-y-4">
              {dashboardData?.ambulanceStatus?.map((status, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-dark-navy">
                        {status.hospitalName}
                      </p>
                      <p className="text-sm text-neutral-gray">
                        {status.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-dark-navy">
                        {status.available}
                      </p>
                      <p className="text-sm text-neutral-gray">Available</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-navy">
              Recent Alerts
            </h2>
            <AlertTriangle className="h-6 w-6 text-warning-orange" />
          </div>
          {dashboardData?.recentAlerts?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`p-2 rounded-full ${alert.severity === "CRITICAL" ? "bg-red-100" : "bg-orange-100"}`}
                  >
                    <AlertTriangle
                      className={
                        alert.severity === "CRITICAL"
                          ? "text-emergency-red"
                          : "text-warning-orange"
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark-navy">
                      {alert.message}
                    </p>
                    <p className="text-sm text-neutral-gray">
                      {alert.hospitalName} • {alert.timestamp}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      alert.severity === "CRITICAL"
                        ? "bg-red-100 text-emergency-red"
                        : "bg-orange-100 text-warning-orange"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-success-green" />
              <p className="mt-4 text-neutral-gray">No recent alerts</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

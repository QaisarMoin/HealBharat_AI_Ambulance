import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Loader2,
  Filter,
  Search,
  Clock,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    severity: "ALL",
    hospital: "ALL",
    timeRange: "24h",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState({});

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/alerts");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAlerts(data.data || []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError(err.message || "Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Refresh every 15 seconds
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
      case "WARNING":
        return "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20";
      case "INFO":
        return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
      default:
        return "text-gray-400 bg-white/5 border-white/10";
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity =
      filters.severity === "ALL" || alert.severity === filters.severity;
    const matchesHospital =
      filters.hospital === "ALL" || alert.hospitalName === filters.hospital;
    const matchesSearch =
      !searchTerm ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSeverity && matchesHospital && matchesSearch;
  });

  const uniqueHospitals = [
    ...new Set(alerts.map((alert) => alert.hospitalName)),
  ];

  if (loading && alerts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#10B981]" />
          <p className="mt-4 text-lg text-gray-400">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error && alerts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 text-center border border-white/10">
            <AlertCircle className="mx-auto h-12 w-12 text-[#EF4444]" />
            <h2 className="mt-4 text-xl font-semibold text-white">
              Connection Error
            </h2>
            <p className="mt-2 text-gray-400">{error}</p>
            <button
              onClick={fetchAlerts}
              className="mt-4 bg-[#10B981] text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
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
      <header className="bg-black/95 shadow-sm border-b border-white/10 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-[#F59E0B]/10 p-3 rounded-lg border border-[#F59E0B]/20">
                <AlertTriangle className="h-8 w-8 text-[#F59E0B]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Emergency Alerts
                </h1>
                <p className="text-sm text-gray-400">
                  Real-time alerts and notifications
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="font-mono text-sm font-medium text-white">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={fetchAlerts}
                disabled={loading}
                className="flex items-center space-x-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
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

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 mb-6 border border-white/10">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#111111] border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] placeholder-gray-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filters.severity}
                  onChange={(e) =>
                    setFilters({ ...filters, severity: e.target.value })
                  }
                  className="px-3 py-2 bg-[#111111] border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="WARNING">Warning</option>
                  <option value="INFO">Info</option>
                </select>
              </div>

              <select
                value={filters.hospital}
                onChange={(e) =>
                  setFilters({ ...filters, hospital: e.target.value })
                }
                className="px-3 py-2 bg-[#111111] border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
              >
                <option value="ALL">All Hospitals</option>
                {uniqueHospitals.map((hospital) => (
                  <option key={hospital} value={hospital}>
                    {hospital}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F59E0B]"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Alerts
                </p>
                <p className="text-2xl font-bold text-white">
                  {alerts.length}
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-[#F59E0B] opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EF4444]"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Critical Alerts
                </p>
                <p className="text-2xl font-bold text-[#EF4444]">
                  {alerts.filter((a) => a.severity === "CRITICAL").length}
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-[#EF4444] opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10B981]"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Active Hospitals
                </p>
                <p className="text-2xl font-bold text-[#10B981]">
                  {uniqueHospitals.length}
                </p>
              </div>
              <MapPin className="h-12 w-12 text-[#10B981] opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-[#0A0A0A] rounded-lg shadow-lg border border-white/10">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">
              Recent Alerts
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {filteredAlerts.length} alert
              {filteredAlerts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-6 hover:bg-white/5 transition-colors border-l-4 ${
                    alert.severity === "CRITICAL"
                      ? "border-l-[#EF4444] bg-[#EF4444]/5"
                      : alert.severity === "WARNING"
                      ? "border-l-[#F59E0B] bg-[#F59E0B]/5"
                      : "border-l-[#10B981] bg-[#10B981]/5"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Severity Indicator */}
                      <div
                        className={`p-2 rounded-full ${getSeverityColor(alert.severity).split(" ")[1]} ${getSeverityColor(alert.severity).split(" ")[2]}`}
                      >
                        {alert.severity === "CRITICAL" && (
                          <AlertCircle className="h-5 w-5 text-[#EF4444]" />
                        )}
                        {alert.severity === "WARNING" && (
                          <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                        )}
                        {alert.severity === "INFO" && (
                          <CheckCircle className="h-5 w-5 text-[#10B981]" />
                        )}
                      </div>

                      {/* Alert Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(alert.timestamp)}</span>
                          </span>
                          <span className="text-sm text-gray-400 flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{alert.hospitalName}</span>
                          </span>
                        </div>

                        <h3 className="text-lg font-medium text-white mb-2">
                          {alert.message}
                        </h3>

                        {alert.description && (
                          <div className="mt-2">
                            <button
                              onClick={() =>
                                setShowDetails({
                                  ...showDetails,
                                  [index]: !showDetails[index],
                                })
                              }
                              className="text-sm text-[#10B981] hover:text-emerald-400 flex items-center space-x-1 transition-colors"
                            >
                              {showDetails[index] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span>
                                {showDetails[index] ? "Hide" : "Show"} Details
                              </span>
                            </button>
                            {showDetails[index] && (
                              <p className="text-sm text-gray-300 mt-2 bg-[#111111] p-3 rounded-lg border border-white/10">
                                {alert.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-[#10B981]" />
                <p className="mt-4 text-lg text-white">No alerts found</p>
                <p className="mt-2 text-gray-400">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;

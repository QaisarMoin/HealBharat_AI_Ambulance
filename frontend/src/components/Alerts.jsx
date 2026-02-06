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
      const response = await fetch("http://localhost:5001/api/alerts");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError(err.message || "Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Refresh every 60 seconds
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "text-emergency-red bg-red-100 border-red-200";
      case "WARNING":
        return "text-warning-orange bg-orange-100 border-orange-200";
      case "INFO":
        return "text-info-blue bg-blue-100 border-blue-200";
      default:
        return "text-neutral-gray bg-gray-100 border-gray-200";
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
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-info-blue" />
          <p className="mt-4 text-lg text-neutral-gray">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error && alerts.length === 0) {
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
              onClick={fetchAlerts}
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
              <div className="bg-warning-orange p-3 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark-navy">
                  Emergency Alerts
                </h1>
                <p className="text-sm text-neutral-gray">
                  Real-time alerts and notifications
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-neutral-gray">Last Updated</p>
                <p className="font-mono text-sm font-medium text-dark-navy">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={fetchAlerts}
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

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="h-5 w-5 text-neutral-gray" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-info-blue focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-neutral-gray" />
                <select
                  value={filters.severity}
                  onChange={(e) =>
                    setFilters({ ...filters, severity: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-info-blue focus:border-transparent"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-info-blue focus:border-transparent"
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-gray">
                  Total Alerts
                </p>
                <p className="text-2xl font-bold text-dark-navy">
                  {alerts.length}
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-warning-orange" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-gray">
                  Critical Alerts
                </p>
                <p className="text-2xl font-bold text-emergency-red">
                  {alerts.filter((a) => a.severity === "CRITICAL").length}
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-emergency-red" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-gray">
                  Active Hospitals
                </p>
                <p className="text-2xl font-bold text-info-blue">
                  {uniqueHospitals.length}
                </p>
              </div>
              <MapPin className="h-12 w-12 text-info-blue" />
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-dark-navy">
              Recent Alerts
            </h2>
            <p className="text-sm text-neutral-gray mt-1">
              {filteredAlerts.length} alert
              {filteredAlerts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Severity Indicator */}
                      <div
                        className={`p-2 rounded-full ${getSeverityColor(alert.severity).split(" ")[1]} ${getSeverityColor(alert.severity).split(" ")[2]}`}
                      >
                        {alert.severity === "CRITICAL" && (
                          <AlertCircle className="h-5 w-5 text-emergency-red" />
                        )}
                        {alert.severity === "WARNING" && (
                          <AlertTriangle className="h-5 w-5 text-warning-orange" />
                        )}
                        {alert.severity === "INFO" && (
                          <CheckCircle className="h-5 w-5 text-info-blue" />
                        )}
                      </div>

                      {/* Alert Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </span>
                          <span className="text-sm text-neutral-gray flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(alert.timestamp)}</span>
                          </span>
                          <span className="text-sm text-neutral-gray flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{alert.hospitalName}</span>
                          </span>
                        </div>

                        <h3 className="text-lg font-medium text-dark-navy mb-2">
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
                              className="text-sm text-info-blue hover:text-info-blue/80 flex items-center space-x-1"
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
                              <p className="text-sm text-neutral-gray mt-2 bg-gray-50 p-3 rounded-lg">
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
                <CheckCircle className="mx-auto h-12 w-12 text-success-green" />
                <p className="mt-4 text-lg text-dark-navy">No alerts found</p>
                <p className="mt-2 text-neutral-gray">
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

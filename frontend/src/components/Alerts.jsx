import React, { useState } from "react";

const Alerts = ({ alerts, getAlertSeverityColor, loading, error }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "active") return alert.status === "active";
    if (filter === "critical") return alert.severity === "Critical";
    if (filter === "high") return alert.severity === "High";
    return alert.severity === filter;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortBy === "timestamp") {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    if (sortBy === "severity") {
      const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    return 0;
  });

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "Critical":
        return (
          <svg
            className="h-4 w-4 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "High":
        return (
          <svg
            className="h-4 w-4 text-orange-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Medium":
        return (
          <svg
            className="h-4 w-4 text-yellow-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="h-4 w-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const alertStats = {
    total: alerts.length,
    active: alerts.filter((a) => a.status === "active").length,
    critical: alerts.filter((a) => a.severity === "Critical").length,
    high: alerts.filter((a) => a.severity === "High").length,
    medium: alerts.filter((a) => a.severity === "Medium").length,
    low: alerts.filter((a) => a.severity === "Low").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-medium">Error</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Total Alerts</div>
          <div className="text-2xl font-bold text-gray-900">
            {alertStats.total}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Active</div>
          <div className="text-2xl font-bold text-red-600">
            {alertStats.active}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Critical</div>
          <div className="text-2xl font-bold text-red-600">
            {alertStats.critical}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">High</div>
          <div className="text-2xl font-bold text-orange-600">
            {alertStats.high}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Medium</div>
          <div className="text-2xl font-bold text-yellow-600">
            {alertStats.medium}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Low</div>
          <div className="text-2xl font-bold text-blue-600">
            {alertStats.low}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Alert Management
          </h2>
        </div>
        <div className="p-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Alerts</option>
              <option value="active">Active Only</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="timestamp">Latest First</option>
              <option value="severity">Severity</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-500">
            Showing {sortedAlerts.length} of {alerts.length} alerts
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Alert Details</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="mb-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : sortedAlerts.length > 0 ? (
            <div className="space-y-4">
              {sortedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-6 border-l-4 rounded-lg ${getAlertSeverityColor(alert.severity)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getSeverityIcon(alert.severity)}
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${getAlertSeverityColor(alert.severity).replace("border-", "bg-").replace("bg-", "bg-")}`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {alert.type}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {alert.zone}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            alert.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {alert.message}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Timestamp:</span>
                          <br />
                          <span className="text-gray-900">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {alert.details && (
                          <>
                            <div>
                              <span className="font-medium">Zone:</span>
                              <br />
                              <span className="text-gray-900">
                                {alert.details.zone || alert.zone}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Type:</span>
                              <br />
                              <span className="text-gray-900">
                                {alert.type}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {alert.details &&
                        Object.keys(alert.details).length > 0 && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-2">
                              Additional Details:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                              {Object.entries(alert.details).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between"
                                  >
                                    <span className="text-gray-600">
                                      {key}:
                                    </span>
                                    <span className="font-medium">{value}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <svg
                  className="h-12 w-12 text-gray-300 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">No alerts found</p>
              <p className="text-sm">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;

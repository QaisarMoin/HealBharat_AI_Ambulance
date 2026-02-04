import React from "react";

const Dashboard = ({
  predictions,
  alerts,
  dashboardData,
  getRiskColor,
  getAlertSeverityColor,
  loading,
  error,
}) => {
  const criticalAlerts = alerts.filter(
    (a) => a.severity === "Critical" && a.status === "active",
  );
  const highRiskZones = predictions.filter((p) => p.overallRisk === "High");

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Hospitals */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Hospitals
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.summary?.totalHospitals || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Recent Ambulance Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Recent Ambulance Logs (24h)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.summary?.recentAmbulanceLogs || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* High Risk Zones */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                High Risk Zones
              </p>
              <p className="text-2xl font-bold text-red-600">
                {highRiskZones.length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Critical Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Critical Alerts
              </p>
              <p className="text-2xl font-bold text-red-600">
                {criticalAlerts.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg
                className="h-8 w-8 text-orange-600"
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Zone Risk Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Zone Risk Overview
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border-b"
                    >
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {predictions.map((prediction) => (
                    <div
                      key={prediction.zone}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.overallRisk)}`}
                        >
                          {prediction.zone}
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            Overall Risk
                          </div>
                          <div
                            className={`text-lg font-semibold ${getRiskColor(prediction.overallRisk).split(" ")[0]}`}
                          >
                            {prediction.overallRisk}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Confidence</div>
                        <div className="text-lg font-semibold text-blue-600">
                          {prediction.confidence || "N/A"}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Alerts
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="mb-4 p-3 bg-gray-100 rounded">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border-l-4 rounded ${getAlertSeverityColor(alert.severity)} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getAlertSeverityColor(alert.severity).replace("border-", "bg-").replace("bg-", "bg-")}`}
                            >
                              {alert.severity}
                            </span>
                            <span className="text-xs text-gray-500">
                              {alert.zone}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No active alerts
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Zone Details */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {predictions.map((prediction) => (
          <div key={prediction.zone} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {prediction.zone}
              </h3>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(prediction.overallRisk)}`}
              >
                {prediction.overallRisk}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ED Pressure:</span>
                <span
                  className={`font-medium ${getRiskColor(prediction.edPressure).split(" ")[0]}`}
                >
                  {prediction.edPressure}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ambulance Pressure:</span>
                <span
                  className={`font-medium ${getRiskColor(prediction.ambulancePressure).split(" ")[0]}`}
                >
                  {prediction.ambulancePressure}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Accident Risk:</span>
                <span
                  className={`font-medium ${getRiskColor(prediction.accidentRisk).split(" ")[0]}`}
                >
                  {prediction.accidentRisk}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Trend:</span>
                <span
                  className={`font-medium ${
                    prediction.trend === "Increasing"
                      ? "text-red-600"
                      : prediction.trend === "Decreasing"
                        ? "text-green-600"
                        : "text-gray-600"
                  }`}
                >
                  {prediction.trend || "Stable"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Confidence:</span>
                <span className="font-medium text-blue-600">
                  {prediction.confidence || "N/A"}%
                </span>
              </div>
            </div>

            {prediction.details && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-xs text-gray-500 mb-2">
                  Current Activity
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Arrivals:</span>
                  <span className="font-medium">
                    {prediction.details.currentActivity?.ambulanceArrivals || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accidents:</span>
                  <span className="font-medium">
                    {prediction.details.currentActivity?.accidentCount || 0}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

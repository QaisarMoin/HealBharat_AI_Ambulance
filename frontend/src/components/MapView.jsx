import React from "react";

const MapView = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Emergency Map View
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">
                  North Zone
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">Low Risk</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  South Zone
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">Low Risk</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-700">
                  East Zone
                </span>
              </div>
              <p className="text-xs text-yellow-600 mt-1">Medium Risk</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-orange-700">
                  West Zone
                </span>
              </div>
              <p className="text-xs text-orange-600 mt-1">High Risk</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-700">
                  Central Zone
                </span>
              </div>
              <p className="text-xs text-red-600 mt-1">Critical Risk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Zone Map</h3>
          </div>
          <div className="p-6">
            {/* Simple SVG Map Representation */}
            <div
              className="relative bg-gray-100 rounded-lg p-8"
              style={{ minHeight: "400px" }}
            >
              <svg width="100%" height="100%" viewBox="0 0 800 400">
                {/* North Zone */}
                <rect
                  x="200"
                  y="20"
                  width="400"
                  height="120"
                  fill="#dbeafe"
                  stroke="#93c5fd"
                  strokeWidth="2"
                  rx="8"
                />
                <text
                  x="400"
                  y="80"
                  textAnchor="middle"
                  className="text-sm font-semibold fill-blue-700"
                >
                  North Zone
                </text>
                <text
                  x="400"
                  y="100"
                  textAnchor="middle"
                  className="text-xs fill-blue-600"
                >
                  Low Risk
                </text>

                {/* South Zone */}
                <rect
                  x="200"
                  y="260"
                  width="400"
                  height="120"
                  fill="#dcfce7"
                  stroke="#86efac"
                  strokeWidth="2"
                  rx="8"
                />
                <text
                  x="400"
                  y="320"
                  textAnchor="middle"
                  className="text-sm font-semibold fill-green-700"
                >
                  South Zone
                </text>
                <text
                  x="400"
                  y="340"
                  textAnchor="middle"
                  className="text-xs fill-green-600"
                >
                  Low Risk
                </text>

                {/* East Zone */}
                <rect
                  x="420"
                  y="140"
                  width="180"
                  height="120"
                  fill="#fef3c7"
                  stroke="#fde68a"
                  strokeWidth="2"
                  rx="8"
                />
                <text
                  x="510"
                  y="200"
                  textAnchor="middle"
                  className="text-sm font-semibold fill-yellow-700"
                >
                  East Zone
                </text>
                <text
                  x="510"
                  y="220"
                  textAnchor="middle"
                  className="text-xs fill-yellow-600"
                >
                  Medium Risk
                </text>

                {/* West Zone */}
                <rect
                  x="200"
                  y="140"
                  width="180"
                  height="120"
                  fill="#fed7d7"
                  stroke="#fca5a5"
                  strokeWidth="2"
                  rx="8"
                />
                <text
                  x="290"
                  y="200"
                  textAnchor="middle"
                  className="text-sm font-semibold fill-orange-700"
                >
                  West Zone
                </text>
                <text
                  x="290"
                  y="220"
                  textAnchor="middle"
                  className="text-xs fill-orange-600"
                >
                  High Risk
                </text>

                {/* Central Zone */}
                <rect
                  x="320"
                  y="160"
                  width="160"
                  height="80"
                  fill="#fee2e2"
                  stroke="#fecaca"
                  strokeWidth="3"
                  rx="6"
                />
                <text
                  x="400"
                  y="200"
                  textAnchor="middle"
                  className="text-sm font-semibold fill-red-700"
                >
                  Central Zone
                </text>
                <text
                  x="400"
                  y="220"
                  textAnchor="middle"
                  className="text-xs fill-red-600"
                >
                  Critical Risk
                </text>

                {/* Hospital Icons */}
                <circle cx="300" cy="80" r="8" fill="#3b82f6" />
                <circle cx="500" cy="80" r="8" fill="#3b82f6" />
                <circle cx="300" cy="320" r="8" fill="#22c55e" />
                <circle cx="500" cy="320" r="8" fill="#22c55e" />
                <circle cx="400" cy="200" r="8" fill="#ef4444" />

                {/* Accident Markers */}
                <polygon points="420,180 425,190 415,190" fill="#f59e0b" />
                <polygon points="380,220 385,230 375,230" fill="#f59e0b" />
                <polygon points="450,260 455,270 445,270" fill="#f59e0b" />

                {/* Ambulance Icons */}
                <rect
                  x="350"
                  y="100"
                  width="20"
                  height="10"
                  fill="#ef4444"
                  rx="2"
                />
                <rect
                  x="450"
                  y="300"
                  width="20"
                  height="10"
                  fill="#ef4444"
                  rx="2"
                />
              </svg>

              {/* Legend */}
              <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <div className="text-xs font-semibold text-gray-700 mb-2">
                  Legend
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Hospital</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Low Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Medium Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>High Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Critical Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>Accident</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Details Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Current Status
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-red-700">
                    Central Zone
                  </div>
                  <div className="text-xs text-red-600">Critical Risk</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-red-600">
                    3 Active Alerts
                  </div>
                  <div className="text-xs text-red-500">12:45 PM</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-orange-700">
                    West Zone
                  </div>
                  <div className="text-xs text-orange-600">High Risk</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-orange-600">
                    2 Active Alerts
                  </div>
                  <div className="text-xs text-orange-500">12:30 PM</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-yellow-700">
                    East Zone
                  </div>
                  <div className="text-xs text-yellow-600">Medium Risk</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-yellow-600">
                    1 Active Alert
                  </div>
                  <div className="text-xs text-yellow-500">12:15 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                View Detailed Map
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                Export Map Data
              </button>
              <button className="w-full px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
                Refresh Map
              </button>
            </div>
          </div>

          {/* Zone Statistics */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Zone Statistics
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Hospitals:</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Incidents:</span>
                <span className="font-medium text-red-600">6</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ambulance Deployments:</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Response Time:</span>
                <span className="font-medium">8.5 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <div className="text-xs text-gray-500">
          Note: This is a simplified map view for demonstration purposes. In a
          production environment, this would integrate with a real mapping
          service like Google Maps or Mapbox for interactive functionality.
        </div>
      </div>
    </div>
  );
};

export default MapView;

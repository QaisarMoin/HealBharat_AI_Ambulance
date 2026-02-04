import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AlertCircle, MapPin, TrendingUp, Clock, Calendar } from "lucide-react";
import "./App.css";

// Import components
import Dashboard from "./components/Dashboard";
import Alerts from "./components/Alerts";
import MapView from "./components/MapView";
import DataImport from "./components/DataImport";

// API client
const api = {
  getPredictions: () => fetch("/api/predictions").then((res) => res.json()),
  getAlerts: () => fetch("/api/alerts").then((res) => res.json()),
  getDashboardSummary: () =>
    fetch("/api/dashboard/summary").then((res) => res.json()),
  getZonesData: () => fetch("/api/dashboard/zones").then((res) => res.json()),
  getRealtimeData: () =>
    fetch("/api/dashboard/realtime").then((res) => res.json()),
  importData: (type, data) =>
    fetch(`/api/data/import/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};

function App() {
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Poll for updates every 30 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [predictionsRes, alertsRes, dashboardRes] = await Promise.all([
          api.getPredictions(),
          api.getAlerts(),
          api.getDashboardSummary(),
        ]);

        if (predictionsRes.success) setPredictions(predictionsRes.data);
        if (alertsRes.success) setAlerts(alertsRes.data);
        if (dashboardRes.success) setDashboardData(dashboardRes.data);
      } catch (err) {
        setError(
          "Failed to fetch data. Please check if the backend server is running.",
        );
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case "High":
        return "text-red-600 bg-red-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "border-red-500 bg-red-50";
      case "High":
        return "border-orange-500 bg-orange-50";
      case "Medium":
        return "border-yellow-500 bg-yellow-50";
      case "Low":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  if (loading && !predictions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading emergency dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <h1 className="text-xl font-bold text-gray-900">
                    Emergency Dashboard
                  </h1>
                  <span className="text-sm text-gray-500">Phase 2</span>
                </div>
              </div>

              <nav className="hidden md:flex space-x-8">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/alerts"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Alerts
                </Link>
                <Link
                  to="/map"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Map View
                </Link>
                <Link
                  to="/data"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Data Import
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Status Bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>
                  Last updated:{" "}
                  {dashboardData?.lastUpdated
                    ? new Date(dashboardData.lastUpdated).toLocaleTimeString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  System Status:{" "}
                  <span
                    className={`px-2 py-1 rounded ${dashboardData?.status === "Critical" ? "bg-red-100 text-red-700" : dashboardData?.status === "Warning" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                  >
                    {dashboardData?.status || "Unknown"}
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>
                  Active Alerts:{" "}
                  <span className="font-medium text-red-600">
                    {alerts.filter((a) => a.status === "active").length}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  predictions={predictions}
                  alerts={alerts}
                  dashboardData={dashboardData}
                  getRiskColor={getRiskColor}
                  getAlertSeverityColor={getAlertSeverityColor}
                  loading={loading}
                  error={error}
                />
              }
            />
            <Route
              path="/alerts"
              element={
                <Alerts
                  alerts={alerts}
                  getAlertSeverityColor={getAlertSeverityColor}
                  loading={loading}
                  error={error}
                />
              }
            />
            <Route path="/map" element={<MapView />} />
            <Route path="/data" element={<DataImport api={api} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <p>
                AI Emergency Pressure & Ambulance Load Prediction System - Phase
                2
              </p>
              <p>Real-time monitoring and prediction system</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

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
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const MapView = () => {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    showPressure: true,
    showAmbulances: true,
    showIncidents: true,
  });
  const [selectedHospital, setSelectedHospital] = useState(null);

  const fetchMapData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard/map");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMapData(data);
    } catch (err) {
      console.error("Error fetching map data:", err);
      setError(err.message || "Failed to fetch map data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
    // Refresh every 45 seconds
    const interval = setInterval(fetchMapData, 45000);
    return () => clearInterval(interval);
  }, []);

  const getPressureLevelColor = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-emergency-red";
      case "WARNING":
        return "bg-warning-orange";
      case "NORMAL":
        return "bg-success-green";
      default:
        return "bg-neutral-gray";
    }
  };

  const getPressureLevelText = (level) => {
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

  if (loading && !mapData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-info-blue" />
          <p className="mt-4 text-lg text-neutral-gray">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error && !mapData) {
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
              onClick={fetchMapData}
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
                  Emergency Operations Map
                </h1>
                <p className="text-sm text-neutral-gray">
                  Real-time hospital pressure & resource visualization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-neutral-gray">Last Updated</p>
                <p className="font-mono text-sm font-medium text-dark-navy">
                  {mapData
                    ? new Date(mapData.lastUpdated).toLocaleTimeString()
                    : "Never"}
                </p>
              </div>
              <button
                onClick={fetchMapData}
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
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-dark-navy">
                Map Filters
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pressure"
                  checked={filters.showPressure}
                  onChange={(e) =>
                    setFilters({ ...filters, showPressure: e.target.checked })
                  }
                  className="rounded border-gray-300 text-info-blue focus:ring-info-blue"
                />
                <label htmlFor="pressure" className="text-sm text-neutral-gray">
                  Show Pressure Levels
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ambulances"
                  checked={filters.showAmbulances}
                  onChange={(e) =>
                    setFilters({ ...filters, showAmbulances: e.target.checked })
                  }
                  className="rounded border-gray-300 text-success-green focus:ring-success-green"
                />
                <label
                  htmlFor="ambulances"
                  className="text-sm text-neutral-gray"
                >
                  Show Ambulances
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="incidents"
                  checked={filters.showIncidents}
                  onChange={(e) =>
                    setFilters({ ...filters, showIncidents: e.target.checked })
                  }
                  className="rounded border-gray-300 text-warning-orange focus:ring-warning-orange"
                />
                <label
                  htmlFor="incidents"
                  className="text-sm text-neutral-gray"
                >
                  Show Incidents
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <ZoomOut className="h-5 w-5 text-neutral-gray" />
              <span className="text-sm text-neutral-gray">Zoom: 100%</span>
              <ZoomIn className="h-5 w-5 text-neutral-gray" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Map Container */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">Hospital Status Map</h2>
              <div className="flex items-center space-x-4 text-sm text-neutral-gray">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-green rounded-full"></div>
                  <span>Normal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning-orange rounded-full"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emergency-red rounded-full"></div>
                  <span>Critical</span>
                </div>
              </div>
            </div>

            {/* Map Grid Visualization */}
            <div className="relative bg-gray-100 rounded-lg p-8 min-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mapData?.hospitals?.map((hospital, index) => {
                  const pressureLevel = hospital.status === "Critical" ? "CRITICAL" : hospital.status === "High" ? "WARNING" : "NORMAL";
                  const capacityPercentage = Math.round((hospital.currentPatients / hospital.capacity) * 100);
                  
                  return (
                  <div
                    key={index}
                    className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                      filters.showPressure
                        ? getPressureLevelColor(pressureLevel) +
                          " bg-opacity-20"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin
                          className={`h-5 w-5 ${getPressureLevelText(pressureLevel)}`}
                        />
                        <span className="font-medium text-dark-navy">
                          {hospital.name}
                        </span>
                      </div>
                      {filters.showAmbulances && (
                        <div className="flex items-center space-x-1 text-sm">
                          <Stethoscope className="h-4 w-4 text-success-green" />
                          <span className="text-success-green font-medium">
                            {hospital.availableAmbulances}
                          </span>
                        </div>
                      )}
                    </div>

                    {filters.showPressure && (
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${getPressureLevelText(pressureLevel)}`}
                        >
                          {pressureLevel}
                        </span>
                        <span className="text-sm text-neutral-gray">
                          {capacityPercentage}% capacity
                        </span>
                      </div>
                    )}

                    {filters.showIncidents && hospital.activeIncidents > 0 && (
                      <div className="mt-2 flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-warning-orange" />
                        <span className="text-sm text-warning-orange font-medium">
                          {hospital.activeIncidents} zone incidents
                        </span>
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-dark-navy mb-4">
            Summary Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-dark-navy">
                {mapData?.totalHospitals || 0}
              </div>
              <div className="text-sm text-neutral-gray">Total Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning-orange">
                {mapData?.criticalHospitals || 0}
              </div>
              <div className="text-sm text-neutral-gray">
                Critical Hospitals
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success-green">
                {mapData?.totalAmbulances || 0}
              </div>
              <div className="text-sm text-neutral-gray">
                Available Ambulances
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning-orange">
                {mapData?.totalIncidents || 0}
              </div>
              <div className="text-sm text-neutral-gray">Active Incidents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;

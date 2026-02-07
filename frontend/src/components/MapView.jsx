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
        return "bg-[#EF4444]";
      case "WARNING":
        return "bg-[#F59E0B]";
      case "NORMAL":
        return "bg-[#10B981]";
      default:
        return "bg-gray-600";
    }
  };

  const getPressureLevelText = (level) => {
    switch (level) {
      case "CRITICAL":
        return "text-[#EF4444]";
      case "WARNING":
        return "text-[#F59E0B]";
      case "NORMAL":
        return "text-[#10B981]";
      default:
        return "text-gray-400";
    }
  };

  if (loading && !mapData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#10B981]" />
          <p className="mt-4 text-lg text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error && !mapData) {
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
              onClick={fetchMapData}
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
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <Map className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Emergency Operations Map
                </h1>
                <p className="text-sm text-gray-400">
                  Real-time hospital pressure & resource visualization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="font-mono text-sm font-medium text-white">
                  {mapData
                    ? new Date(mapData.lastUpdated).toLocaleTimeString()
                    : "Never"}
                </p>
              </div>
              <button
                onClick={fetchMapData}
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
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-white">Map Filters</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pressure"
                  checked={filters.showPressure}
                  onChange={(e) =>
                    setFilters({ ...filters, showPressure: e.target.checked })
                  }
                  className="rounded border-white/10 bg-[#111111] text-[#10B981] focus:ring-[#10B981]"
                />
                <label htmlFor="pressure" className="text-sm text-gray-400">
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
                  className="rounded border-white/10 bg-[#111111] text-[#10B981] focus:ring-[#10B981]"
                />
                <label htmlFor="ambulances" className="text-sm text-gray-400">
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
                  className="rounded border-white/10 bg-[#111111] text-[#F59E0B] focus:ring-[#F59E0B]"
                />
                <label htmlFor="incidents" className="text-sm text-gray-400">
                  Show Incidents
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <ZoomOut className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-400">Zoom: 100%</span>
              <ZoomIn className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Map Container */}
          <div className="lg:col-span-3 bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Hospital Status Map
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                  <span>Normal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
                  <span>Critical</span>
                </div>
              </div>
            </div>

            {/* Map Grid Visualization */}
            <div className="relative bg-[#000000] rounded-lg p-8 min-h-96 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mapData?.hospitals?.map((hospital, index) => {
                  const pressureLevel =
                    hospital.status === "Critical"
                      ? "CRITICAL"
                      : hospital.status === "High"
                        ? "WARNING"
                        : "NORMAL";
                  const capacityPercentage = Math.round(
                    (hospital.currentPatients / hospital.capacity) * 100,
                  );

                  return (
                    <div
                      key={index}
                      className={`relative p-4 rounded-lg border transition-all hover:shadow-lg ${
                        filters.showPressure
                          ? getPressureLevelColor(pressureLevel) +
                            " bg-opacity-10 border-transparent"
                          : "bg-[#0A0A0A] border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <MapPin
                            className={`h-5 w-5 ${getPressureLevelText(pressureLevel)}`}
                          />
                          <span className="font-medium text-white">
                            {hospital.name}
                          </span>
                        </div>
                        {filters.showAmbulances && (
                          <div className="flex items-center space-x-1 text-sm">
                            <Stethoscope className="h-4 w-4 text-[#10B981]" />
                            <span className="text-[#10B981] font-medium">
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
                          <span className="text-sm text-gray-400">
                            {capacityPercentage}% capacity
                          </span>
                        </div>
                      )}

                      {filters.showIncidents &&
                        hospital.activeIncidents > 0 && (
                          <div className="mt-2 flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                            <span className="text-sm text-[#F59E0B] font-medium">
                              {hospital.activeIncidents} zone incidents
                            </span>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">
            Summary Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {mapData?.totalHospitals || 0}
              </div>
              <div className="text-sm text-gray-400">Total Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F59E0B]">
                {mapData?.criticalHospitals || 0}
              </div>
              <div className="text-sm text-gray-400">Critical Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#10B981]">
                {mapData?.totalAmbulances || 0}
              </div>
              <div className="text-sm text-gray-400">Available Ambulances</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F59E0B]">
                {mapData?.totalIncidents || 0}
              </div>
              <div className="text-sm text-gray-400">Active Incidents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;

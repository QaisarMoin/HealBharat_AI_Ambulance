import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import {
  AlertTriangle,
  RefreshCw,
  Loader2,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Map as MapIcon,
} from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

const mapOptions = {
  styles: [
    {
      elementType: "geometry",
      stylers: [{ color: "#242f3e" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#242f3e" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  disableDefaultUI: false,
  zoomControl: true,
};

const MapView = () => {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    showPressure: true,
    showAmbulances: true,
    showIncidents: true,
  });
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "", // Add your API key here
  });

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

  if (loadError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-6 text-center border border-white/10">
          <AlertCircle className="mx-auto h-12 w-12 text-[#EF4444]" />
          <h2 className="mt-4 text-xl font-semibold text-white">Map Error</h2>
          <p className="mt-2 text-gray-400">{loadError.message}</p>
        </div>
      </div>
    );
  }

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
                <MapIcon className="h-8 w-8 text-white" />
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
                Live Operations Map
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
                  <span>Critical Hospital</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                  <span>Normal Hospital</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                  <span>Incident</span>
                </div>
              </div>
            </div>

            {/* Google Map Visualization */}
            <div className="relative bg-[#000000] rounded-lg overflow-hidden border border-white/10 min-h-[600px]">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={mapData?.hospitals?.[0]?.location || defaultCenter}
                  zoom={12}
                  options={mapOptions}
                >
                  {/* Hospital Markers */}
                  {filters.showPressure &&
                    mapData?.hospitals?.map((hospital) => (
                      <Marker
                        key={`hospital-${hospital.id}`}
                        position={hospital.location}
                        onClick={() =>
                          setActiveInfoWindow(`hospital-${hospital.id}`)
                        }
                        title={hospital.name}
                        icon={{
                          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                          fillColor:
                            hospital.status === "Critical"
                              ? "#EF4444"
                              : hospital.status === "High"
                                ? "#F59E0B"
                                : "#10B981",
                          fillOpacity: 1,
                          strokeWeight: 1,
                          strokeColor: "#FFFFFF",
                          scale: 2,
                        }}
                      >
                        {activeInfoWindow === `hospital-${hospital.id}` && (
                          <InfoWindow
                            onCloseClick={() => setActiveInfoWindow(null)}
                          >
                            <div className="text-black p-2 min-w-[200px]">
                              <h3 className="font-bold text-lg mb-1">
                                {hospital.name}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                                    hospital.status === "Critical"
                                      ? "bg-red-500"
                                      : hospital.status === "High"
                                        ? "bg-amber-500"
                                        : "bg-emerald-500"
                                  }`}
                                >
                                  {hospital.status}
                                </span>
                                <span className="text-xs text-gray-600">
                                  {hospital.currentPatients}/{hospital.capacity}{" "}
                                  Beds
                                </span>
                              </div>
                              <div className="text-sm">
                                <p>
                                  <strong>Zone:</strong> {hospital.zone}
                                </p>
                                <p>
                                  <strong>Ambulances:</strong>{" "}
                                  {hospital.availableAmbulances}
                                </p>
                                <p>
                                  <strong>Active Incidents:</strong>{" "}
                                  {hospital.activeIncidents}
                                </p>
                              </div>
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    ))}

                  {/* Incident Markers */}
                  {filters.showIncidents &&
                    mapData?.incidents?.map((incident) => (
                      <Marker
                        key={`incident-${incident.id}`}
                        position={incident.location}
                        onClick={() =>
                          setActiveInfoWindow(`incident-${incident.id}`)
                        }
                        title={incident.type}
                        icon={{
                          path: "M4.5 10c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm15 0c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm-7.5-6c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5z",
                          fillColor: "#F59E0B",
                          fillOpacity: 1,
                          strokeWeight: 1,
                          strokeColor: "#FFFFFF",
                          scale: 1.5,
                        }}
                      >
                        {activeInfoWindow === `incident-${incident.id}` && (
                          <InfoWindow
                            onCloseClick={() => setActiveInfoWindow(null)}
                          >
                            <div className="text-black p-2 min-w-[200px]">
                              <h3 className="font-bold text-lg mb-1 text-amber-600 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {incident.type}
                              </h3>
                              <div className="text-sm space-y-1">
                                <p>
                                  <strong>Severity:</strong> {incident.severity}
                                </p>
                                <p>
                                  <strong>Time:</strong>{" "}
                                  {new Date(
                                    incident.timestamp,
                                  ).toLocaleTimeString()}
                                </p>
                                <p>
                                  <strong>Casualties:</strong>{" "}
                                  {incident.victimCount || 0}
                                </p>
                              </div>
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    ))}
                </GoogleMap>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-12 w-12 animate-spin text-[#10B981]" />
                </div>
              )}
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

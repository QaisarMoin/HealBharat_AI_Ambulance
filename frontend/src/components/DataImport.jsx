import React, { useState } from "react";

const DataImport = ({ api }) => {
  const [activeTab, setActiveTab] = useState("hospitals");
  const [importStatus, setImportStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample data templates
  const sampleHospitalData = [
    {
      name: "City General Hospital",
      zone: "Central",
      capacity: 200,
      currentPatients: 150,
      availableBeds: 50,
      emergencyBeds: 20,
      ambulanceBays: 5,
      latitude: 28.6139,
      longitude: 77.209,
    },
    {
      name: "North District Hospital",
      zone: "North",
      capacity: 150,
      currentPatients: 80,
      availableBeds: 70,
      emergencyBeds: 15,
      ambulanceBays: 3,
      latitude: 28.7041,
      longitude: 77.1025,
    },
    {
      name: "South Medical Center",
      zone: "South",
      capacity: 180,
      currentPatients: 120,
      availableBeds: 60,
      emergencyBeds: 18,
      ambulanceBays: 4,
      latitude: 28.5355,
      longitude: 77.225,
    },
  ];

  const sampleAmbulanceData = [
    {
      ambulanceId: "AMB-001",
      zone: "Central",
      status: "Available",
      currentLocation: { latitude: 28.6139, longitude: 77.209 },
      lastDispatchTime: "2024-01-15T10:30:00Z",
      totalTrips: 156,
      averageResponseTime: 8.5,
    },
    {
      ambulanceId: "AMB-002",
      zone: "North",
      status: "On Route",
      currentLocation: { latitude: 28.7041, longitude: 77.1025 },
      lastDispatchTime: "2024-01-15T10:45:00Z",
      totalTrips: 142,
      averageResponseTime: 9.2,
    },
    {
      ambulanceId: "AMB-003",
      zone: "South",
      status: "Available",
      currentLocation: { latitude: 28.5355, longitude: 77.225 },
      lastDispatchTime: "2024-01-15T09:15:00Z",
      totalTrips: 178,
      averageResponseTime: 7.8,
    },
  ];

  const sampleAccidentData = [
    {
      incidentId: "INC-001",
      zone: "Central",
      type: "Traffic Accident",
      severity: "High",
      location: { latitude: 28.6139, longitude: 77.209 },
      timestamp: "2024-01-15T10:30:00Z",
      casualties: 3,
      vehiclesInvolved: 2,
      weather: "Clear",
      roadConditions: "Dry",
    },
    {
      incidentId: "INC-002",
      zone: "North",
      type: "Medical Emergency",
      severity: "Medium",
      location: { latitude: 28.7041, longitude: 77.1025 },
      timestamp: "2024-01-15T10:45:00Z",
      casualties: 1,
      vehiclesInvolved: 0,
      weather: "Rainy",
      roadConditions: "Wet",
    },
    {
      incidentId: "INC-003",
      zone: "South",
      type: "Fire Incident",
      severity: "Critical",
      location: { latitude: 28.5355, longitude: 77.225 },
      timestamp: "2024-01-15T09:15:00Z",
      casualties: 5,
      vehiclesInvolved: 1,
      weather: "Clear",
      roadConditions: "Dry",
    },
  ];

  const handleImportData = async (type, data) => {
    setLoading(true);
    setImportStatus(null);

    try {
      const result = await api.importData(type, data);
      if (result.success) {
        setImportStatus({
          type: "success",
          message: `Successfully imported ${data.length} ${type} records`,
        });
      } else {
        setImportStatus({
          type: "error",
          message: result.message || "Import failed",
        });
      }
    } catch {
      setImportStatus({
        type: "error",
        message: "Network error occurred during import",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        const jsonData = JSON.parse(content);
        await handleImportData(
          type,
          Array.isArray(jsonData) ? jsonData : [jsonData],
        );
      } catch {
        setImportStatus({
          type: "error",
          message: "Invalid JSON file format",
        });
      }
    };
    reader.readAsText(file);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case "hospitals":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Hospital Data Import
              </h4>
              <p className="text-sm text-blue-700">
                Import hospital information including capacity, current patient
                load, available beds, and location data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">
                  Sample Data Structure
                </h5>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-64">
                  {JSON.stringify(sampleHospitalData[0], null, 2)}
                </pre>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Hospital Data (JSON)
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileUpload(e, "hospitals")}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <button
                  onClick={() =>
                    handleImportData("hospitals", sampleHospitalData)
                  }
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Importing..." : "Import Sample Hospital Data"}
                </button>
              </div>
            </div>
          </div>
        );

      case "ambulances":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">
                Ambulance Data Import
              </h4>
              <p className="text-sm text-green-700">
                Import ambulance status, location, availability, and performance
                metrics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">
                  Sample Data Structure
                </h5>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-64">
                  {JSON.stringify(sampleAmbulanceData[0], null, 2)}
                </pre>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Ambulance Data (JSON)
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileUpload(e, "ambulances")}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>

                <button
                  onClick={() =>
                    handleImportData("ambulances", sampleAmbulanceData)
                  }
                  disabled={loading}
                  className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Importing..." : "Import Sample Ambulance Data"}
                </button>
              </div>
            </div>
          </div>
        );

      case "incidents":
        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">
                Incident Data Import
              </h4>
              <p className="text-sm text-red-700">
                Import accident and incident reports with location, severity,
                and response details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">
                  Sample Data Structure
                </h5>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-64">
                  {JSON.stringify(sampleAccidentData[0], null, 2)}
                </pre>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Incident Data (JSON)
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileUpload(e, "incidents")}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                </div>

                <button
                  onClick={() =>
                    handleImportData("incidents", sampleAccidentData)
                  }
                  disabled={loading}
                  className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Importing..." : "Import Sample Incident Data"}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Data Import</h2>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600">
            Import emergency service data including hospital information,
            ambulance status, and incident reports. Use the sample data or
            upload your own JSON files.
          </p>
        </div>
      </div>

      {/* Import Status */}
      {importStatus && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            importStatus.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{importStatus.message}</span>
            <button
              onClick={() => setImportStatus(null)}
              className="text-sm hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "hospitals", name: "Hospitals", icon: "🏥" },
              { id: "ambulances", name: "Ambulances", icon: "🚑" },
              { id: "incidents", name: "Incidents", icon: "🚨" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">{getTabContent()}</div>
      </div>

      {/* Import Guidelines */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Import Guidelines
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Hospital Data</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Name and zone required</li>
                <li>• Capacity and bed counts</li>
                <li>• Location coordinates</li>
                <li>• Emergency facilities</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Ambulance Data</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ambulance ID required</li>
                <li>• Status and location</li>
                <li>• Performance metrics</li>
                <li>• Last dispatch time</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Incident Data</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Incident ID required</li>
                <li>• Type and severity</li>
                <li>• Location coordinates</li>
                <li>• Timestamp and details</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">File Format</h5>
            <p className="text-sm text-gray-600">
              Upload JSON files with arrays of objects matching the sample
              structures above. Each import will validate the data and provide
              feedback on success or errors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataImport;

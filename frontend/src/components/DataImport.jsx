import React, { useState } from "react";
import {
  Upload,
  FileText,
  Database,
  AlertTriangle,
  CheckCircle,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const DataImport = () => {
  const [importType, setImportType] = useState("hospitals");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setSuccess(null);

    // Preview data if it's a JSON file
    if (selectedFile && selectedFile.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setPreviewData(data);
        } catch {
          setPreviewData(null);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setPreviewData(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", importType);

    try {
      const response = await fetch("/api/data/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccess(result.message || "Data imported successfully");
      setFile(null);
      setPreviewData(null);
    } catch (err) {
      console.error("Error importing data:", err);
      setError(err.message || "Failed to import data");
    } finally {
      setLoading(false);
    }
  };

  const getImportTypeDescription = (type) => {
    switch (type) {
      case "hospitals":
        return "Import hospital information including names, locations, and capacity data";
      case "ambulances":
        return "Import ambulance availability and status information";
      case "incidents":
        return "Import accident and incident reports with timestamps and locations";
      case "weather":
        return "Import weather data that affects emergency response times";
      default:
        return "Select a data type to import";
    }
  };

  const sampleData = {
    hospitals: [
      {
        name: "City General Hospital",
        location: "123 Medical Ave, City Center",
        capacity: 500,
        currentPatients: 420,
        availableBeds: 80,
        availableAmbulances: 15,
      },
      {
        name: "Regional Medical Center",
        location: "456 Health St, North District",
        capacity: 300,
        currentPatients: 180,
        availableBeds: 120,
        availableAmbulances: 8,
      },
    ],
    ambulances: [
      {
        hospitalId: "hospital_1",
        status: "AVAILABLE",
        location: "Hospital Parking",
        lastMaintenance: "2024-01-15",
      },
      {
        hospitalId: "hospital_2",
        status: "ON_MISSION",
        location: "En route to accident site",
        eta: "12 minutes",
      },
    ],
    incidents: [
      {
        type: "Traffic Accident",
        location: "Main St & 5th Ave",
        severity: "HIGH",
        timestamp: "2024-01-15T14:30:00Z",
        casualties: 3,
        requiredUnits: 2,
      },
    ],
    weather: [
      {
        date: "2024-01-15",
        temperature: 5.2,
        precipitation: 15.5,
        windSpeed: 25.3,
        visibility: 8.7,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-info-blue p-3 rounded-lg">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark-navy">
                  Data Import
                </h1>
                <p className="text-sm text-neutral-gray">
                  Import emergency data from various sources
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Import Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-dark-navy mb-6">
              Import Data
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Import Type Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-gray mb-2">
                  Data Type
                </label>
                <select
                  value={importType}
                  onChange={(e) => setImportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-info-blue focus:border-transparent"
                >
                  <option value="hospitals">Hospitals</option>
                  <option value="ambulances">Ambulances</option>
                  <option value="incidents">Incidents</option>
                  <option value="weather">Weather Data</option>
                </select>
                <p className="mt-2 text-sm text-neutral-gray">
                  {getImportTypeDescription(importType)}
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-gray mb-2">
                  File Upload
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-info-blue transition-colors">
                  <input
                    type="file"
                    accept=".json,.csv,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-neutral-gray mb-4" />
                    <div className="text-sm text-neutral-gray">
                      {file ? (
                        <span className="text-dark-navy font-medium">
                          {file.name}
                        </span>
                      ) : (
                        "Click to upload or drag and drop"
                      )}
                    </div>
                    <p className="text-xs text-neutral-gray mt-2">
                      JSON, CSV, or Excel files only
                    </p>
                  </label>
                </div>
              </div>

              {/* Preview Toggle */}
              {previewData && (
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center space-x-2 text-info-blue hover:text-info-blue/80"
                  >
                    {showPreview ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span>{showPreview ? "Hide" : "Show"} Preview</span>
                  </button>
                  <span className="text-sm text-neutral-gray">
                    File contains{" "}
                    {Array.isArray(previewData)
                      ? previewData.length
                      : Object.keys(previewData).length}{" "}
                    records
                  </span>
                </div>
              )}

              {/* Preview Section */}
              {showPreview && previewData && (
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
                  <h3 className="text-sm font-medium text-dark-navy mb-2">
                    Data Preview
                  </h3>
                  <pre className="text-xs text-neutral-gray overflow-auto">
                    {JSON.stringify(previewData, null, 2)}
                  </pre>
                </div>
              )}

              {/* Status Messages */}
              {error && (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-info-blue text-white py-3 px-4 rounded-lg hover:bg-info-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>Import Data</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sample Data & Instructions */}
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4">
                Import Instructions
              </h2>
              <div className="space-y-3 text-sm text-neutral-gray">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-info-blue mt-0.5" />
                  <div>
                    <strong>File Formats:</strong> JSON, CSV, or Excel files are
                    supported
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-warning-orange mt-0.5" />
                  <div>
                    <strong>Data Validation:</strong> All data will be validated
                    before import
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-success-green mt-0.5" />
                  <div>
                    <strong>Backup:</strong> Existing data will be preserved
                    during import
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Data */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4">
                Sample Data Format
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-dark-navy mb-2">
                  For {importType}
                </h3>
                <pre className="text-xs text-neutral-gray overflow-auto">
                  {JSON.stringify(sampleData[importType], null, 2)}
                </pre>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-dark-navy">
                      Generate Mock Data
                    </span>
                    <Database className="h-4 w-4 text-neutral-gray" />
                  </div>
                  <p className="text-xs text-neutral-gray mt-1">
                    Create sample data for testing
                  </p>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-dark-navy">
                      Export Current Data
                    </span>
                    <Upload className="h-4 w-4 text-neutral-gray" />
                  </div>
                  <p className="text-xs text-neutral-gray mt-1">
                    Download existing data as backup
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataImport;

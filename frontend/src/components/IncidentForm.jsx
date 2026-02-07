import React, { useState } from "react";
import {
  AlertTriangle,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  MapPin,
  Clock,
  FileText,
  Activity,
} from "lucide-react";

const IncidentForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    zone: "",
    severity: "Medium",
    riskLevel: "Medium",
    description: "",
    victimCount: "",
    timestamp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const zones = ["North", "South", "East", "West", "Central"];
  const severities = ["Low", "Medium", "High", "Critical"];
  const riskLevels = ["Low", "Medium", "High"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.type.trim()) {
      errors.push("Incident type is required");
    }

    if (!formData.zone) {
      errors.push("Zone selection is required");
    }

    if (!formData.timestamp) {
      errors.push("Timestamp is required");
    }

    if (
      formData.victimCount &&
      (isNaN(formData.victimCount) || parseInt(formData.victimCount) < 0)
    ) {
      errors.push("Victim count must be a non-negative number");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const incidentData = {
        type: formData.type.trim(),
        zone: formData.zone,
        severity: formData.severity,
        riskLevel: formData.riskLevel,
        description: formData.description.trim(),
        victimCount: formData.victimCount ? parseInt(formData.victimCount) : 0,
        timestamp: new Date(formData.timestamp),
      };

      const response = await fetch("/api/data/accidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accidents: [incidentData],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setSuccess("Incident reported successfully!");
      setFormData({
        type: "",
        zone: "",
        severity: "Medium",
        riskLevel: "Medium",
        description: "",
        victimCount: "",
        timestamp: "",
      });
    } catch (err) {
      console.error("Error saving incident:", err);
      setError(err.message || "Failed to save incident");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.type.trim() && formData.zone && formData.timestamp;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-orange-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Report Incident
          </h1>
          <p className="text-gray-600">
            Log emergency incidents and accidents for immediate response
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Incident Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Incident Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="e.g. Car Accident, Fire, Medical Emergency"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Zone Selection */}
              <div>
                <label
                  htmlFor="zone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Zone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a zone</option>
                    {zones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Severity & Risk Level Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="severity"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Severity
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Activity className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="severity"
                      name="severity"
                      value={formData.severity}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      {severities.map((sev) => (
                        <option key={sev} value={sev}>
                          {sev}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="riskLevel"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Risk Level
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="riskLevel"
                      name="riskLevel"
                      value={formData.riskLevel}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      {riskLevels.map((risk) => (
                        <option key={risk} value={risk}>
                          {risk} Risk
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Timestamp & Victim Count */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="timestamp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date & Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      id="timestamp"
                      name="timestamp"
                      value={formData.timestamp}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="victimCount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Victim Count (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="victimCount"
                      name="victimCount"
                      value={formData.victimCount}
                      onChange={handleInputChange}
                      placeholder="Number of victims"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Additional details about the incident..."
                  rows="3"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                ></textarea>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  loading || !isFormValid
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Reporting Incident...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Report Incident</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Instructions
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Incident Type and Zone are mandatory fields</li>
              <li>• Set Severity and Risk Level to help with prioritization</li>
              <li>• Use the correct timestamp for when the incident occurred</li>
              <li>• Provide victim count if known for ambulance allocation</li>
              <li>• Add description for context to the emergency team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentForm;

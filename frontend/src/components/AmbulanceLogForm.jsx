import React, { useState, useEffect } from "react";
import {
  Car,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  MapPin,
  Clock,
  Users,
  Stethoscope,
} from "lucide-react";

const AmbulanceLogForm = () => {
  const [formData, setFormData] = useState({
    hospital: "",
    zone: "",
    patientCount: "",
    timestamp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  const zones = ["North", "South", "East", "West", "Central"];

  // Fetch hospitals from backend
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("/api/data/hospitals-list");
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
             setHospitals(result.data);
          } else {
             setHospitals([]);
          }
        }
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setHospitals([]);
      }
    };

    fetchHospitals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.hospital) {
      errors.push("Hospital selection is required");
    }

    if (!formData.zone) {
      errors.push("Zone selection is required");
    }

    if (formData.patientCount === "") {
      errors.push("Patient count is required");
    } else if (
      isNaN(formData.patientCount) ||
      parseInt(formData.patientCount) < 0
    ) {
      errors.push("Patient count must be a non-negative number");
    } else if (parseInt(formData.patientCount) > 10) {
      errors.push("Patient count cannot exceed 10");
    }

    if (!formData.timestamp) {
      errors.push("Timestamp is required");
    } else {
      const timestamp = new Date(formData.timestamp);
      if (isNaN(timestamp.getTime())) {
        errors.push("Invalid timestamp format");
      }
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
      const logData = {
        hospital: formData.hospital,
        zone: formData.zone,
        patientCount: parseInt(formData.patientCount),
        timestamp: new Date(formData.timestamp),
      };

      const response = await fetch("/api/data/ambulance-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logs: [logData],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setSuccess("Ambulance log saved successfully!");
      setFormData({
        hospital: "",
        zone: "",
        patientCount: "",
        timestamp: "",
      });
    } catch (err) {
      console.error("Error saving ambulance log:", err);
      setError(err.message || "Failed to save ambulance log");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.hospital &&
    formData.zone &&
    formData.patientCount &&
    formData.timestamp;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-red-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ambulance Log Import
          </h1>
          <p className="text-gray-600">
            Track ambulance availability and patient transport data
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hospital Selection */}
              <div>
                <label
                  htmlFor="hospital"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hospital
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Stethoscope className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="hospital"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital._id} value={hospital._id}>
                        {hospital.name}
                      </option>
                    ))}
                  </select>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
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

              {/* Patient Count */}
              <div>
                <label
                  htmlFor="patientCount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Patient Count
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="patientCount"
                    name="patientCount"
                    value={formData.patientCount}
                    onChange={handleInputChange}
                    placeholder="Number of patients transported"
                    min="0"
                    max="10"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Maximum 10 patients per ambulance
                </p>
              </div>

              {/* Timestamp */}
              <div>
                <label
                  htmlFor="timestamp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Timestamp
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Date and time of ambulance activity
                </p>
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
                    : "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Saving Log...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Ambulance Log</span>
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
              <li>• All fields marked with an asterisk (*) are required</li>
              <li>• Select the hospital where the ambulance is stationed</li>
              <li>• Choose the zone where the ambulance was deployed</li>
              <li>• Enter the number of patients transported (max 10)</li>
              <li>• Record the exact timestamp of the activity</li>
              <li>
                • Data helps track ambulance availability and response times
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceLogForm;

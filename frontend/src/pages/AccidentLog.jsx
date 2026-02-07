import React, { useState, useEffect } from "react";
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
  Car,
  Building2,
} from "lucide-react";

const AccidentLogForm = () => {
  const [formData, setFormData] = useState({
    location: "",
    hospital: "",
    availableAmbulance: "",
    severity: "Medium",
    riskLevel: "Medium",
    description: "",
    timestamp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [hospitals, setHospitals] = useState([]);
  const [ambulances, setAmbulances] = useState([]);

  const zones = ["North", "South", "East", "West", "Central"];
  const severities = ["Low", "Medium", "High", "Critical"];
  const riskLevels = ["Low", "Medium", "High"];

  // Fetch Hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("/api/data/hospitals-list");
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setHospitals(result.data);
          }
        }
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      }
    };
    fetchHospitals();
  }, []);

  // Fetch Available Ambulances based on Zone/Status
  useEffect(() => {
    const fetchAmbulances = async () => {
      try {
        const response = await fetch("/api/ambulances");
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            // Filter only available ambulances, optionally filter by zone if selected
            const available = result.data.filter(
              (a) => a.status === "Available",
            );
            setAmbulances(available);
          } else {
            setAmbulances([]);
          }
        }
      } catch (err) {
        console.error("Error fetching ambulances:", err);
        setAmbulances([]);
      }
    };
    fetchAmbulances();
  }, [formData.location]); // Re-fetch when location changes? Or just filter client side.
  // Ideally fetch all and filter client side to avoid too many requests,
  // but if list is huge, server side filtering is better.
  // For now, keeping it simple: fetch all once, and the render filters by zone.
  // Wait, I see the dependency array was empty `[]`.
  // Let's rely on the render filter.

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
    if (!formData.location) errors.push("Location (Zone) is required");
    if (!formData.hospital) errors.push("Registered Hospital is required");
    if (!formData.timestamp) errors.push("Timestamp is required");
    // Available Ambulance is optional or required? User said "available ambulance drop down".
    // I will make it optional but recommended.

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
      // We are creating an AmbulanceLog entry effectively, or an Incident.
      // Based on fields (hospital, ambulance), this maps well to AmbulanceLog
      // but with extra accident context.
      // However, the user asked for "Accident Form".
      // Let's save this as an AmbulanceLog because it involves dispatching an ambulance (patient transport).
      // AND create an Incident if needed?
      // The user previously asked to "remove ambulance log from data import" and replace with this.
      // So this is the new way to log ambulance activity.

      const incidentData = {
        type: "Accident", // Default type
        zone: formData.location,
        severity: formData.severity,
        riskLevel: formData.riskLevel,
        description: formData.description,
        timestamp: new Date(formData.timestamp),
        ambulanceId: formData.availableAmbulance || null,
        hospital: formData.hospital,
      };

      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incidentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setSuccess("Accident dispatch logged successfully!");
      setFormData({
        location: "",
        hospital: "",
        availableAmbulance: "",
        severity: "Medium",
        riskLevel: "Medium",
        description: "",
        timestamp: "",
      });

      // Optionally update the ambulance status to Busy?
      // For now, we just log the event as requested.
    } catch (err) {
      console.error("Error saving log:", err);
      setError(err.message || "Failed to save log");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.location && formData.hospital && formData.timestamp;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-red-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Accident Dispatch Form
          </h1>
          <p className="text-gray-600">
            Log accident details and dispatch ambulance resources
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location / Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Zone)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Zone</option>
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Registered Hospital */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered Hospital
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name} ({h.zone})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Available Ambulance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Ambulance
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Car className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="availableAmbulance"
                  value={formData.availableAmbulance}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Ambulance</option>
                  {ambulances.length === 0 && (
                    <option disabled>No ambulances available</option>
                  )}
                  {ambulances
                    .filter(
                      (a) => !formData.location || a.zone === formData.location,
                    ) // Filter by zone if selected
                    .map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.ambulanceId} ({a.zone})
                      </option>
                    ))}
                </select>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Only showing Available ambulances (Filtered by Zone if selected)
              </p>
            </div>

            {/* Severity & Risk */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  {severities.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Level
                </label>
                <select
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  {riskLevels.map((r) => (
                    <option key={r} value={r}>
                      {r} Risk
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timestamp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timestamp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  name="timestamp"
                  value={formData.timestamp}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Details about the accident..."
              ></textarea>
            </div>

            {/* Feedback */}
            {error && (
              <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
                loading || !isFormValid
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 shadow-lg"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Dispatch Ambulance"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccidentLogForm;

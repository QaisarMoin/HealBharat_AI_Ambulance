import React, { useState } from "react";
import {
  Building2,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  MapPin,
  Users,
  Bed,
} from "lucide-react";

const HospitalDataForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    zone: "",
    capacity: "",
    currentLoad: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const zones = ["North", "South", "East", "West", "Central"];

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

    if (!formData.name.trim()) {
      errors.push("Hospital name is required");
    }

    if (!formData.zone) {
      errors.push("Zone selection is required");
    }

    if (!formData.capacity) {
      errors.push("Total capacity is required");
    } else if (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
      errors.push("Total capacity must be a positive number");
    } else if (parseInt(formData.capacity) > 1000) {
      errors.push("Total capacity cannot exceed 1000");
    }

    if (
      formData.currentLoad &&
      (isNaN(formData.currentLoad) || parseInt(formData.currentLoad) < 0)
    ) {
      errors.push("Current load must be a non-negative number");
    }

    if (parseInt(formData.currentLoad) > parseInt(formData.capacity)) {
      errors.push("Current load cannot exceed total capacity");
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
      const hospitalData = {
        name: formData.name.trim(),
        zone: formData.zone,
        capacity: parseInt(formData.capacity),
        currentLoad: formData.currentLoad ? parseInt(formData.currentLoad) : 0,
      };

      const response = await fetch("/api/data/hospitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospitals: [hospitalData],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccess("Hospital data saved successfully!");
      setFormData({
        name: "",
        zone: "",
        capacity: "",
        currentLoad: "",
      });
    } catch (err) {
      console.error("Error saving hospital data:", err);
      setError(err.message || "Failed to save hospital data");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim() && formData.zone && formData.capacity;

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-emerald-600/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-900/20">
            <Building2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Hospital Data Import
          </h1>
          <p className="text-gray-400">
            Enter hospital information for emergency prediction analysis
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0A0A0A] rounded-xl shadow-lg p-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hospital Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Hospital Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter hospital name"
                    className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-colors placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Zone Selection */}
              <div>
                <label
                  htmlFor="zone"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Zone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-500" />
                  </div>
                  <select
                    id="zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-colors"
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

              {/* Total Capacity */}
              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Total Capacity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bed className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Enter total bed capacity"
                    min="1"
                    max="1000"
                    className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-colors placeholder-gray-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Maximum capacity: 1000 beds
                </p>
              </div>

              {/* Current Load */}
              <div>
                <label
                  htmlFor="currentLoad"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Current Load (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    id="currentLoad"
                    name="currentLoad"
                    value={formData.currentLoad}
                    onChange={handleInputChange}
                    placeholder="Enter current patient load"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-colors placeholder-gray-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty if unknown (defaults to 0)
                </p>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="flex items-center space-x-2 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] px-4 py-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] px-4 py-3 rounded-lg">
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
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                    : "bg-[#10B981] text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Saving Data...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Hospital Data</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Instructions
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• All fields marked with an asterisk (*) are required</li>
              <li>• Hospital name must be unique and descriptive</li>
              <li>• Zone selection helps with regional analysis</li>
              <li>• Capacity represents total available beds</li>
              <li>• Current load should not exceed total capacity</li>
              <li>• Data is stored securely in the database</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDataForm;

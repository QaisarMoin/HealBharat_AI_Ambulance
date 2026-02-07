import React, { useState } from "react";
import HospitalDataForm from "../components/HospitalDataForm";
import IncidentForm from "../components/IncidentForm";
import { Building2, AlertTriangle } from "lucide-react";

const DataImportPage = () => {
  const [activeTab, setActiveTab] = useState("hospitals");

  const tabs = [
    {
      id: "hospitals",
      name: "Hospital Data",
      icon: Building2,
      component: <HospitalDataForm />,
    },
    {
      id: "incidents",
      name: "Report Incident",
      icon: AlertTriangle,
      component: <IncidentForm />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Data Import System
            </h1>
            <p className="text-gray-600">
              Import hospital and ambulance data for emergency prediction
              analysis
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default DataImportPage;

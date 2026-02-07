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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black/95 shadow-sm border-b border-white/10 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Data Import System
            </h1>
            <p className="text-gray-400">
              Import hospital and ambulance data for emergency prediction
              analysis
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black border-b border-white/10 sticky top-[105px] z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-[#0A0A0A] p-1 rounded-lg my-4 border border-white/10">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
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

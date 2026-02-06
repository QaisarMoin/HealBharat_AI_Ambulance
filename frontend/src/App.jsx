import React, { useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Map,
  Database,
  Menu,
  X,
} from "lucide-react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Alerts from "./components/Alerts";
import MapView from "./components/MapView";
import DataImport from "./components/DataImport";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "alerts", name: "Alerts", icon: AlertTriangle },
    { id: "map", name: "Map View", icon: Map },
    { id: "import", name: "Data Import", icon: Database },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "alerts":
        return <Alerts />;
      case "map":
        return <MapView />;
      case "import":
        return <DataImport />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      Sidebar
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-dark-navy">Emergency Ops</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-neutral-gray" />
          </button>
        </div>

        <nav className="mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-info-blue bg-opacity-10 text-info-blue border-r-2 border-info-blue"
                    : "text-neutral-gray hover:bg-gray-50 hover:text-dark-navy"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
      {/* Main Content */}
      <main
        className={`lg:ml-64 ${sidebarOpen ? "opacity-50" : "opacity-100"} transition-opacity duration-300`}
      >
        {renderContent()}
      </main>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;

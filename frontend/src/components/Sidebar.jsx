// import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, AlertTriangle, Map, Database, Brain, Settings } from "lucide-react";

const Sidebar = () => {
  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "ai-insights", name: "AI Insights", icon: Brain, path: "/ai-insights" },
    { id: "alerts", name: "Alerts", icon: AlertTriangle, path: "/alerts" },
    { id: "accident-log", name: "Accident Form", icon: AlertTriangle, path: "/accident-log" },
    { id: "map", name: "Map View", icon: Map, path: "/map" },
    { id: "manage", name: "Manage Resources", icon: Settings, path: "/manage" },
    { id: "import", name: "Data Import", icon: Database, path: "/data" },
  ];

  return (
    <div className="w-64 bg-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-dark-navy">Emergency Ops</h1>
      </div>

      <nav className="mt-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors text-neutral-gray hover:bg-gray-50 hover:text-dark-navy`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

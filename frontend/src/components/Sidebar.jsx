// import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  Map,
  Database,
  Brain,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, path: "/" },
    {
      id: "ai-insights",
      name: "AI Insights",
      icon: Brain,
      path: "/ai-insights",
    },
    { id: "alerts", name: "Alerts", icon: AlertTriangle, path: "/alerts" },
    {
      id: "accident-log",
      name: "Accident Form",
      icon: AlertTriangle,
      path: "/accident-log",
    },
    { id: "map", name: "Map View", icon: Map, path: "/map" },
    { id: "manage", name: "Manage Resources", icon: Settings, path: "/manage" },
    { id: "import", name: "Data Import", icon: Database, path: "/data" },
  ];

  return (
    <div className="h-full bg-black flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white tracking-wide">
          Emergency Ops
        </h1>
        <p className="text-xs text-gray-500 mt-1">Control Center</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${isActive ? "bg-white/10 text-white border-l-2 border-[#10B981]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${isActive ? "text-[#10B981]" : "group-hover:text-[#10B981]"}`}
              />
              <span className="font-medium text-sm">{tab.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
          <span className="text-xs font-medium text-gray-300">
            System Operational
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

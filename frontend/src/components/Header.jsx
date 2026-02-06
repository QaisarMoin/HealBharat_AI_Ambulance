import React, { useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Map,
  Database,
  Menu,
  X,
  Bell,
  User,
  Shield,
  Clock,
  Activity,
  Heart,
  Map as MapIcon,
  Wifi,
} from "lucide-react";

const Header = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "alerts", name: "Alerts", icon: AlertTriangle },
    { id: "map", name: "Map View", icon: Map },
    { id: "import", name: "Data Import", icon: Database },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0B0F1A]/80 border-b border-white/10 shadow-2xl">
      {/* Main Header */}
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-gray-300" />
            ) : (
              <Menu className="h-5 w-5 text-gray-300" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Emergency Ops
              </h1>
              <p className="text-xs text-gray-400">
                AI Emergency Command Center
              </p>
            </div>
          </div>

          {/* Desktop Tabs */}
          <nav className="hidden lg:flex gap-2 ml-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-400/20 shadow-md shadow-cyan-500/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* System Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-xs text-gray-300">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Online
            <Wifi className="h-3 w-3 text-green-400" />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl hover:bg-white/10 transition hover:scale-105"
            >
              <Bell className="h-5 w-5 text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl bg-[#0F172A] border border-white/10 shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 text-sm font-semibold text-white">
                  Notifications
                </div>

                <div className="px-4 py-3 hover:bg-white/5 cursor-pointer">
                  <p className="text-sm text-red-400 font-medium">
                    Critical Alert
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    High-risk incident detected
                  </p>
                </div>

                <div className="px-4 py-3 hover:bg-white/5 cursor-pointer">
                  <p className="text-sm text-yellow-400 font-medium">
                    System Update
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Ambulance availability updated
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition"
            >
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#0B0F1A] rounded-full" />
              </div>
              <span className="hidden sm:block text-sm text-gray-200">
                Admin
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#0F172A] border border-white/10 rounded-xl shadow-xl">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                  Settings
                </button>
                <div className="border-t border-white/10" />
                <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Bar */}
      <div className="px-6 py-2 text-xs text-gray-400 bg-[#0B0F1A]/60 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-cyan-400 font-medium">
            {tabs.find((t) => t.id === activeTab)?.name}
          </span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date().toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3 text-green-400" /> Active: 12
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-red-400" /> Patients: 45
          </span>
          <span className="flex items-center gap-1">
            <MapIcon className="h-3 w-3 text-blue-400" /> Ambulances: 8
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;

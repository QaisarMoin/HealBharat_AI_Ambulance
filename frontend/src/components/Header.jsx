import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b border-white/10 backdrop-blur-sm">
      {/* Main Header */}
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#10B981]" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Emergency Ops
              </h1>
              <p className="text-xs text-gray-500">AI Command Center</p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            System Online
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full border border-black" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl bg-black border border-white/10 shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 text-sm font-semibold text-white flex justify-between items-center">
                  <span>Notifications</span>
                  <span className="text-xs text-gray-500">Mark all read</span>
                </div>

                <div className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                    <p className="text-sm text-[#EF4444] font-medium">
                      Critical Alert
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 ml-4">
                    High-risk incident detected in North Zone
                  </p>
                </div>

                <div className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                    <p className="text-sm text-[#F59E0B] font-medium">
                      System Update
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 ml-4">
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
              className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full hover:bg-white/5 transition border border-transparent hover:border-white/10"
            >
              <div className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-black">
                <User className="h-4 w-4 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] border-2 border-black rounded-full" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-300">
                Admin
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-black border border-white/10 rounded-xl shadow-xl">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-white font-medium">
                    Administrator
                  </p>
                  <p className="text-xs text-gray-500">admin@healbharat.com</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                  Settings
                </button>
                <div className="border-t border-white/10 my-1" />
                <button className="w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

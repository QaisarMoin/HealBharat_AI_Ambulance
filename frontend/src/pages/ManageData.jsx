import React, { useState, useEffect } from "react";
import {
  Building2,
  Car,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
} from "lucide-react";

const ManageData = () => {
  const [activeTab, setActiveTab] = useState("hospitals");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const zones = ["North", "South", "East", "West", "Central"];

  // Fetch data on tab change
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "hospitals"
          ? "/api/hospitals"
          : activeTab === "ambulances"
          ? "/api/ambulances"
          : "/api/incidents";
      const response = await fetch(endpoint);
      const data = await response.json();
      setItems(data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const endpoint =
        activeTab === "hospitals"
          ? `/api/hospitals/${id}`
          : activeTab === "ambulances"
          ? `/api/ambulances/${id}`
          : `/api/incidents/${id}`;

      await fetch(endpoint, { method: "DELETE" });
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        activeTab === "hospitals"
          ? "/api/hospitals"
          : activeTab === "ambulances"
          ? "/api/ambulances"
          : "/api/incidents";

      const url = isEditing ? `${endpoint}/${currentItem._id}` : endpoint;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentItem),
      });

      if (response.ok) {
        setShowModal(false);
        fetchData();
      } else {
        const err = await response.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const openModal = (item = null) => {
    setIsEditing(!!item);
    if (item) {
      setCurrentItem(item);
    } else {
      // Default initial states
      if (activeTab === "hospitals") {
        setCurrentItem({ name: "", zone: "North", capacity: 100, currentLoad: 0 });
      } else if (activeTab === "ambulances") {
        setCurrentItem({
          ambulanceId: "",
          zone: "North",
          status: "Available",
        });
      } else {
        setCurrentItem({
          type: "Accident",
          severity: "Medium",
          riskLevel: "Medium",
          zone: "North",
          description: "",
          victimCount: 0,
          timestamp: new Date().toISOString().slice(0, 16),
        });
      }
    }
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Resources</h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-2 bg-[#0A0A0A] text-white px-4 py-2 rounded-lg hover:bg-white/5 border border-white/10 transition-all"
          >
            <Loader2 className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 border border-white/10 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-white/10">
        {[
          { id: "hospitals", icon: Building2, label: "Hospitals" },
          { id: "ambulances", icon: Car, label: "Ambulances" },
          { id: "incidents", icon: AlertTriangle, label: "Incidents" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#10B981] text-[#10B981]"
                : "border-transparent text-gray-400 hover:text-white hover:border-white/10"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
        </div>
      ) : (
        <div className="bg-[#0A0A0A] rounded-lg shadow-lg overflow-hidden border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/50">
              <tr>
                {activeTab === "hospitals" && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Zone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Load / Capacity</th>
                  </>
                )}
                {activeTab === "ambulances" && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Zone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  </>
                )}
                {activeTab === "incidents" && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Zone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity / Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                  </>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#0A0A0A] divide-y divide-white/10">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-colors border-l-2 border-l-transparent hover:border-l-[#3B82F6]">
                  {activeTab === "hospitals" && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">{item.zone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {item.currentLoad} / {item.capacity}
                        <span className="ml-2 text-xs text-gray-500">
                          ({Math.round((item.currentLoad / item.capacity) * 100)}%)
                        </span>
                      </td>
                    </>
                  )}
                  {activeTab === "ambulances" && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{item.ambulanceId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">{item.zone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                            item.status === "Available"
                              ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                              : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </>
                  )}
                  {activeTab === "incidents" && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{item.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">{item.zone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full w-fit border ${
                            item.severity === "High" || item.severity === "Critical"
                              ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                              : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                          }`}
                        >
                          Sev: {item.severity}
                        </span>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full w-fit border ${
                            item.riskLevel === "High"
                              ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                              : "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20"
                          }`}
                        >
                          Risk: {item.riskLevel || "N/A"}
                        </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openModal(item)}
                      className="text-white hover:text-[#10B981] mr-4 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-[#EF4444] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No items found. Click "Add New" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0A0A] rounded-xl shadow-2xl w-full max-w-md p-6 border border-white/10 ring-1 ring-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {isEditing ? "Edit" : "Add"} {activeTab.slice(0, -1)}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {activeTab === "hospitals" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Hospital Name</label>
                    <input
                      type="text"
                      required
                      className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] placeholder-gray-500"
                      value={currentItem.name}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Zone</label>
                    <select
                      className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                      value={currentItem.zone}
                      onChange={(e) => setCurrentItem({ ...currentItem, zone: e.target.value })}
                    >
                      {zones.map((z) => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
                      <input
                        type="number"
                        required
                        className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                        value={currentItem.capacity}
                        onChange={(e) => setCurrentItem({ ...currentItem, capacity: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Current Load</label>
                      <input
                        type="number"
                        required
                        className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                        value={currentItem.currentLoad}
                        onChange={(e) => setCurrentItem({ ...currentItem, currentLoad: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "ambulances" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Ambulance ID</label>
                    <input
                      type="text"
                      required
                      className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                      value={currentItem.ambulanceId}
                      onChange={(e) => setCurrentItem({ ...currentItem, ambulanceId: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Zone</label>
                    <select
                      className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                      value={currentItem.zone}
                      onChange={(e) => setCurrentItem({ ...currentItem, zone: e.target.value })}
                    >
                      {zones.map((z) => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select
                      className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                      value={currentItem.status}
                      onChange={(e) => setCurrentItem({ ...currentItem, status: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === "incidents" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Accident, Fire"
                      className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] placeholder-gray-500"
                      value={currentItem.type}
                      onChange={(e) => setCurrentItem({ ...currentItem, type: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Zone</label>
                      <select
                        className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                        value={currentItem.zone}
                        onChange={(e) => setCurrentItem({ ...currentItem, zone: e.target.value })}
                      >
                        {zones.map((z) => <option key={z} value={z}>{z}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Severity</label>
                      <select
                        className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                        value={currentItem.severity}
                        onChange={(e) => setCurrentItem({ ...currentItem, severity: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Risk Level</label>
                      <select
                        className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                        value={currentItem.riskLevel || "Medium"}
                        onChange={(e) => setCurrentItem({ ...currentItem, riskLevel: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time</label>
                      <input
                        type="datetime-local"
                        className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
                        value={currentItem.timestamp ? new Date(currentItem.timestamp).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setCurrentItem({ ...currentItem, timestamp: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      className="block w-full bg-[#111111] border border-white/10 rounded-lg shadow-sm p-2.5 text-white focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] resize-none"
                      value={currentItem.description || ""}
                      onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-emerald-600 flex items-center transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageData;

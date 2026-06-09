import React, { useState } from "react";
import { Warehouse, Equipment, EquipmentStatus } from "../types";
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Layers, 
  Notebook, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Wrench, 
  AlertCircle 
} from "lucide-react";

interface WarehouseListProps {
  warehouses: Warehouse[];
  equipments: Equipment[];
  onAddWarehouse: (wh: Omit<Warehouse, "id">) => void;
  onUpdateWarehouse: (wh: Warehouse) => void;
  onDeleteWarehouse: (id: string) => void;
}

export default function WarehouseList({
  warehouses,
  equipments,
  onAddWarehouse,
  onUpdateWarehouse,
  onDeleteWarehouse
}: WarehouseListProps) {
  const [expandedWarehouseId, setExpandedWarehouseId] = useState<string | null>(null);
  
  // Modals status
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingWh, setEditingWh] = useState<Warehouse | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [manager, setManager] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [capacity, setCapacity] = useState("100000");
  const [notes, setNotes] = useState("");

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !manager) {
      alert("Please populate Name, Location, and Manager");
      return;
    }
    onAddWarehouse({
      name,
      location,
      manager,
      phone,
      email,
      capacitySqM: parseInt(capacity) || 0,
      notes: notes || undefined
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleOpenEdit = (wh: Warehouse) => {
    setEditingWh(wh);
    setName(wh.name);
    setLocation(wh.location);
    setManager(wh.manager);
    setPhone(wh.phone);
    setEmail(wh.email);
    setCapacity((wh.capacitySqM || 0).toString());
    setNotes(wh.notes || "");
    setIsEditOpen(true);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWh || !name || !location || !manager) return;
    onUpdateWarehouse({
      id: editingWh.id,
      name,
      location,
      manager,
      phone,
      email,
      capacitySqM: parseInt(capacity) || 0,
      notes: notes || undefined
    });
    setIsEditOpen(false);
    resetForm();
    setEditingWh(null);
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setManager("");
    setPhone("");
    setEmail("");
    setCapacity("100000");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Upper actions wrapper */}
      <div className="flex items-center justify-between bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Warehouse Facility Hub</h2>
          <p className="text-xs text-slate-500 mt-1">Manage physical depot units and associated assets</p>
        </div>
        <button
          id="btn-add-wh"
          onClick={() => { resetForm(); setIsCreateOpen(true); }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Facility
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {warehouses.map((wh) => {
          const whAssets = equipments.filter(e => e.warehouseId === wh.id);
          const activeCount = whAssets.filter(e => e.status === EquipmentStatus.Active).length;
          const maintCount = whAssets.filter(e => e.status === EquipmentStatus.Maintenance).length;
          const serviceReqCount = whAssets.filter(e => e.status === EquipmentStatus.ServiceRequired).length;
          const isExpanded = expandedWarehouseId === wh.id;

          return (
            <div 
              key={wh.id} 
              className={`bg-white border transition-all rounded-2xl shadow-sm overflow-hidden ${
                isExpanded ? "border-blue-500 ring-4 ring-blue-50/15" : "border-slate-200"
              }`}
            >
              {/* Box Header Information */}
              <div 
                onClick={() => setExpandedWarehouseId(isExpanded ? null : wh.id)}
                className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/20 transition-colors"
                id={`wh-hdr-${wh.id}`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-sm md:text-base">
                        {wh.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        {wh.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Manager: <strong className="text-slate-700">{wh.manager}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Capacity: <strong className="text-slate-700">{(wh.capacitySqM || 0).toLocaleString()} m²</strong>
                    </span>
                  </div>
                </div>

                {/* Live Equipment Counts */}
                <div className="flex items-center flex-wrap gap-2 md:self-center">
                  <span className="px-3 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold">
                    {whAssets.length} Total Assets
                  </span>
                  
                  {activeCount > 0 && (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold">
                      {activeCount} Online
                    </span>
                  )}
                  {maintCount > 0 && (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[11px] font-bold">
                      {maintCount} Servicing
                    </span>
                  )}
                  {serviceReqCount > 0 && (
                    <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[11px] font-bold animate-pulse">
                      {serviceReqCount} Service Req.
                    </span>
                  )}

                  {/* Interactive Buttons block */}
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-4 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      title="Edit facility credentials"
                      onClick={() => handleOpenEdit(wh)}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="Delete facility mapping"
                      onClick={() => {
                        if (confirm(`Are you certain you wish to delete facility: ${wh.name}? (Linked assets will remain but need re-mapping)`)) {
                          onDeleteWarehouse(wh.id);
                        }
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Expanded Panel showing linked assets */}
              {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50/40 p-5 md:p-6 space-y-4">
                  {wh.notes && (
                    <div className="text-xs bg-white border border-slate-205 rounded-xl p-3 flex gap-2 text-slate-600 leading-relaxed font-mono">
                      <Notebook className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700 block text-[10px] uppercase tracking-wider mb-0.5">Facility Notes & Contacts</span>
                        <p>{wh.notes}</p>
                        <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500 ">
                          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {wh.phone}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {wh.email}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-655 uppercase tracking-widest block">Active Inventory Registry</h4>
                    
                    {whAssets.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center bg-white rounded-xl border border-dashed border-slate-200">
                        No equipment assets currently mapped to this warehouse.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {whAssets.map(asset => (
                          <div 
                            key={asset.id} 
                            className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-xs hover:border-slate-350 transition-colors"
                          >
                            <div className="space-y-1">
                              <span className="font-bold text-slate-800 text-sm block truncate max-w-sm">{asset.name}</span>
                              <div className="text-xs text-slate-400 flex items-center gap-2">
                                <span>Model: {asset.model}</span>
                                <span>&bull;</span>
                                <span>Category: {asset.category}</span>
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                              asset.status === EquipmentStatus.Active 
                                ? "bg-emerald-50 border-emerald-250 text-emerald-700" 
                                : asset.status === EquipmentStatus.Maintenance 
                                ? "bg-amber-50 border-amber-250 text-amber-700" 
                                : "bg-red-50 border-red-250 text-red-700"
                            }`}>
                              {asset.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CREATE WAREHOUSE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleSubmitCreate} className="p-6 md:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Register New Facility Mapping</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Facility Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Northeast Distribution Center (WH-4)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden text-slate-800"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Physical Location / Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seattle, WA - Port Sector A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Facility Manager *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ronald Vance"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={manager}
                      onChange={(e) => setManager(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Capacity (Square Meters - m²)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Warehouse Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (206) 555-0100"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Warehouse Email</label>
                    <input
                      type="email"
                      placeholder="facility@distribution.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">General Notes & Safety Disclaimers</label>
                  <textarea
                    rows={3}
                    placeholder="Specific operations managed, cold storage parameters, key contact rules..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Create Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT WAREHOUSE MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleSubmitEdit} className="p-6 md:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Edit Facility Parameters</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Facility Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden text-slate-800"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Physical Location / Address *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Facility Manager *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={manager}
                      onChange={(e) => setManager(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Capacity (Square Meters - m²)</label>
                    <input
                      type="number"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Warehouse Phone</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Warehouse Email</label>
                    <input
                      type="email"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">General Notes & Safety Disclaimers</label>
                  <textarea
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

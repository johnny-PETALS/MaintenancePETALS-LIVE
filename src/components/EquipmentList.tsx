import React, { useState } from "react";
import {
  Equipment,
  Warehouse,
  EquipmentStatus
} from "../types";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ListFilter,
  SlidersHorizontal,
  X,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
  Activity,
  Maximize2
} from "lucide-react";

const getEquipmentFallbackImage = (category?: string, name?: string) => {
  const cat = (category || "").toLowerCase();
  const n = (name || "").toLowerCase();
  
  if (cat.includes("handling") || n.includes("forklift") || n.includes("truck") || n.includes("lift")) {
    return "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=400";
  }
  if (cat.includes("hvac") || n.includes("chiller") || n.includes("cooling")) {
    return "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400";
  }
  if (cat.includes("automation") || cat.includes("sorting") || n.includes("conveyor")) {
    return "https://images.unsplash.com/photo-1580901368919-7738efb4f072?auto=format&fit=crop&q=80&w=400";
  }
  if (cat.includes("power") || n.includes("generator") || n.includes("caterpillar")) {
    return "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=400";
  }
  if (cat.includes("pneumatic") || n.includes("compressor") || n.includes("air")) {
    return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400";
  }
  if (cat.includes("dock") || n.includes("dock") || n.includes("leveler")) {
    return "https://images.unsplash.com/photo-1553413719-87a312353066?auto=format&fit=crop&q=80&w=400";
  }
  return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400";
};

interface EquipmentListProps {
  equipments: Equipment[];
  warehouses: Warehouse[];
  onAddEquipment: (eq: Omit<Equipment, "id">) => void;
  onUpdateEquipment: (eq: Equipment) => void;
  onDeleteEquipment: (id: string) => void;
  initialFormOpen?: boolean; // trigger from quick action
  initialSelectedAssetId?: string; // route view immediately
}

export default function EquipmentList({
  equipments,
  warehouses,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment,
  initialFormOpen = false,
  initialSelectedAssetId
}: EquipmentListProps) {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "cost" | "date" | "status">("name");

  // Selection & Form Drawers
  const [selectedAsset, setSelectedAsset] = useState<Equipment | null>(
    initialSelectedAssetId ? (equipments.find(e => e.id === initialSelectedAssetId) || null) : null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(initialFormOpen);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Material Handling");
  const [formWarehouseId, setFormWarehouseId] = useState(warehouses[0]?.id || "");
  const [formSerialNumber, setFormSerialNumber] = useState("");
  const [formModel, setFormModel] = useState("");
  const [formManufacturer, setFormManufacturer] = useState("");
  const [formPurchaseDate, setFormPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [formPurchaseCost, setFormPurchaseCost] = useState("0");
  const [formStatus, setFormStatus] = useState<EquipmentStatus>(EquipmentStatus.Active);
  const [formLastMaintenanceDate, setFormLastMaintenanceDate] = useState("");
  const [formNextMaintenanceDate, setFormNextMaintenanceDate] = useState("");
  const [formSpecs, setFormSpecs] = useState("");
  const [formId, setFormId] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formCurrency, setFormCurrency] = useState<"USD" | "CAD" | "EUR">("USD");

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image should not exceed 2MB for browser storage performance.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler: Open Create Modal
  const openCreateModal = () => {
    setFormName("");
    setFormCategory("Material Handling");
    setFormWarehouseId(warehouses[0]?.id || "");
    setFormSerialNumber("");
    setFormModel("");
    setFormManufacturer("");
    setFormPurchaseDate(new Date().toISOString().split("T")[0]);
    setFormPurchaseCost("5000");
    setFormCurrency("USD");
    setFormStatus(EquipmentStatus.Active);
    setFormLastMaintenanceDate(new Date().toISOString().split("T")[0]);
    setFormNextMaintenanceDate("");
    setFormSpecs("");
    setFormImageUrl("");
    setIsCreateModalOpen(true);
  };

  // Handler: Open Edit Modal
  const openEditModal = (eq: Equipment) => {
    setFormId(eq.id);
    setFormName(eq.name);
    setFormCategory(eq.category);
    setFormWarehouseId(eq.warehouseId);
    setFormSerialNumber(eq.serialNumber);
    setFormModel(eq.model);
    setFormManufacturer(eq.manufacturer);
    setFormPurchaseDate(eq.purchaseDate);
    setFormPurchaseCost(eq.purchaseCost.toString());
    setFormCurrency(eq.currency || "USD");
    setFormStatus(eq.status);
    setFormLastMaintenanceDate(eq.lastMaintenanceDate);
    setFormNextMaintenanceDate(eq.nextMaintenanceDate);
    setFormSpecs(eq.specs);
    setFormImageUrl(eq.imageUrl || "");
    setIsEditModalOpen(true);
  };

  // Form Submission handles
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSerialNumber || !formModel || !formManufacturer) {
      alert("Please populate all required fields (Name, Serial Number, Model, and Manufacturer)");
      return;
    }
    
    // Auto-calculate next maintenance if not set (default 3 months)
    let nextM = formNextMaintenanceDate;
    if (!nextM) {
      const pmDate = new Date(formLastMaintenanceDate || formPurchaseDate);
      pmDate.setMonth(pmDate.getMonth() + 3);
      nextM = pmDate.toISOString().split("T")[0];
    }

    onAddEquipment({
      name: formName,
      category: formCategory,
      warehouseId: formWarehouseId,
      serialNumber: formSerialNumber,
      model: formModel,
      manufacturer: formManufacturer,
      purchaseDate: formPurchaseDate,
      purchaseCost: parseFloat(formPurchaseCost) || 0,
      currency: formCurrency,
      status: formStatus,
      lastMaintenanceDate: formLastMaintenanceDate || formPurchaseDate,
      nextMaintenanceDate: nextM,
      specs: formSpecs,
      imageUrl: formImageUrl || undefined
    });

    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSerialNumber || !formModel || !formManufacturer) {
      alert("Please populate all required fields");
      return;
    }

    const updated: Equipment = {
      id: formId,
      name: formName,
      category: formCategory,
      warehouseId: formWarehouseId,
      serialNumber: formSerialNumber,
      model: formModel,
      manufacturer: formManufacturer,
      purchaseDate: formPurchaseDate,
      purchaseCost: parseFloat(formPurchaseCost) || 0,
      currency: formCurrency,
      status: formStatus,
      lastMaintenanceDate: formLastMaintenanceDate,
      nextMaintenanceDate: formNextMaintenanceDate,
      specs: formSpecs,
      imageUrl: formImageUrl
    };

    onUpdateEquipment(updated);
    setIsEditModalOpen(false);
    
    // update current drawers
    if (selectedAsset?.id === updated.id) {
      setSelectedAsset(updated);
    }
  };

  // Extract distinct categories
  const categoriesList = Array.from(new Set(equipments.map(e => e.category)));

  // Filter Logic
  const filteredEquipments = equipments.filter(eq => {
    const matchesSearch = 
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWarehouse = selectedWarehouseId ? eq.warehouseId === selectedWarehouseId : true;
    const matchesCategory = selectedCategory ? eq.category === selectedCategory : true;
    const matchesStatus = selectedStatus ? eq.status === selectedStatus : true;

    return matchesSearch && matchesWarehouse && matchesCategory && matchesStatus;
  });

  // Sort Logic
  const sortedEquipments = [...filteredEquipments].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "cost") {
      return b.purchaseCost - a.purchaseCost;
    } else if (sortBy === "date") {
      return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Search and control actions bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            id="eq-search-input"
            type="text"
            placeholder="Search assets by name, serial no, model..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-blue-500 focus:outline-hidden rounded-xl text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Warehouse Filter */}
          <select
            id="eq-filter-wh"
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 cursor-pointer font-semibold text-slate-700"
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
          >
            <option value="">All Warehouses</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            id="eq-filter-cat"
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 cursor-pointer font-semibold text-slate-700"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="eq-filter-status"
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 cursor-pointer font-semibold text-slate-700"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {Object.values(EquipmentStatus).map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Sort selection */}
          <select
            id="eq-sort"
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 cursor-pointer font-semibold text-slate-600"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name">Sort by Name</option>
            <option value="cost">Sort: Cost (High to Low)</option>
            <option value="date">Sort: Newest Purchase Date</option>
            <option value="status">Sort by Status</option>
          </select>

          {/* Clear filters trigger */}
          {(searchTerm || selectedWarehouseId || selectedCategory || selectedStatus) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedWarehouseId("");
                setSelectedCategory("");
                setSelectedStatus("");
              }}
              className="px-3 py-2.5 text-rose-600 hover:text-rose-700 font-bold text-xs border border-rose-200 bg-rose-50/50 rounded-lg cursor-pointer transition-colors"
            >
              Clear
            </button>
          )}

          <button
            id="btn-add-asset-eq"
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assets Main Table/Grid */}
        <div className={`${selectedAsset ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Equipment Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-3">Warehouse</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {sortedEquipments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No equipments match selection. Adjust filter parameters.
                    </td>
                  </tr>
                ) : (
                  sortedEquipments.map((eq) => {
                    const wh = warehouses.find(w => w.id === eq.warehouseId);
                    
                    return (
                      <tr 
                        key={eq.id} 
                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                          selectedAsset?.id === eq.id ? 'bg-blue-50/30 font-medium' : ''
                        }`}
                        onClick={() => setSelectedAsset(eq)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={eq.imageUrl || getEquipmentFallbackImage(eq.category, eq.name)}
                              alt={eq.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200/80 shadow-xs shrink-0 bg-slate-100"
                            />
                            <div className="space-y-0.5">
                              <span className="font-semibold text-slate-800 hover:text-blue-600 transition-colors block text-sm">
                                {eq.name}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="font-mono">SN: {eq.serialNumber}</span>
                                <span>&bull;</span>
                                <span>Mfr: {eq.manufacturer}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                          {eq.category}
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 text-xs font-medium">
                          {wh?.name ? wh.name.split(" (")[0] : "General Hub"}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            eq.status === EquipmentStatus.Active 
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                              : eq.status === EquipmentStatus.Maintenance 
                              ? "bg-amber-50 border-amber-200 text-amber-700 font-semibold" 
                              : eq.status === EquipmentStatus.ServiceRequired 
                              ? "bg-red-50 border-red-200 text-red-700 animate-pulse" 
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}>
                            {eq.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              title="Edit asset details"
                              onClick={() => openEditModal(eq)}
                              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Delete asset"
                              onClick={() => {
                                if (confirm(`Are you sure you want to permanently delete: ${eq.name}?`)) {
                                  onDeleteEquipment(eq.id);
                                  if (selectedAsset?.id === eq.id) setSelectedAsset(null);
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected asset details drawer (Right column) */}
        {selectedAsset && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 relative overflow-hidden">
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-600 transition-colors cursor-pointer z-10 shadow-xs border border-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Premium industrial equipment image header banner */}
            <div className="relative h-48 -mx-5 -mt-5 overflow-hidden bg-slate-100 border-b border-slate-150">
              <img
                src={selectedAsset.imageUrl || getEquipmentFallbackImage(selectedAsset.category, selectedAsset.name)}
                alt={selectedAsset.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-905/30 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{selectedAsset.category}</span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{selectedAsset.name}</h3>
              <div className="flex items-center gap-2 pt-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  selectedAsset.status === EquipmentStatus.Active 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                    : selectedAsset.status === EquipmentStatus.Maintenance 
                    ? "bg-amber-50 border-amber-200 text-amber-700" 
                    : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {selectedAsset.status}
                </span>
                <span className="text-xs text-slate-400">SN: {selectedAsset.serialNumber}</span>
              </div>
            </div>

            <div className="h-px bg-slate-100"></div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block font-medium">Mapped Warehouse</span>
                  <span className="font-semibold text-slate-700">
                    {warehouses.find(w => w.id === selectedAsset.warehouseId)?.name || "General Depot"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Hash className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block font-medium">Product Identifiers</span>
                  <span className="text-slate-700"><span className="font-semibold">Model:</span> {selectedAsset.model}</span>
                  <span className="text-slate-400 block mt-0.5"><span className="font-semibold">Mfr:</span> {selectedAsset.manufacturer}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block font-medium">Historical Timestamps</span>
                  <span className="text-slate-700 block">Purchase Date: <span className="font-semibold">{selectedAsset.purchaseDate}</span></span>
                  <span className="text-emerald-600 block mt-0.5">Last Maintained: <span className="font-semibold">{selectedAsset.lastMaintenanceDate || "Never"}</span></span>
                  <span className="text-blue-600 block mt-0.5">Next Maintenance: <span className="font-semibold">{selectedAsset.nextMaintenanceDate || "Unscheduled"}</span></span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <DollarSign className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block font-medium">Financial Valuation</span>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-700">
                      {selectedAsset.purchaseCost.toLocaleString()} {selectedAsset.currency || "USD"}
                    </span>
                    {(selectedAsset.currency || "USD") !== "CAD" ? (
                      <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded-lg font-semibold inline-block max-w-max">
                        &asymp; {((selectedAsset.purchaseCost || 0) * ((selectedAsset.currency || "USD") === "EUR" ? 1.48 : 1.37)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} CAD
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block">Pricing is natively in CAD</span>
                    )}
                  </div>
                </div>
              </div>

              {selectedAsset.specs && (
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5 mt-2">
                  <span className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider block">Mechanical Specs & Config</span>
                  <p className="text-slate-655 text-xs leading-relaxed whitespace-pre-line font-mono">
                    {selectedAsset.specs}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => openEditModal(selectedAsset)}
                className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Asset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleSaveCreate} className="p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Register Warehouse Asset</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Hyster Forklift, Backup Generator"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden text-slate-800"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Category *</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    <option value="Material Handling">Material Handling</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Automation / Sorting">Automation / Sorting</option>
                    <option value="Power Infrastructure">Power Infrastructure</option>
                    <option value="Loading Dock Systems">Loading Dock Systems</option>
                    <option value="Pneumatic Systems">Pneumatic Systems</option>
                    <option value="Safety Systems">Safety Systems</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Map Warehouse *</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                    value={formWarehouseId}
                    onChange={(e) => setFormWarehouseId(e.target.value)}
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Serial Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-883921-A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formSerialNumber}
                    onChange={(e) => setFormSerialNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. H120-VX"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Manufacturer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota, Caterpillar"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formManufacturer}
                    onChange={(e) => setFormManufacturer(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Purchase Cost *</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 15000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={formPurchaseCost}
                      onChange={(e) => setFormPurchaseCost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Currency</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer cursor-pointer text-slate-700 font-semibold"
                      value={formCurrency}
                      onChange={(e) => setFormCurrency(e.target.value as any)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Purchase Date *</label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formPurchaseDate}
                    onChange={(e) => setFormPurchaseDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Current Status *</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as EquipmentStatus)}
                  >
                    {Object.values(EquipmentStatus).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Last Maintenance Date</label>
                <input
                  type="date"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                  value={formLastMaintenanceDate}
                  onChange={(e) => setFormLastMaintenanceDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-slate-600 block">Equipment Photo (Image File or URL)</label>
                <div className="space-y-2">
                  {formImageUrl && (
                    <div className="flex items-center gap-2 border border-slate-200 p-2 rounded-xl bg-slate-50 max-w-max">
                      <img src={formImageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormImageUrl("")}
                        className="text-xs text-rose-500 font-semibold px-2 py-1 hover:bg-rose-55 rounded cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-slate-200 file:bg-slate-50 file:hover:bg-slate-100 cursor-pointer"
                  />
                  <input
                    type="url"
                    placeholder="O proporciona URL directa HTTPS de la foto (dejar vacío para usar foto por defecto)..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Sube una foto desde tu computadora o introduce una URL HTTPS pública (Unsplash, Imgur, etc.)</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Mechanical Specs / Config Parameters</label>
                <textarea
                  placeholder="Insert capacity values, fuel requirements, weights, dimensions, electrical parameters..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden font-mono"
                  value={formSpecs}
                  onChange={(e) => setFormSpecs(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleSaveEdit} className="p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Edit Asset Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden text-slate-800"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Category *</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    <option value="Material Handling">Material Handling</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Automation / Sorting">Automation / Sorting</option>
                    <option value="Power Infrastructure">Power Infrastructure</option>
                    <option value="Loading Dock Systems">Loading Dock Systems</option>
                    <option value="Pneumatic Systems">Pneumatic Systems</option>
                    <option value="Safety Systems">Safety Systems</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Map Warehouse *</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                    value={formWarehouseId}
                    onChange={(e) => setFormWarehouseId(e.target.value)}
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Serial Number *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formSerialNumber}
                    onChange={(e) => setFormSerialNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Model *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Manufacturer *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formManufacturer}
                    onChange={(e) => setFormManufacturer(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Purchase Cost *</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={formPurchaseCost}
                      onChange={(e) => setFormPurchaseCost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Currency</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer cursor-pointer text-slate-700 font-semibold"
                      value={formCurrency}
                      onChange={(e) => setFormCurrency(e.target.value as any)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Purchase Date *</label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formPurchaseDate}
                    onChange={(e) => setFormPurchaseDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Current Status *</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as EquipmentStatus)}
                  >
                    {Object.values(EquipmentStatus).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Last Maintenance Date</label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formLastMaintenanceDate || ""}
                    onChange={(e) => setFormLastMaintenanceDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Next Maintenance Date</label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formNextMaintenanceDate || ""}
                    onChange={(e) => setFormNextMaintenanceDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-slate-600 block">Equipment Photo (Image File or URL)</label>
                <div className="space-y-2">
                  {formImageUrl && (
                    <div className="flex items-center gap-2 border border-slate-200 p-2 rounded-xl bg-slate-50 max-w-max">
                      <img src={formImageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormImageUrl("")}
                        className="text-xs text-rose-500 font-semibold px-2 py-1 hover:bg-rose-55 rounded cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-slate-200 file:bg-slate-50 file:hover:bg-slate-100 cursor-pointer"
                  />
                  <input
                    type="url"
                    placeholder="O proporciona URL directa HTTPS de la foto (dejar vacío para usar foto por defecto)..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Sube una foto desde tu computadora o introduce una URL HTTPS pública (Unsplash, Imgur, etc.)</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Mechanical Specs / Config Parameters</label>
                <textarea
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden font-mono"
                  value={formSpecs}
                  onChange={(e) => setFormSpecs(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

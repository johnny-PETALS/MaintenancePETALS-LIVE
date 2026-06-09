import React, { useState } from "react";
import { Company, CompanyType } from "../types";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  User,
  Wrench
} from "lucide-react";

interface CompanyListProps {
  companies: Company[];
  onAddCompany: (comp: Omit<Company, "id">) => void;
  onUpdateCompany: (comp: Company) => void;
  onDeleteCompany: (id: string) => void;
}

export default function CompanyList({
  companies,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany
}: CompanyListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<CompanyType | "">("");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [type, setType] = useState<CompanyType>(CompanyType.ServiceProvider);
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [rating, setRating] = useState(5);
  const [servicesOffered, setServicesOffered] = useState("");

  const handleOpenAdd = () => {
    setName("");
    setType(CompanyType.ServiceProvider);
    setContactPerson("");
    setPhone("");
    setEmail("");
    setAddress("");
    setRating(5);
    setServicesOffered("");
    setIsAddOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactPerson) {
      alert("Please fill name and contact point person");
      return;
    }

    onAddCompany({
      name,
      type,
      contactPerson,
      phone,
      email,
      address,
      rating,
      servicesOffered
    });

    setIsAddOpen(false);
  };

  const handleOpenEdit = (comp: Company) => {
    setEditingCompany(comp);
    setName(comp.name);
    setType(comp.type);
    setContactPerson(comp.contactPerson);
    setPhone(comp.phone);
    setEmail(comp.email);
    setAddress(comp.address);
    setRating(comp.rating);
    setServicesOffered(comp.servicesOffered);
    setIsEditOpen(true);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany || !name) return;

    onUpdateCompany({
      id: editingCompany.id,
      name,
      type,
      contactPerson,
      phone,
      email,
      address,
      rating,
      servicesOffered
    });

    setIsEditOpen(false);
    setEditingCompany(null);
  };

  // Filters
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.servicesOffered.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType ? c.type === selectedType : true;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Filters & Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            id="company-search-input"
            type="text"
            placeholder="Search providers by name, contact, specialized services..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-blue-500 focus:outline-hidden rounded-xl text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            id="company-filter-type"
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 cursor-pointer font-semibold text-slate-700"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CompanyType | "")}
          >
            <option value="">All Company Types</option>
            {Object.values(CompanyType).map(ct => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>

          <button
            id="btn-add-company"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ml-auto transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Partner
          </button>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.map(comp => (
          <div key={comp.id} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between hover:border-slate-350 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wide">{comp.type}</span>
                  <h3 className="font-bold text-slate-900 text-base">
                    {comp.name}
                  </h3>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < comp.rating ? "fill-amber-500" : "text-slate-200"}`} 
                    />
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex items-start gap-2.5 text-slate-655">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Point of Contact</span>
                    <span className="font-semibold text-slate-700">{comp.contactPerson}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-655">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Phone</span>
                    <a href={`tel:${comp.phone}`} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">{comp.phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-655">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Email</span>
                    <a href={`mailto:${comp.email}`} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">{comp.email}</a>
                  </div>
                </div>

                {comp.address && (
                  <div className="flex items-start gap-2.5 text-slate-655">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Office Address</span>
                      <span className="text-slate-600">{comp.address}</span>
                    </div>
                  </div>
                )}

                {comp.servicesOffered && (
                  <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-slate-400" /> Authorized Specialties
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-mono">
                      {comp.servicesOffered}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-55 mt-4 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest font-mono">Supplier Node ID</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(comp)}
                  className="p-1 px-3 text-xs font-semibold hover:bg-slate-50 border border-slate-200 text-slate-650 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Do you wish to remove vendor: ${comp.name}?`)) {
                      onDeleteCompany(comp.id);
                    }
                  }}
                  className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE PARTNER MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleSubmitAdd} className="p-6 md:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Register Servicing Partner</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Industrial Solutions"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Partner Designation Type *</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                      value={type}
                      onChange={(e) => setType(e.target.value as CompanyType)}
                    >
                      {Object.values(CompanyType).map(ct => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Lead Point Contact *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ron Miller"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Phone Line</label>
                    <input
                      type="text"
                      placeholder="+1 (800) 555-0100"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Email Address</label>
                    <input
                      type="email"
                      placeholder="support@partner.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Office Headquarters Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 100 Industrial Ln, Seattle WA"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Performance Rating (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden font-bold"
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value) || 5)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Certified Mechanical Specialties / Services Covered</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Cummins diesel diagnostics, hydraulic line swaps, electric conveyor controllers..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={servicesOffered}
                    onChange={(e) => setServicesOffered(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Partner Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PARTNER MODAL */}
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
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Edit Partner Node</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Partner Designation Type *</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                      value={type}
                      onChange={(e) => setType(e.target.value as CompanyType)}
                    >
                      {Object.values(CompanyType).map(ct => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Lead Point Contact *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Phone Line</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Office Headquarters Address</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Performance Rating (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value) || 5)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Certified Mechanical Specialties / Services Covered</label>
                  <textarea
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={servicesOffered}
                    onChange={(e) => setServicesOffered(e.target.value)}
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
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
